using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProcessVisualization.Api.Data.Migrations
{
    public partial class AddComposedKeys : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "ElementId",
                table: "Shapes",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "ConnectionId",
                table: "Connections",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_Shapes_ElementId_DocumentId",
                table: "Shapes",
                columns: new[] { "ElementId", "DocumentId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Connections_ConnectionId_DocumentId",
                table: "Connections",
                columns: new[] { "ConnectionId", "DocumentId" },
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Shapes_ElementId_DocumentId",
                table: "Shapes");

            migrationBuilder.DropIndex(
                name: "IX_Connections_ConnectionId_DocumentId",
                table: "Connections");

            migrationBuilder.AlterColumn<string>(
                name: "ElementId",
                table: "Shapes",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "ConnectionId",
                table: "Connections",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");
        }
    }
}
