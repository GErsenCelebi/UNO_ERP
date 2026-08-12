using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Uno_API.Migrations
{
    /// <inheritdoc />
    public partial class AddFlightAirportFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ArrivalAirport",
                table: "Tours",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DepartureAirport",
                table: "Tours",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ArrivalAirport",
                table: "Tours");

            migrationBuilder.DropColumn(
                name: "DepartureAirport",
                table: "Tours");
        }
    }
}
