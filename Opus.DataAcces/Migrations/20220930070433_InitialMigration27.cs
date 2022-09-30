using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Opus.DataAcces.Migrations
{
    public partial class InitialMigration27 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "TimeKeepingDescreption",
                newName: "StaffId");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "TimeKeeping",
                newName: "StaffId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "StaffId",
                table: "TimeKeepingDescreption",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "StaffId",
                table: "TimeKeeping",
                newName: "UserId");
        }
    }
}
