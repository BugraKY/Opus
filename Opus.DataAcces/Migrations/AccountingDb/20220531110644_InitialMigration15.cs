using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Opus.DataAcces.Migrations.AccountingDb
{
    public partial class InitialMigration15 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
                name: "CommercialTitleId",
                table: "Identification",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Identification_CommercialTitleId",
                table: "Identification",
                column: "CommercialTitleId");

            migrationBuilder.AddForeignKey(
                name: "FK_Identification_CommercialTitle_CommercialTitleId",
                table: "Identification",
                column: "CommercialTitleId",
                principalTable: "CommercialTitle",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Identification_CommercialTitle_CommercialTitleId",
                table: "Identification");

            migrationBuilder.DropIndex(
                name: "IX_Identification_CommercialTitleId",
                table: "Identification");

            migrationBuilder.AlterColumn<string>(
                name: "CommercialTitleId",
                table: "Identification",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");
        }
    }
}
