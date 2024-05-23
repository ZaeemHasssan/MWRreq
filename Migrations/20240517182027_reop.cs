using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FFnF_Request.Migrations
{
    /// <inheritdoc />
    public partial class reop : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SentByDepartmentId",
                table: "Complaints");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SentByDepartmentId",
                table: "Complaints",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
