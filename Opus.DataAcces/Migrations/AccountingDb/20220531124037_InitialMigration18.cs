using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Opus.DataAcces.Migrations.AccountingDb
{
    public partial class InitialMigration18 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CompanyId",
                table: "Identification",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Identification_CompanyId",
                table: "Identification",
                column: "CompanyId");

            migrationBuilder.AddForeignKey(
                name: "FK_Identification_Company_CompanyId",
                table: "Identification",
                column: "CompanyId",
                principalTable: "Company",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Identification_Company_CompanyId",
                table: "Identification");

            migrationBuilder.DropIndex(
                name: "IX_Identification_CompanyId",
                table: "Identification");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "Identification");
        }
    }
}
