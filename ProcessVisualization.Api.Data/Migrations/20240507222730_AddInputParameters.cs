using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProcessVisualization.Api.Data.Migrations
{
    public partial class AddInputParameters : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InputParameter_Shapes_ShapeId",
                table: "InputParameter");

            migrationBuilder.DropPrimaryKey(
                name: "PK_InputParameter",
                table: "InputParameter");

            migrationBuilder.RenameTable(
                name: "InputParameter",
                newName: "InputParameters");

            migrationBuilder.RenameIndex(
                name: "IX_InputParameter_ShapeId",
                table: "InputParameters",
                newName: "IX_InputParameters_ShapeId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_InputParameters",
                table: "InputParameters",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_InputParameters_Shapes_ShapeId",
                table: "InputParameters",
                column: "ShapeId",
                principalTable: "Shapes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InputParameters_Shapes_ShapeId",
                table: "InputParameters");

            migrationBuilder.DropPrimaryKey(
                name: "PK_InputParameters",
                table: "InputParameters");

            migrationBuilder.RenameTable(
                name: "InputParameters",
                newName: "InputParameter");

            migrationBuilder.RenameIndex(
                name: "IX_InputParameters_ShapeId",
                table: "InputParameter",
                newName: "IX_InputParameter_ShapeId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_InputParameter",
                table: "InputParameter",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_InputParameter_Shapes_ShapeId",
                table: "InputParameter",
                column: "ShapeId",
                principalTable: "Shapes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
