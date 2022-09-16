using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Opus.DataAcces.Migrations
{
    public partial class InitialMigration21 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "TrainerId",
                table: "Training",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Training_TrainerId",
                table: "Training",
                column: "TrainerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Training_Trainer_TrainerId",
                table: "Training",
                column: "TrainerId",
                principalTable: "Trainer",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Training_Trainer_TrainerId",
                table: "Training");

            migrationBuilder.DropIndex(
                name: "IX_Training_TrainerId",
                table: "Training");

            migrationBuilder.DropColumn(
                name: "TrainerId",
                table: "Training");
        }
    }
}
