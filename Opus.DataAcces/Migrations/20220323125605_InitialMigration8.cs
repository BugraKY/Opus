using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Opus.DataAcces.Migrations
{
    public partial class InitialMigration8 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Iban",
                table: "Staff",
                newName: "IBAN");

            migrationBuilder.RenameColumn(
                name: "BornLocation",
                table: "Staff",
                newName: "FamilyMembersId");

            migrationBuilder.AddColumn<bool>(
                name: "Active",
                table: "Staff",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "BirthPlace",
                table: "Staff",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "FamilyRelationship",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FamilyRelationship", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FamilyMembers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FamilyRelationshipId = table.Column<int>(type: "int", nullable: false),
                    StaffId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IdentityNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BirthPlace = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateOfBirth = table.Column<DateTime>(type: "datetime2", nullable: false),
                    StaffId1 = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FamilyMembers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FamilyMembers_FamilyRelationship_FamilyRelationshipId",
                        column: x => x.FamilyRelationshipId,
                        principalTable: "FamilyRelationship",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FamilyMembers_Staff_StaffId1",
                        column: x => x.StaffId1,
                        principalTable: "Staff",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_FamilyMembers_FamilyRelationshipId",
                table: "FamilyMembers",
                column: "FamilyRelationshipId");

            migrationBuilder.CreateIndex(
                name: "IX_FamilyMembers_StaffId1",
                table: "FamilyMembers",
                column: "StaffId1");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FamilyMembers");

            migrationBuilder.DropTable(
                name: "FamilyRelationship");

            migrationBuilder.DropColumn(
                name: "Active",
                table: "Staff");

            migrationBuilder.DropColumn(
                name: "BirthPlace",
                table: "Staff");

            migrationBuilder.RenameColumn(
                name: "IBAN",
                table: "Staff",
                newName: "Iban");

            migrationBuilder.RenameColumn(
                name: "FamilyMembersId",
                table: "Staff",
                newName: "BornLocation");
        }
    }
}
