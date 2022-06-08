using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Opus.DataAcces.Migrations.AccountingDb
{
    public partial class InitialMigration4 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "IdentificationId",
                table: "Contact",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Contact_IdentificationId",
                table: "Contact",
                column: "IdentificationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Contact_Identification_IdentificationId",
                table: "Contact",
                column: "IdentificationId",
                principalTable: "Identification",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Contact_Identification_IdentificationId",
                table: "Contact");

            migrationBuilder.DropIndex(
                name: "IX_Contact_IdentificationId",
                table: "Contact");

            migrationBuilder.DropColumn(
                name: "IdentificationId",
                table: "Contact");
        }
    }
}
