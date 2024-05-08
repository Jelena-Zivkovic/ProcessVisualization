using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProcessVisualization.Api.Data.Migrations
{
    public partial class AddConfig : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_RoomUsers_UserId",
                table: "RoomUsers");

            migrationBuilder.DropIndex(
                name: "IX_OutputParameter_ShapeId",
                table: "OutputParameter");

            migrationBuilder.AlterColumn<string>(
                name: "RoomCode",
                table: "Rooms",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<int>(
                name: "SerialNumber",
                table: "OutputParameter",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SerialNumber",
                table: "InputParameters",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "Label",
                table: "Connections",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_RoomUsers_UserId_RoomId",
                table: "RoomUsers",
                columns: new[] { "UserId", "RoomId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Rooms_Name",
                table: "Rooms",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Rooms_RoomCode",
                table: "Rooms",
                column: "RoomCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_OutputParameter_ShapeId_SerialNumber",
                table: "OutputParameter",
                columns: new[] { "ShapeId", "SerialNumber" },
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_RoomUsers_UserId_RoomId",
                table: "RoomUsers");

            migrationBuilder.DropIndex(
                name: "IX_Rooms_Name",
                table: "Rooms");

            migrationBuilder.DropIndex(
                name: "IX_Rooms_RoomCode",
                table: "Rooms");

            migrationBuilder.DropIndex(
                name: "IX_OutputParameter_ShapeId_SerialNumber",
                table: "OutputParameter");

            migrationBuilder.DropColumn(
                name: "SerialNumber",
                table: "OutputParameter");

            migrationBuilder.DropColumn(
                name: "SerialNumber",
                table: "InputParameters");

            migrationBuilder.AlterColumn<string>(
                name: "RoomCode",
                table: "Rooms",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "Label",
                table: "Connections",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_RoomUsers_UserId",
                table: "RoomUsers",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_OutputParameter_ShapeId",
                table: "OutputParameter",
                column: "ShapeId");
        }
    }
}
