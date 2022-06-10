using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Opus.DataAcces.Migrations.AccountingDb
{
    public partial class InitialMigration5 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "Tag");

            migrationBuilder.DropColumn(
                name: "SubCategoryId",
                table: "Tag");

            migrationBuilder.AddColumn<Guid>(
                name: "CompanyId",
                table: "Category",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "TagDefinitions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CategoryId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    SubCategoryId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    TagId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TagDefinitions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TagDefinitions_Category_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Category",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_TagDefinitions_SubCategory_SubCategoryId",
                        column: x => x.SubCategoryId,
                        principalTable: "SubCategory",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_TagDefinitions_Tag_TagId",
                        column: x => x.TagId,
                        principalTable: "Tag",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Category_CompanyId",
                table: "Category",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_TagDefinitions_CategoryId",
                table: "TagDefinitions",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_TagDefinitions_SubCategoryId",
                table: "TagDefinitions",
                column: "SubCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_TagDefinitions_TagId",
                table: "TagDefinitions",
                column: "TagId");

            migrationBuilder.AddForeignKey(
                name: "FK_Category_Company_CompanyId",
                table: "Category",
                column: "CompanyId",
                principalTable: "Company",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Category_Company_CompanyId",
                table: "Category");

            migrationBuilder.DropTable(
                name: "TagDefinitions");

            migrationBuilder.DropIndex(
                name: "IX_Category_CompanyId",
                table: "Category");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "Category");

            migrationBuilder.AddColumn<Guid>(
                name: "CategoryId",
                table: "Tag",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "SubCategoryId",
                table: "Tag",
                type: "uniqueidentifier",
                nullable: true);

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
    }
}
