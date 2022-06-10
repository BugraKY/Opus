using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Opus.DataAcces.Migrations.AccountingDb
{
    public partial class InitialMigration6 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CategoryId",
                table: "Tag",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tag_CategoryId",
                table: "Tag",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tag_Category_CategoryId",
                table: "Tag",
                column: "CategoryId",
                principalTable: "Category",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tag_Category_CategoryId",
                table: "Tag");

            migrationBuilder.DropIndex(
                name: "IX_Tag_CategoryId",
                table: "Tag");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "Tag");
        }
    }
}
