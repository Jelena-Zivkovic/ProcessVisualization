using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProcessVisualization.Api.Data.Migrations
{
    public partial class RoomChange2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RoomUsers_Rooms_RoomID",
                table: "RoomUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_RoomUsers_User_UserID",
                table: "RoomUsers");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "RoomUsers",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "RoomID",
                table: "RoomUsers",
                newName: "RoomId");

            migrationBuilder.RenameIndex(
                name: "IX_RoomUsers_UserID",
                table: "RoomUsers",
                newName: "IX_RoomUsers_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_RoomUsers_RoomID",
                table: "RoomUsers",
                newName: "IX_RoomUsers_RoomId");

            migrationBuilder.AddColumn<bool>(
                name: "isActive",
                table: "RoomUsers",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "isAdmin",
                table: "RoomUsers",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "RoomCode",
                table: "Rooms",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_RoomUsers_Rooms_RoomId",
                table: "RoomUsers",
                column: "RoomId",
                principalTable: "Rooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RoomUsers_User_UserId",
                table: "RoomUsers",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RoomUsers_Rooms_RoomId",
                table: "RoomUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_RoomUsers_User_UserId",
                table: "RoomUsers");

            migrationBuilder.DropColumn(
                name: "isActive",
                table: "RoomUsers");

            migrationBuilder.DropColumn(
                name: "isAdmin",
                table: "RoomUsers");

            migrationBuilder.DropColumn(
                name: "RoomCode",
                table: "Rooms");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "RoomUsers",
                newName: "UserID");

            migrationBuilder.RenameColumn(
                name: "RoomId",
                table: "RoomUsers",
                newName: "RoomID");

            migrationBuilder.RenameIndex(
                name: "IX_RoomUsers_UserId",
                table: "RoomUsers",
                newName: "IX_RoomUsers_UserID");

            migrationBuilder.RenameIndex(
                name: "IX_RoomUsers_RoomId",
                table: "RoomUsers",
                newName: "IX_RoomUsers_RoomID");

            migrationBuilder.AddForeignKey(
                name: "FK_RoomUsers_Rooms_RoomID",
                table: "RoomUsers",
                column: "RoomID",
                principalTable: "Rooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RoomUsers_User_UserID",
                table: "RoomUsers",
                column: "UserID",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
