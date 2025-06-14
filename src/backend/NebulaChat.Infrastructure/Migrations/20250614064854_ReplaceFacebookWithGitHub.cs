using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NebulaChat.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ReplaceFacebookWithGitHub : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "FacebookId",
                table: "Users",
                newName: "GitHubId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "GitHubId",
                table: "Users",
                newName: "FacebookId");
        }
    }
}
