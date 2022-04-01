using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Opus.DataAcces.Migrations
{
    public partial class InitialMigration11 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BloodType",
                table: "Staff");

            migrationBuilder.AddColumn<int>(
                name: "BloodTypeId",
                table: "Staff",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "StaffEquipment",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StaffId = table.Column<int>(type: "int", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    DeliveryDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ReturnDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StaffEquipment", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StaffEquipment");

            migrationBuilder.DropColumn(
                name: "BloodTypeId",
                table: "Staff");

            migrationBuilder.AddColumn<string>(
                name: "BloodType",
                table: "Staff",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
