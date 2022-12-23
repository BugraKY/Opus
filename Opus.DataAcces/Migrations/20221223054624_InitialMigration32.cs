using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Opus.DataAcces.Migrations
{
    public partial class InitialMigration32 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ApiUser_AspNetUsers_ApplicationUserId",
                table: "ApiUser");

            migrationBuilder.DropIndex(
                name: "IX_ApiUser_ApplicationUserId",
                table: "ApiUser");

            migrationBuilder.DropColumn(
                name: "ApplicationUserId",
                table: "ApiUser");

            migrationBuilder.AddColumn<long>(
                name: "StaffId",
                table: "ApiUser",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateIndex(
                name: "IX_ApiUser_StaffId",
                table: "ApiUser",
                column: "StaffId");

            migrationBuilder.AddForeignKey(
                name: "FK_ApiUser_Staff_StaffId",
                table: "ApiUser",
                column: "StaffId",
                principalTable: "Staff",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ApiUser_Staff_StaffId",
                table: "ApiUser");

            migrationBuilder.DropIndex(
                name: "IX_ApiUser_StaffId",
                table: "ApiUser");

            migrationBuilder.DropColumn(
                name: "StaffId",
                table: "ApiUser");

            migrationBuilder.AddColumn<string>(
                name: "ApplicationUserId",
                table: "ApiUser",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ApiUser_ApplicationUserId",
                table: "ApiUser",
                column: "ApplicationUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ApiUser_AspNetUsers_ApplicationUserId",
                table: "ApiUser",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
