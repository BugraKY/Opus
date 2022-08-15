using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Opus.DataAcces.Migrations.ReferenceVerifDb
{
    public partial class InitialMigration3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ReferenceNum",
                table: "Verifications",
                newName: "CustomerReference");

            migrationBuilder.RenameColumn(
                name: "ReferenceCode",
                table: "Verifications",
                newName: "CompanyReference");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CustomerReference",
                table: "Verifications",
                newName: "ReferenceNum");

            migrationBuilder.RenameColumn(
                name: "CompanyReference",
                table: "Verifications",
                newName: "ReferenceCode");
        }
    }
}
