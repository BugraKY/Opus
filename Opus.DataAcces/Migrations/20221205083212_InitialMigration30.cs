using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Opus.DataAcces.Migrations
{
    public partial class InitialMigration30 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<long>(
                name: "UserIntId",
                table: "LocationInOut",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "UserIntId",
                table: "LocationInOut",
                type: "int",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");
        }
    }
}
