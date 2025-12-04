using Microsoft.EntityFrameworkCore;
using StatusProjects.ApiService.Models;

namespace StatusProjects.ApiService.Infrastructure.Database;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options), IAppDbContext
{
    public DbSet<Projects> Projects => this.Set<Projects>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        modelBuilder.HasDefaultSchema(Schemas.Default);
    }
}