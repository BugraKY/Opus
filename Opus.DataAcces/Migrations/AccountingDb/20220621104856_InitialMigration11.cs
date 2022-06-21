using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Opus.DataAcces.Migrations.AccountingDb
{
    public partial class InitialMigration11 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CompanyId",
                table: "PurchaseInvoice",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseInvoice_CompanyId",
                table: "PurchaseInvoice",
                column: "CompanyId");

            migrationBuilder.AddForeignKey(
                name: "FK_PurchaseInvoice_Company_CompanyId",
                table: "PurchaseInvoice",
                column: "CompanyId",
                principalTable: "Company",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PurchaseInvoice_Company_CompanyId",
                table: "PurchaseInvoice");

            migrationBuilder.DropIndex(
                name: "IX_PurchaseInvoice_CompanyId",
                table: "PurchaseInvoice");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "PurchaseInvoice");
        }
    }
}
