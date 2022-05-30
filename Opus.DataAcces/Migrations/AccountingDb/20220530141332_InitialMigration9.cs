using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Opus.DataAcces.Migrations.AccountingDb
{
    public partial class InitialMigration9 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
                name: "SubCategoryId",
                table: "Tag",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "CategoryId",
                table: "Tag",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tag_CategoryId",
                table: "Tag",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Tag_SubCategoryId",
                table: "Tag",
                column: "SubCategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tag_Category_CategoryId",
                table: "Tag",
                column: "CategoryId",
                principalTable: "Category",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tag_SubCategory_SubCategoryId",
                table: "Tag",
                column: "SubCategoryId",
                principalTable: "SubCategory",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tag_Category_CategoryId",
                table: "Tag");

            migrationBuilder.DropForeignKey(
                name: "FK_Tag_SubCategory_SubCategoryId",
                table: "Tag");

            migrationBuilder.DropIndex(
                name: "IX_Tag_CategoryId",
                table: "Tag");

            migrationBuilder.DropIndex(
                name: "IX_Tag_SubCategoryId",
                table: "Tag");

            migrationBuilder.AlterColumn<string>(
                name: "SubCategoryId",
                table: "Tag",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CategoryId",
                table: "Tag",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");
        }
    }
}
