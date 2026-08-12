using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Uno_API.Migrations
{
    /// <inheritdoc />
    public partial class Sprint1_SchemaUpdates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "EndDate",
                table: "TourServices",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "StartDate",
                table: "TourServices",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TotalNights",
                table: "TourServices",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "AdultRate",
                table: "Tours",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "Adults",
                table: "Tours",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "BaseFee",
                table: "Tours",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "ChildRate",
                table: "Tours",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "Children",
                table: "Tours",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "InfantRate",
                table: "Tours",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "Infants",
                table: "Tours",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "TotalFee",
                table: "Tours",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<bool>(
                name: "IsBase",
                table: "ServiceCategories",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsExpandable",
                table: "ServiceCategories",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsExtra",
                table: "ServiceCategories",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsOperational",
                table: "ServiceCategories",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "ServiceCategories",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "IsBase", "IsExpandable", "IsExtra", "IsOperational" },
                values: new object[] { false, false, false, false });

            migrationBuilder.UpdateData(
                table: "ServiceCategories",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "IsBase", "IsExpandable", "IsExtra", "IsOperational" },
                values: new object[] { false, false, false, false });

            migrationBuilder.UpdateData(
                table: "ServiceCategories",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "IsBase", "IsExpandable", "IsExtra", "IsOperational" },
                values: new object[] { false, false, false, false });

            migrationBuilder.UpdateData(
                table: "ServiceCategories",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "IsBase", "IsExpandable", "IsExtra", "IsOperational" },
                values: new object[] { false, false, false, false });

            migrationBuilder.UpdateData(
                table: "ServiceCategories",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "IsBase", "IsExpandable", "IsExtra", "IsOperational" },
                values: new object[] { false, false, false, false });

            migrationBuilder.UpdateData(
                table: "ServiceCategories",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "IsBase", "IsExpandable", "IsExtra", "IsOperational" },
                values: new object[] { false, false, false, false });

            migrationBuilder.UpdateData(
                table: "ServiceCategories",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "IsBase", "IsExpandable", "IsExtra", "IsOperational" },
                values: new object[] { false, false, false, false });

            migrationBuilder.UpdateData(
                table: "ServiceCategories",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "IsBase", "IsExpandable", "IsExtra", "IsOperational" },
                values: new object[] { false, false, false, false });

            migrationBuilder.UpdateData(
                table: "ServiceCategories",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "IsBase", "IsExpandable", "IsExtra", "IsOperational" },
                values: new object[] { false, false, false, false });

            migrationBuilder.UpdateData(
                table: "ServiceCategories",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "IsBase", "IsExpandable", "IsExtra", "IsOperational" },
                values: new object[] { false, false, false, false });

            migrationBuilder.UpdateData(
                table: "ServiceCategories",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "IsBase", "IsExpandable", "IsExtra", "IsOperational" },
                values: new object[] { false, false, false, false });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "TourServices");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "TourServices");

            migrationBuilder.DropColumn(
                name: "TotalNights",
                table: "TourServices");

            migrationBuilder.DropColumn(
                name: "AdultRate",
                table: "Tours");

            migrationBuilder.DropColumn(
                name: "Adults",
                table: "Tours");

            migrationBuilder.DropColumn(
                name: "BaseFee",
                table: "Tours");

            migrationBuilder.DropColumn(
                name: "ChildRate",
                table: "Tours");

            migrationBuilder.DropColumn(
                name: "Children",
                table: "Tours");

            migrationBuilder.DropColumn(
                name: "InfantRate",
                table: "Tours");

            migrationBuilder.DropColumn(
                name: "Infants",
                table: "Tours");

            migrationBuilder.DropColumn(
                name: "TotalFee",
                table: "Tours");

            migrationBuilder.DropColumn(
                name: "IsBase",
                table: "ServiceCategories");

            migrationBuilder.DropColumn(
                name: "IsExpandable",
                table: "ServiceCategories");

            migrationBuilder.DropColumn(
                name: "IsExtra",
                table: "ServiceCategories");

            migrationBuilder.DropColumn(
                name: "IsOperational",
                table: "ServiceCategories");
        }
    }
}
