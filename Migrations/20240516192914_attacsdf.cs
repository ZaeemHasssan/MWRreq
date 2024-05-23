using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FFnF_Request.Migrations
{
    /// <inheritdoc />
    public partial class attacsdf : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "ReCreatedAt",
                table: "ComplaintAttachments",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<string>(
                name: "CloseAt",
                table: "ComplaintAttachments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ComplaintAttachments_ComplaintId",
                table: "ComplaintAttachments",
                column: "ComplaintId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ComplaintAttachments_Complaints_ComplaintId",
                table: "ComplaintAttachments",
                column: "ComplaintId",
                principalTable: "Complaints",
                principalColumn: "ComplaintId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ComplaintAttachments_Complaints_ComplaintId",
                table: "ComplaintAttachments");

            migrationBuilder.DropIndex(
                name: "IX_ComplaintAttachments_ComplaintId",
                table: "ComplaintAttachments");

            migrationBuilder.DropColumn(
                name: "CloseAt",
                table: "ComplaintAttachments");

            migrationBuilder.AlterColumn<DateTime>(
                name: "ReCreatedAt",
                table: "ComplaintAttachments",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }
    }
}
