using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Opus.DataAcces.Migrations.ReferenceVerifDb
{
    public partial class InitialMigration2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Verifications_Companies_CompanyId",
                table: "Verifications");

            migrationBuilder.RenameColumn(
                name: "CompanyId",
                table: "Verifications",
                newName: "CustomerDefinitionsId");

            migrationBuilder.RenameIndex(
                name: "IX_Verifications_CompanyId",
                table: "Verifications",
                newName: "IX_Verifications_CustomerDefinitionsId");

            migrationBuilder.AddForeignKey(
                name: "FK_Verifications_CustomersDefinitions_CustomerDefinitionsId",
                table: "Verifications",
                column: "CustomerDefinitionsId",
                principalTable: "CustomersDefinitions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Verifications_CustomersDefinitions_CustomerDefinitionsId",
                table: "Verifications");

            migrationBuilder.RenameColumn(
                name: "CustomerDefinitionsId",
                table: "Verifications",
                newName: "CompanyId");

            migrationBuilder.RenameIndex(
                name: "IX_Verifications_CustomerDefinitionsId",
                table: "Verifications",
                newName: "IX_Verifications_CompanyId");

            migrationBuilder.AddForeignKey(
                name: "FK_Verifications_Companies_CompanyId",
                table: "Verifications",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
