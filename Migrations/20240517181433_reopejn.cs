using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FFnF_Request.Migrations
{
    /// <inheritdoc />
    public partial class reopejn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SentByDepartmentId",
                table: "Complaints",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ReopenAt",
                table: "ComplaintAttachments",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SentByDepartmentId",
                table: "Complaints");

            migrationBuilder.DropColumn(
                name: "ReopenAt",
                table: "ComplaintAttachments");
        }
    }
}
