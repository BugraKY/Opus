using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Opus.DataAcces.Migrations.AccountingDb
{
    public partial class InitialMigration14 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BankName",
                table: "Identification");

            migrationBuilder.AddColumn<Guid>(
                name: "BankId",
                table: "Identification",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Identification_BankId",
                table: "Identification",
                column: "BankId");

            migrationBuilder.AddForeignKey(
                name: "FK_Identification_Bank_BankId",
                table: "Identification",
                column: "BankId",
                principalTable: "Bank",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Identification_Bank_BankId",
                table: "Identification");

            migrationBuilder.DropIndex(
                name: "IX_Identification_BankId",
                table: "Identification");

            migrationBuilder.DropColumn(
                name: "BankId",
                table: "Identification");

            migrationBuilder.AddColumn<string>(
                name: "BankName",
                table: "Identification",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
