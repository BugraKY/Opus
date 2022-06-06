using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Opus.DataAcces.Migrations.AccountingDb
{
    public partial class InitialMigration2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PaymentTerm30",
                table: "Identification");

            migrationBuilder.DropColumn(
                name: "PaymentTerm60",
                table: "Identification");

            migrationBuilder.DropColumn(
                name: "PaymentTerm90",
                table: "Identification");

            migrationBuilder.AddColumn<int>(
                name: "PaymentTerm",
                table: "Identification",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PaymentTerm",
                table: "Identification");

            migrationBuilder.AddColumn<bool>(
                name: "PaymentTerm30",
                table: "Identification",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PaymentTerm60",
                table: "Identification",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PaymentTerm90",
                table: "Identification",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
