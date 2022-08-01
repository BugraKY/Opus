using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Opus.DataAcces.Migrations.ReferenceVerifDb
{
    public partial class InitialMigration4 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ReferenceDefinitions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    VerificationsId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReferenceDefinitions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReferenceDefinitions_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReferenceDefinitions_Verifications_VerificationsId",
                        column: x => x.VerificationsId,
                        principalTable: "Verifications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ReferenceDefinitions_UserId",
                table: "ReferenceDefinitions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ReferenceDefinitions_VerificationsId",
                table: "ReferenceDefinitions",
                column: "VerificationsId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ReferenceDefinitions");
        }
    }
}
