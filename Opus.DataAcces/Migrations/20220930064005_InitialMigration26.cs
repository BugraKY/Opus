using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Opus.DataAcces.Migrations
{
    public partial class InitialMigration26 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Yil",
                table: "TimeKeepingDescreption",
                newName: "Year");

            migrationBuilder.RenameColumn(
                name: "Ay",
                table: "TimeKeepingDescreption",
                newName: "Month");

            migrationBuilder.RenameColumn(
                name: "Yil",
                table: "TimeKeeping",
                newName: "Year");

            migrationBuilder.RenameColumn(
                name: "Ay",
                table: "TimeKeeping",
                newName: "Month");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Year",
                table: "TimeKeepingDescreption",
                newName: "Yil");

            migrationBuilder.RenameColumn(
                name: "Month",
                table: "TimeKeepingDescreption",
                newName: "Ay");

            migrationBuilder.RenameColumn(
                name: "Year",
                table: "TimeKeeping",
                newName: "Yil");

            migrationBuilder.RenameColumn(
                name: "Month",
                table: "TimeKeeping",
                newName: "Ay");
        }
    }
}
