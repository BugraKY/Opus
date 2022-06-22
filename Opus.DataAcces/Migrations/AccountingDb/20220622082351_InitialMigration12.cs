using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Opus.DataAcces.Migrations.AccountingDb
{
    public partial class InitialMigration12 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Discount_Rate",
                table: "PurchaseInvoiceDetails");

            migrationBuilder.AddColumn<float>(
                name: "Vat_1",
                table: "PurchaseInvoice",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<float>(
                name: "Vat_18",
                table: "PurchaseInvoice",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<float>(
                name: "Vat_8",
                table: "PurchaseInvoice",
                type: "real",
                nullable: false,
                defaultValue: 0f);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Vat_1",
                table: "PurchaseInvoice");

            migrationBuilder.DropColumn(
                name: "Vat_18",
                table: "PurchaseInvoice");

            migrationBuilder.DropColumn(
                name: "Vat_8",
                table: "PurchaseInvoice");

            migrationBuilder.AddColumn<float>(
                name: "Discount_Rate",
                table: "PurchaseInvoiceDetails",
                type: "real",
                nullable: false,
                defaultValue: 0f);
        }
    }
}
