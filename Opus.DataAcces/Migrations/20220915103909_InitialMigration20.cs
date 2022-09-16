using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Opus.DataAcces.Migrations
{
    public partial class InitialMigration20 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ReferencesId",
                table: "Training",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Training_ReferencesId",
                table: "Training",
                column: "ReferencesId");

            migrationBuilder.AddForeignKey(
                name: "FK_Training_References_ReferencesId",
                table: "Training",
                column: "ReferencesId",
                principalTable: "References",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Training_References_ReferencesId",
                table: "Training");

            migrationBuilder.DropIndex(
                name: "IX_Training_ReferencesId",
                table: "Training");

            migrationBuilder.DropColumn(
                name: "ReferencesId",
                table: "Training");
        }
    }
}
