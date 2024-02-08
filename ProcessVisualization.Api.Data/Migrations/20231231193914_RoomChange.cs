using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProcessVisualization.Api.Data.Migrations
{
    public partial class RoomChange : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Connections_Documents_DocumentId",
                table: "Connections");

            migrationBuilder.DropForeignKey(
                name: "FK_Shape_Documents_DocumentId",
                table: "Shape");

            migrationBuilder.DropIndex(
                name: "IX_Shape_DocumentId",
                table: "Shape");

            migrationBuilder.DropIndex(
                name: "IX_Connections_DocumentId",
                table: "Connections");

            migrationBuilder.AlterColumn<string>(
                name: "DocumentId",
                table: "Shape",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DocumentId1",
                table: "Shape",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Documents",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "LastUpdatedAt",
                table: "Documents",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AlterColumn<string>(
                name: "DocumentId",
                table: "Connections",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DocumentId1",
                table: "Connections",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Shape_DocumentId1",
                table: "Shape",
                column: "DocumentId1");

            migrationBuilder.CreateIndex(
                name: "IX_Documents_RoomId",
                table: "Documents",
                column: "RoomId");

            migrationBuilder.CreateIndex(
                name: "IX_Connections_DocumentId1",
                table: "Connections",
                column: "DocumentId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Connections_Documents_DocumentId1",
                table: "Connections",
                column: "DocumentId1",
                principalTable: "Documents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Documents_Rooms_RoomId",
                table: "Documents",
                column: "RoomId",
                principalTable: "Rooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Shape_Documents_DocumentId1",
                table: "Shape",
                column: "DocumentId1",
                principalTable: "Documents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Connections_Documents_DocumentId1",
                table: "Connections");

            migrationBuilder.DropForeignKey(
                name: "FK_Documents_Rooms_RoomId",
                table: "Documents");

            migrationBuilder.DropForeignKey(
                name: "FK_Shape_Documents_DocumentId1",
                table: "Shape");

            migrationBuilder.DropIndex(
                name: "IX_Shape_DocumentId1",
                table: "Shape");

            migrationBuilder.DropIndex(
                name: "IX_Documents_RoomId",
                table: "Documents");

            migrationBuilder.DropIndex(
                name: "IX_Connections_DocumentId1",
                table: "Connections");

            migrationBuilder.DropColumn(
                name: "DocumentId1",
                table: "Shape");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Documents");

            migrationBuilder.DropColumn(
                name: "LastUpdatedAt",
                table: "Documents");

            migrationBuilder.DropColumn(
                name: "DocumentId1",
                table: "Connections");

            migrationBuilder.AlterColumn<int>(
                name: "DocumentId",
                table: "Shape",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<int>(
                name: "DocumentId",
                table: "Connections",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_Shape_DocumentId",
                table: "Shape",
                column: "DocumentId");

            migrationBuilder.CreateIndex(
                name: "IX_Connections_DocumentId",
                table: "Connections",
                column: "DocumentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Connections_Documents_DocumentId",
                table: "Connections",
                column: "DocumentId",
                principalTable: "Documents",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Shape_Documents_DocumentId",
                table: "Shape",
                column: "DocumentId",
                principalTable: "Documents",
                principalColumn: "Id");
        }
    }
}
