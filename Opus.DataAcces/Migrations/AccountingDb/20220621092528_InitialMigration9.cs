using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Opus.DataAcces.Migrations.AccountingDb
{
    public partial class InitialMigration9 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "IdentificationId",
                table: "PurchaseInvoice",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseInvoice_IdentificationId",
                table: "PurchaseInvoice",
                column: "IdentificationId");

            migrationBuilder.AddForeignKey(
                name: "FK_PurchaseInvoice_Identification_IdentificationId",
                table: "PurchaseInvoice",
                column: "IdentificationId",
                principalTable: "Identification",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PurchaseInvoice_Identification_IdentificationId",
                table: "PurchaseInvoice");

            migrationBuilder.DropIndex(
                name: "IX_PurchaseInvoice_IdentificationId",
                table: "PurchaseInvoice");

            migrationBuilder.DropColumn(
                name: "IdentificationId",
                table: "PurchaseInvoice");
        }
    }
}
