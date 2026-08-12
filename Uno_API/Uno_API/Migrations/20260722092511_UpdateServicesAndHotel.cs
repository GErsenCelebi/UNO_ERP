using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Uno_API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateServicesAndHotel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsStandard",
                table: "ServiceCategories");

            migrationBuilder.RenameColumn(
                name: "NightlyRate",
                table: "Hotels",
                newName: "TwinRate");

            migrationBuilder.AddColumn<string>(
                name: "FlightNo",
                table: "TourServices",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FromAirport",
                table: "TourServices",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ServiceDate",
                table: "TourServices",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ToAirport",
                table: "TourServices",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Classification",
                table: "ServiceCategories",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "DoubleRate",
                table: "Hotels",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "SingleRate",
                table: "Hotels",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "TripleRate",
                table: "Hotels",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.UpdateData(
                table: "ServiceCategories",
                keyColumn: "Id",
                keyValue: 1,
                column: "Classification",
                value: "Standard");

            migrationBuilder.UpdateData(
                table: "ServiceCategories",
                keyColumn: "Id",
                keyValue: 2,
                column: "Classification",
                value: "Standard");

            migrationBuilder.UpdateData(
                table: "ServiceCategories",
                keyColumn: "Id",
                keyValue: 3,
                column: "Classification",
                value: "Standard");

            migrationBuilder.UpdateData(
                table: "ServiceCategories",
                keyColumn: "Id",
                keyValue: 4,
                column: "Classification",
                value: "Standard");

            migrationBuilder.UpdateData(
                table: "ServiceCategories",
                keyColumn: "Id",
                keyValue: 5,
                column: "Classification",
                value: "Standard");

            migrationBuilder.UpdateData(
                table: "ServiceCategories",
                keyColumn: "Id",
                keyValue: 6,
                column: "Classification",
                value: "Extra");

            migrationBuilder.UpdateData(
                table: "ServiceCategories",
                keyColumn: "Id",
                keyValue: 7,
                column: "Classification",
                value: "Extra");

            migrationBuilder.InsertData(
                table: "ServiceCategories",
                columns: new[] { "Id", "Classification", "IsActive", "Name", "Type" },
                values: new object[,]
                {
                    { 8, "Extra", true, "Client Flat Invoice", "Revenue" },
                    { 9, "Other", true, "Parking", "Expense" },
                    { 10, "Other", true, "Tips", "Expense" },
                    { 11, "Other", true, "City Tax", "Revenue" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ServiceCategories",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "ServiceCategories",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "ServiceCategories",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "ServiceCategories",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DropColumn(
                name: "FlightNo",
                table: "TourServices");

            migrationBuilder.DropColumn(
                name: "FromAirport",
                table: "TourServices");

            migrationBuilder.DropColumn(
                name: "ServiceDate",
                table: "TourServices");

            migrationBuilder.DropColumn(
                name: "ToAirport",
                table: "TourServices");

            migrationBuilder.DropColumn(
                name: "Classification",
                table: "ServiceCategories");

            migrationBuilder.DropColumn(
                name: "DoubleRate",
                table: "Hotels");

            migrationBuilder.DropColumn(
                name: "SingleRate",
                table: "Hotels");

            migrationBuilder.DropColumn(
                name: "TripleRate",
                table: "Hotels");

            migrationBuilder.RenameColumn(
                name: "TwinRate",
                table: "Hotels",
                newName: "NightlyRate");

            migrationBuilder.AddColumn<bool>(
                name: "IsStandard",
                table: "ServiceCategories",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "ServiceCategories",
                keyColumn: "Id",
                keyValue: 1,
                column: "IsStandard",
                value: true);

            migrationBuilder.UpdateData(
                table: "ServiceCategories",
                keyColumn: "Id",
                keyValue: 2,
                column: "IsStandard",
                value: true);

            migrationBuilder.UpdateData(
                table: "ServiceCategories",
                keyColumn: "Id",
                keyValue: 3,
                column: "IsStandard",
                value: true);

            migrationBuilder.UpdateData(
                table: "ServiceCategories",
                keyColumn: "Id",
                keyValue: 4,
                column: "IsStandard",
                value: true);

            migrationBuilder.UpdateData(
                table: "ServiceCategories",
                keyColumn: "Id",
                keyValue: 5,
                column: "IsStandard",
                value: true);

            migrationBuilder.UpdateData(
                table: "ServiceCategories",
                keyColumn: "Id",
                keyValue: 6,
                column: "IsStandard",
                value: false);

            migrationBuilder.UpdateData(
                table: "ServiceCategories",
                keyColumn: "Id",
                keyValue: 7,
                column: "IsStandard",
                value: false);
        }
    }
}
