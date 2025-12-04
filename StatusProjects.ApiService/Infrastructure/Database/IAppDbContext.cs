using Microsoft.EntityFrameworkCore;
using StatusProjects.ApiService.Models;

namespace StatusProjects.ApiService.Infrastructure.Database;

public interface IAppDbContext
{
    DbSet<Projects> Projects { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}