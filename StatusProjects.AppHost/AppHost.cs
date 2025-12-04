var builder = DistributedApplication.CreateBuilder(args);

var redis = builder.AddRedis("cache");

var pgPassword = builder.AddParameter("postgres-password", true);

var db = builder.AddPostgres("postgres-server")
            .WithPassword(pgPassword)
            .WithDataVolume("postgres_data")
            .WithPgAdmin()
            .AddDatabase("portfolioDB");

var apiService = builder.AddProject<Projects.StatusProjects_ApiService>("apiservice")
    .WithReference(redis)
    .WithReference(db)
    .WithHttpHealthCheck("/health")
    .WaitFor(redis)
    .WaitFor(db)
    .WithUrlForEndpoint("https", url =>
    {
        url.DisplayText = "Swagger";
        url.Url = "/swagger";
    });

var frontend = builder.AddNpmApp("frontend", "../statusprojects.web", "dev")
    .WithHttpEndpoint(5173, env: "VITE_PORT")
    .WithExternalHttpEndpoints()
    .WithReference(apiService)
    .WaitFor(apiService)
    .WithEnvironment("VITE_API_BASE", apiService.GetEndpoint("https"));

builder.Build().Run();