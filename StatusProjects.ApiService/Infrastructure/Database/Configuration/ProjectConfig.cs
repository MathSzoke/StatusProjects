using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StatusProjects.ApiService.Models;

namespace StatusProjects.ApiService.Infrastructure.Database.Configuration;

internal sealed class ProjectConfig : IEntityTypeConfiguration<Projects>
{
    public void Configure(EntityTypeBuilder<Projects> b)
    {
        b.HasKey(x => x.Id);
        b.HasIndex(x => x.UrlEndpoint);
    }
}
