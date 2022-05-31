using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Opus.DataAcces.Migrations.AccountingDb
{
    public partial class InitialMigration10 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
                name: "IdentificationTypeId",
                table: "Identification",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "IdentificationId",
                table: "ContactDefinitions",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "ContactId",
                table: "ContactDefinitions",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "CompanyDepartmantsId",
                table: "Contact",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "DepartmantId",
                table: "CompanyDepartments",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "CompanyId",
                table: "CompanyDepartments",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Identification_IdentificationTypeId",
                table: "Identification",
                column: "IdentificationTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ContactDefinitions_ContactId",
                table: "ContactDefinitions",
                column: "ContactId");

            migrationBuilder.CreateIndex(
                name: "IX_ContactDefinitions_IdentificationId",
                table: "ContactDefinitions",
                column: "IdentificationId");

            migrationBuilder.CreateIndex(
                name: "IX_Contact_CompanyDepartmantsId",
                table: "Contact",
                column: "CompanyDepartmantsId");

            migrationBuilder.CreateIndex(
                name: "IX_CompanyDepartments_CompanyId",
                table: "CompanyDepartments",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_CompanyDepartments_DepartmantId",
                table: "CompanyDepartments",
                column: "DepartmantId");

            migrationBuilder.AddForeignKey(
                name: "FK_CompanyDepartments_Company_CompanyId",
                table: "CompanyDepartments",
                column: "CompanyId",
                principalTable: "Company",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CompanyDepartments_Departmant_DepartmantId",
                table: "CompanyDepartments",
                column: "DepartmantId",
                principalTable: "Departmant",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Contact_CompanyDepartments_CompanyDepartmantsId",
                table: "Contact",
                column: "CompanyDepartmantsId",
                principalTable: "CompanyDepartments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ContactDefinitions_Contact_ContactId",
                table: "ContactDefinitions",
                column: "ContactId",
                principalTable: "Contact",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ContactDefinitions_Identification_IdentificationId",
                table: "ContactDefinitions",
                column: "IdentificationId",
                principalTable: "Identification",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Identification_IdentificationType_IdentificationTypeId",
                table: "Identification",
                column: "IdentificationTypeId",
                principalTable: "IdentificationType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CompanyDepartments_Company_CompanyId",
                table: "CompanyDepartments");

            migrationBuilder.DropForeignKey(
                name: "FK_CompanyDepartments_Departmant_DepartmantId",
                table: "CompanyDepartments");

            migrationBuilder.DropForeignKey(
                name: "FK_Contact_CompanyDepartments_CompanyDepartmantsId",
                table: "Contact");

            migrationBuilder.DropForeignKey(
                name: "FK_ContactDefinitions_Contact_ContactId",
                table: "ContactDefinitions");

            migrationBuilder.DropForeignKey(
                name: "FK_ContactDefinitions_Identification_IdentificationId",
                table: "ContactDefinitions");

            migrationBuilder.DropForeignKey(
                name: "FK_Identification_IdentificationType_IdentificationTypeId",
                table: "Identification");

            migrationBuilder.DropIndex(
                name: "IX_Identification_IdentificationTypeId",
                table: "Identification");

            migrationBuilder.DropIndex(
                name: "IX_ContactDefinitions_ContactId",
                table: "ContactDefinitions");

            migrationBuilder.DropIndex(
                name: "IX_ContactDefinitions_IdentificationId",
                table: "ContactDefinitions");

            migrationBuilder.DropIndex(
                name: "IX_Contact_CompanyDepartmantsId",
                table: "Contact");

            migrationBuilder.DropIndex(
                name: "IX_CompanyDepartments_CompanyId",
                table: "CompanyDepartments");

            migrationBuilder.DropIndex(
                name: "IX_CompanyDepartments_DepartmantId",
                table: "CompanyDepartments");

            migrationBuilder.AlterColumn<string>(
                name: "IdentificationTypeId",
                table: "Identification",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AlterColumn<string>(
                name: "IdentificationId",
                table: "ContactDefinitions",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AlterColumn<string>(
                name: "ContactId",
                table: "ContactDefinitions",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AlterColumn<string>(
                name: "CompanyDepartmantsId",
                table: "Contact",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AlterColumn<string>(
                name: "DepartmantId",
                table: "CompanyDepartments",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AlterColumn<string>(
                name: "CompanyId",
                table: "CompanyDepartments",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");
        }
    }
}
