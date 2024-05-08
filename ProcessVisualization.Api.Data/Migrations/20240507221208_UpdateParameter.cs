using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProcessVisualization.Api.Data.Migrations
{
    public partial class UpdateParameter : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "OutputParameter",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "InputParameter",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Type",
                table: "OutputParameter");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "InputParameter");
        }
    }
}
