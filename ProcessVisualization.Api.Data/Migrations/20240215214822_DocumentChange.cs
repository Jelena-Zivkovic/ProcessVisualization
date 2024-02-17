using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProcessVisualization.Api.Data.Migrations
{
    public partial class DocumentChange : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Connections_Documents_DocumentId",
                table: "Connections");

            migrationBuilder.DropForeignKey(
                name: "FK_Documents_Rooms_RoomId",
                table: "Documents");

            migrationBuilder.DropForeignKey(
                name: "FK_Elements_Documents_DocumentId",
                table: "Elements");

            migrationBuilder.DropForeignKey(
                name: "FK_RoomUsers_AspNetUsers_UserId",
                table: "RoomUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_RoomUsers_Rooms_RoomId",
                table: "RoomUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_Shapes_Documents_DocumentId",
                table: "Shapes");

            migrationBuilder.AddColumn<decimal>(
                name: "Height",
                table: "Shapes",
                type: "decimal(18,4)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Shapes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "Width",
                table: "Shapes",
                type: "decimal(18,4)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "X",
                table: "Shapes",
                type: "decimal(18,4)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "Y",
                table: "Shapes",
                type: "decimal(18,4)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "LastUpdatedBy",
                table: "Documents",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ConnectionId",
                table: "Connections",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Source",
                table: "Connections",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Target",
                table: "Connections",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Connections",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "Points",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    X = table.Column<decimal>(type: "decimal(18,4)", nullable: false),
                    Y = table.Column<decimal>(type: "decimal(18,4)", nullable: false),
                    ConnectionId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Points", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Points_Connections_ConnectionId",
                        column: x => x.ConnectionId,
                        principalTable: "Connections",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Points_ConnectionId",
                table: "Points",
                column: "ConnectionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Connections_Documents_DocumentId",
                table: "Connections",
                column: "DocumentId",
                principalTable: "Documents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Documents_Rooms_RoomId",
                table: "Documents",
                column: "RoomId",
                principalTable: "Rooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Elements_Documents_DocumentId",
                table: "Elements",
                column: "DocumentId",
                principalTable: "Documents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_RoomUsers_AspNetUsers_UserId",
                table: "RoomUsers",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_RoomUsers_Rooms_RoomId",
                table: "RoomUsers",
                column: "RoomId",
                principalTable: "Rooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Shapes_Documents_DocumentId",
                table: "Shapes",
                column: "DocumentId",
                principalTable: "Documents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Connections_Documents_DocumentId",
                table: "Connections");

            migrationBuilder.DropForeignKey(
                name: "FK_Documents_Rooms_RoomId",
                table: "Documents");

            migrationBuilder.DropForeignKey(
                name: "FK_Elements_Documents_DocumentId",
                table: "Elements");

            migrationBuilder.DropForeignKey(
                name: "FK_RoomUsers_AspNetUsers_UserId",
                table: "RoomUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_RoomUsers_Rooms_RoomId",
                table: "RoomUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_Shapes_Documents_DocumentId",
                table: "Shapes");

            migrationBuilder.DropTable(
                name: "Points");

            migrationBuilder.DropColumn(
                name: "Height",
                table: "Shapes");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Shapes");

            migrationBuilder.DropColumn(
                name: "Width",
                table: "Shapes");

            migrationBuilder.DropColumn(
                name: "X",
                table: "Shapes");

            migrationBuilder.DropColumn(
                name: "Y",
                table: "Shapes");

            migrationBuilder.DropColumn(
                name: "LastUpdatedBy",
                table: "Documents");

            migrationBuilder.DropColumn(
                name: "ConnectionId",
                table: "Connections");

            migrationBuilder.DropColumn(
                name: "Source",
                table: "Connections");

            migrationBuilder.DropColumn(
                name: "Target",
                table: "Connections");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Connections");

            migrationBuilder.AddForeignKey(
                name: "FK_Connections_Documents_DocumentId",
                table: "Connections",
                column: "DocumentId",
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
                name: "FK_Elements_Documents_DocumentId",
                table: "Elements",
                column: "DocumentId",
                principalTable: "Documents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RoomUsers_AspNetUsers_UserId",
                table: "RoomUsers",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RoomUsers_Rooms_RoomId",
                table: "RoomUsers",
                column: "RoomId",
                principalTable: "Rooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Shapes_Documents_DocumentId",
                table: "Shapes",
                column: "DocumentId",
                principalTable: "Documents",
                principalColumn: "Id");
        }
    }
}
