using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Opus.DataAcces.Migrations.AccountingDb
{
    public partial class InitialMigration16 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Contact_CompanyDepartments_CompanyDepartmantsId",
                table: "Contact");

            migrationBuilder.DropIndex(
                name: "IX_Contact_CompanyDepartmantsId",
                table: "Contact");

            migrationBuilder.DropColumn(
                name: "CompanyDepartmantsId",
                table: "Contact");

            migrationBuilder.AddColumn<Guid>(
                name: "CommercialTitleId",
                table: "Contact",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Contact_CommercialTitleId",
                table: "Contact",
                column: "CommercialTitleId");

            migrationBuilder.AddForeignKey(
                name: "FK_Contact_CommercialTitle_CommercialTitleId",
                table: "Contact",
                column: "CommercialTitleId",
                principalTable: "CommercialTitle",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Contact_CommercialTitle_CommercialTitleId",
                table: "Contact");

            migrationBuilder.DropIndex(
                name: "IX_Contact_CommercialTitleId",
                table: "Contact");

            migrationBuilder.DropColumn(
                name: "CommercialTitleId",
                table: "Contact");

            migrationBuilder.AddColumn<Guid>(
                name: "CompanyDepartmantsId",
                table: "Contact",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Contact_CompanyDepartmantsId",
                table: "Contact",
                column: "CompanyDepartmantsId");

            migrationBuilder.AddForeignKey(
                name: "FK_Contact_CompanyDepartments_CompanyDepartmantsId",
                table: "Contact",
                column: "CompanyDepartmantsId",
                principalTable: "CompanyDepartments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
