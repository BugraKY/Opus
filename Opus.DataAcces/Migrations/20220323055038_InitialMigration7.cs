using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Opus.DataAcces.Migrations
{
    public partial class InitialMigration7 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Active",
                table: "Staff");

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Staff",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Staff");

            migrationBuilder.AddColumn<bool>(
                name: "Active",
                table: "Staff",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
