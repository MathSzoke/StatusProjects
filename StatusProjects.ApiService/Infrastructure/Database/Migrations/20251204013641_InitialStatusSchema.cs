using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StatusProjects.ApiService.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class InitialStatusSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "status");

            migrationBuilder.CreateTable(
                name: "Projects",
                schema: "status",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    UrlRedirect = table.Column<string>(type: "text", nullable: false),
                    UrlEndpoint = table.Column<string>(type: "text", nullable: false),
                    Latency = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Projects_UrlEndpoint",
                schema: "status",
                table: "Projects",
                column: "UrlEndpoint");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Projects",
                schema: "status");
        }
    }
}
