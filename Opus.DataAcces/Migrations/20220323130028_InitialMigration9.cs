using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Opus.DataAcces.Migrations
{
    public partial class InitialMigration9 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FamilyMembers_Staff_StaffId1",
                table: "FamilyMembers");

            migrationBuilder.DropIndex(
                name: "IX_FamilyMembers_StaffId1",
                table: "FamilyMembers");

            migrationBuilder.DropColumn(
                name: "FamilyMembersId",
                table: "Staff");

            migrationBuilder.DropColumn(
                name: "StaffId1",
                table: "FamilyMembers");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FamilyMembersId",
                table: "Staff",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "StaffId1",
                table: "FamilyMembers",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_FamilyMembers_StaffId1",
                table: "FamilyMembers",
                column: "StaffId1");

            migrationBuilder.AddForeignKey(
                name: "FK_FamilyMembers_Staff_StaffId1",
                table: "FamilyMembers",
                column: "StaffId1",
                principalTable: "Staff",
                principalColumn: "Id");
        }
    }
}
