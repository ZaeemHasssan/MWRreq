using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FFnF_Request.Migrations
{
    /// <inheritdoc />
    public partial class reopenat : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SentToDepartmentIds",
                table: "Complaints",
                newName: "SentToDepartmentId");

            migrationBuilder.AddColumn<string>(
                name: "ClosedAt",
                table: "Complaints",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ClosedAt",
                table: "Complaints");

            migrationBuilder.RenameColumn(
                name: "SentToDepartmentId",
                table: "Complaints",
                newName: "SentToDepartmentIds");
        }
    }
}
