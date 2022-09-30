using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Opus.DataAcces.Migrations
{
    public partial class InitialMigration25 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TimeKeeping",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<long>(type: "bigint", nullable: false),
                    Ay = table.Column<int>(type: "int", nullable: false),
                    Yil = table.Column<int>(type: "int", nullable: false),
                    D01 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D02 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D03 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D04 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D05 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D06 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D07 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D08 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D09 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D10 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D11 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D12 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D13 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D14 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D15 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D16 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D17 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D18 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D19 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D20 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D21 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D22 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D23 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D24 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D25 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D26 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D27 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D28 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D29 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D30 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D31 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    S1 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    T1 = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TimeKeeping", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TimeKeepingDescreption",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<long>(type: "bigint", nullable: false),
                    Ay = table.Column<int>(type: "int", nullable: false),
                    Yil = table.Column<int>(type: "int", nullable: false),
                    D01 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D02 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D03 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D04 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D05 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D06 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D07 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D08 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D09 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D10 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D11 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D12 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D13 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D14 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D15 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D16 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D17 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D18 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D19 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D20 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D21 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D22 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D23 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D24 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D25 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D26 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D27 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D28 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D29 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D30 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    D31 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    S1 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    T1 = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TimeKeepingDescreption", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TimeKeeping");

            migrationBuilder.DropTable(
                name: "TimeKeepingDescreption");
        }
    }
}
