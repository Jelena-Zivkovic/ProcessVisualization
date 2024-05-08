using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProcessVisualization.Api.Data.Migrations
{
    public partial class CodeUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FunctionName",
                table: "Shapes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Label",
                table: "Shapes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "FuncGroup",
                table: "Documents",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Label",
                table: "Connections",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Value",
                table: "Connections",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "InputParameter",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ShapeId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InputParameter", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InputParameter_Shapes_ShapeId",
                        column: x => x.ShapeId,
                        principalTable: "Shapes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "OutputParameter",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ShapeId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OutputParameter", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OutputParameter_Shapes_ShapeId",
                        column: x => x.ShapeId,
                        principalTable: "Shapes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_InputParameter_ShapeId",
                table: "InputParameter",
                column: "ShapeId");

            migrationBuilder.CreateIndex(
                name: "IX_OutputParameter_ShapeId",
                table: "OutputParameter",
                column: "ShapeId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "InputParameter");

            migrationBuilder.DropTable(
                name: "OutputParameter");

            migrationBuilder.DropColumn(
                name: "FunctionName",
                table: "Shapes");

            migrationBuilder.DropColumn(
                name: "Label",
                table: "Shapes");

            migrationBuilder.DropColumn(
                name: "FuncGroup",
                table: "Documents");

            migrationBuilder.DropColumn(
                name: "Label",
                table: "Connections");

            migrationBuilder.DropColumn(
                name: "Value",
                table: "Connections");
        }
    }
}
