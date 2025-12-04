using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using StatusProjects.ApiService.Infrastructure.Database;
using StatusProjects.ApiService.Models;
using System.Diagnostics;
using HealthChecks.UI.Client;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.Services.AddCors();

builder.Services.AddHttpClient();

builder.Services.AddOpenApi();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "Status projects API",
        Description = "API for Status projects"
    });
});

builder.Services.AddProblemDetails();

builder.Services.AddScoped<IAppDbContext>(sp => sp.GetRequiredService<AppDbContext>());

builder.AddNpgsqlDbContext<AppDbContext>("portfolioDB", configureDbContextOptions: options =>
{
    options.EnableDetailedErrors();
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.UseCors(_ => _.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
app.UseSwagger();
app.UseSwaggerUI();

app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapPost("/registerProject", async (RegisterProject project, AppDbContext db, IHttpClientFactory httpClientFactory) =>
{
    var client = httpClientFactory.CreateClient();
    var stopwatch = new Stopwatch();
    var latency = 0;
    var status = Status.Inactive;

    var endpoint = project.UrlEndpoint;

    if (!endpoint.EndsWith("/health", StringComparison.OrdinalIgnoreCase))
    {
        endpoint = endpoint.TrimEnd('/') + "/health";
    }

    try
    {
        stopwatch.Start();
        var response = await client.GetAsync(endpoint);
        stopwatch.Stop();

        latency = (int)stopwatch.ElapsedMilliseconds;

        if (!response.IsSuccessStatusCode)
        {
            status = Status.Inactive;
        }
        else
        {
            if (latency < 1000)
            {
                status = Status.Active;
            }
            else
            {
                status = Status.LowActivity;
            }
        }
    }
    catch
    {
        stopwatch.Stop();
        latency = 0;
        status = Status.Inactive;
    }

    var p = new Projects
    {
        Id = Guid.NewGuid(),
        Name = project.Name,
        UrlEndpoint = endpoint,
        UrlRedirect = project.UrlRedirect,
        Latency = latency,
        Status = status
    };

    db.Projects.Add(p);
    await db.SaveChangesAsync();

    var result = new
    {
        p.Id,
        p.Name,
        p.UrlRedirect,
        endpoint,
        p.Latency,
        Status = p.Status.ToString()
    };

    return Results.Created($"/getStatusProjects/{p.Id}", result);
});

app.MapGet("/getStatusProjects", async (AppDbContext db, IHttpClientFactory httpClientFactory) =>
{
    var projects = await db.Projects.ToListAsync();

    var client = httpClientFactory.CreateClient();

    var tasks = projects.Select(async project =>
    {
        var stopwatch = Stopwatch.StartNew();
        try
        {
            var response = await client.GetAsync(project.UrlEndpoint);
            stopwatch.Stop();

            project.Latency = (int)stopwatch.ElapsedMilliseconds;

            if (!response.IsSuccessStatusCode)
            {
                project.Status = Status.Inactive;
            }
            else
            {
                if (project.Latency < 1000)
                {
                    project.Status = Status.Active;
                }
                else
                {
                    project.Status = Status.LowActivity;
                }
            }
        }
        catch
        {
            stopwatch.Stop();
            project.Latency = 0;
            project.Status = Status.Inactive;
        }

        return project;
    });

    await Task.WhenAll(tasks);
    await db.SaveChangesAsync();

    var result = projects.Select(p => new
    {
        p.Id,
        p.Name,
        p.UrlRedirect,
        p.UrlEndpoint,
        p.Latency,
        Status = p.Status.ToString()
    });

    return Results.Ok(result);
});

app.MapDefaultEndpoints();

app.Run();

internal sealed record RegisterProject(string Name, string UrlRedirect, string UrlEndpoint);
