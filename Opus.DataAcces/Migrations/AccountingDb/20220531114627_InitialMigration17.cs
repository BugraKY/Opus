using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Opus.DataAcces.Migrations.AccountingDb
{
    public partial class InitialMigration17 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Contact_CommercialTitle_CommercialTitleId",
                table: "Contact");

            migrationBuilder.RenameColumn(
                name: "CommercialTitleId",
                table: "Contact",
                newName: "DepartmantId");

            migrationBuilder.RenameIndex(
                name: "IX_Contact_CommercialTitleId",
                table: "Contact",
                newName: "IX_Contact_DepartmantId");

            migrationBuilder.AddForeignKey(
                name: "FK_Contact_Departmant_DepartmantId",
                table: "Contact",
                column: "DepartmantId",
                principalTable: "Departmant",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Contact_Departmant_DepartmantId",
                table: "Contact");

            migrationBuilder.RenameColumn(
                name: "DepartmantId",
                table: "Contact",
                newName: "CommercialTitleId");

            migrationBuilder.RenameIndex(
                name: "IX_Contact_DepartmantId",
                table: "Contact",
                newName: "IX_Contact_CommercialTitleId");

            migrationBuilder.AddForeignKey(
                name: "FK_Contact_CommercialTitle_CommercialTitleId",
                table: "Contact",
                column: "CommercialTitleId",
                principalTable: "CommercialTitle",
                principalColumn: "Id");
        }
    }
}
