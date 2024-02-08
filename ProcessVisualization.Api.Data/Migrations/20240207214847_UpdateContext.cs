using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProcessVisualization.Api.Data.Migrations
{
    public partial class UpdateContext : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Connections_Documents_DocumentId1",
                table: "Connections");

            migrationBuilder.DropForeignKey(
                name: "FK_RoomUsers_User_UserId",
                table: "RoomUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_Shape_Documents_DocumentId1",
                table: "Shape");

            migrationBuilder.DropTable(
                name: "User");

            migrationBuilder.DropIndex(
                name: "IX_Connections_DocumentId1",
                table: "Connections");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Shape",
                table: "Shape");

            migrationBuilder.DropIndex(
                name: "IX_Shape_DocumentId1",
                table: "Shape");

            migrationBuilder.DropColumn(
                name: "DocumentId1",
                table: "Connections");

            migrationBuilder.DropColumn(
                name: "DocumentId1",
                table: "Shape");

            migrationBuilder.RenameTable(
                name: "Shape",
                newName: "Shapes");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "RoomUsers",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "DocumentId",
                table: "Connections",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "AspNetUsers",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<int>(
                name: "DocumentId",
                table: "Shapes",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "ElementId",
                table: "Shapes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Shapes",
                table: "Shapes",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "Elements",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    DocumentId = table.Column<int>(type: "int", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LabelId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ParentId = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Elements", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Elements_Documents_DocumentId",
                        column: x => x.DocumentId,
                        principalTable: "Documents",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Connections_DocumentId",
                table: "Connections",
                column: "DocumentId");

            migrationBuilder.CreateIndex(
                name: "IX_Shapes_DocumentId",
                table: "Shapes",
                column: "DocumentId");

            migrationBuilder.CreateIndex(
                name: "IX_Elements_DocumentId",
                table: "Elements",
                column: "DocumentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Connections_Documents_DocumentId",
                table: "Connections",
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
                name: "FK_Shapes_Documents_DocumentId",
                table: "Shapes",
                column: "DocumentId",
                principalTable: "Documents",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Connections_Documents_DocumentId",
                table: "Connections");

            migrationBuilder.DropForeignKey(
                name: "FK_RoomUsers_AspNetUsers_UserId",
                table: "RoomUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_Shapes_Documents_DocumentId",
                table: "Shapes");

            migrationBuilder.DropTable(
                name: "Elements");

            migrationBuilder.DropIndex(
                name: "IX_Connections_DocumentId",
                table: "Connections");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Shapes",
                table: "Shapes");

            migrationBuilder.DropIndex(
                name: "IX_Shapes_DocumentId",
                table: "Shapes");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "ElementId",
                table: "Shapes");

            migrationBuilder.RenameTable(
                name: "Shapes",
                newName: "Shape");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "RoomUsers",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "DocumentId",
                table: "Connections",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "DocumentId1",
                table: "Connections",
                type: "int",
                nullable: false,
                defaultValue: 0);

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

            migrationBuilder.AddPrimaryKey(
                name: "PK_Shape",
                table: "Shape",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Connections_DocumentId1",
                table: "Connections",
                column: "DocumentId1");

            migrationBuilder.CreateIndex(
                name: "IX_Shape_DocumentId1",
                table: "Shape",
                column: "DocumentId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Connections_Documents_DocumentId1",
                table: "Connections",
                column: "DocumentId1",
                principalTable: "Documents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RoomUsers_User_UserId",
                table: "RoomUsers",
                column: "UserId",
                principalTable: "User",
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
    }
}
