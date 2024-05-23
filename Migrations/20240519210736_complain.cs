using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FFnF_Request.Migrations
{
    /// <inheritdoc />
    public partial class complain : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ReopenCount",
                table: "ComplaintAttachments",
                newName: "ReOpenCount");

            migrationBuilder.RenameColumn(
                name: "ReopenAt",
                table: "ComplaintAttachments",
                newName: "ReOpenAt");

            migrationBuilder.RenameColumn(
                name: "ReCreatedAt",
                table: "ComplaintAttachments",
                newName: "ReopenDates");

            migrationBuilder.AddColumn<string>(
                name: "ReCloseAt",
                table: "ComplaintAttachments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ReCloseCount",
                table: "ComplaintAttachments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ReCloseDates",
                table: "ComplaintAttachments",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReCloseAt",
                table: "ComplaintAttachments");

            migrationBuilder.DropColumn(
                name: "ReCloseCount",
                table: "ComplaintAttachments");

            migrationBuilder.DropColumn(
                name: "ReCloseDates",
                table: "ComplaintAttachments");

            migrationBuilder.RenameColumn(
                name: "ReOpenCount",
                table: "ComplaintAttachments",
                newName: "ReopenCount");

            migrationBuilder.RenameColumn(
                name: "ReOpenAt",
                table: "ComplaintAttachments",
                newName: "ReopenAt");

            migrationBuilder.RenameColumn(
                name: "ReopenDates",
                table: "ComplaintAttachments",
                newName: "ReCreatedAt");
        }
    }
}
