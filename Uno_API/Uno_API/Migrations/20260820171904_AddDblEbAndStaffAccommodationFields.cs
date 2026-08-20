using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Uno_API.Migrations
{
    /// <inheritdoc />
    public partial class AddDblEbAndStaffAccommodationFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DblEbCount",
                table: "TourServices",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "DblEbRate",
                table: "TourServices",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DriverEndDate",
                table: "TourServices",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DriverNights",
                table: "TourServices",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "DriverRate",
                table: "TourServices",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DriverStartDate",
                table: "TourServices",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "DriverTotal",
                table: "TourServices",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "GuideEndDate",
                table: "TourServices",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "GuideNights",
                table: "TourServices",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "GuideRate",
                table: "TourServices",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "GuideStartDate",
                table: "TourServices",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "GuideTotal",
                table: "TourServices",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IncludeDriverRoom",
                table: "TourServices",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IncludeGuideRoom",
                table: "TourServices",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "DblEbPaxRate",
                table: "Hotels",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "DblEbRate",
                table: "Hotels",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "DblEbRoomRate",
                table: "Hotels",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DblEbCount",
                table: "TourServices");

            migrationBuilder.DropColumn(
                name: "DblEbRate",
                table: "TourServices");

            migrationBuilder.DropColumn(
                name: "DriverEndDate",
                table: "TourServices");

            migrationBuilder.DropColumn(
                name: "DriverNights",
                table: "TourServices");

            migrationBuilder.DropColumn(
                name: "DriverRate",
                table: "TourServices");

            migrationBuilder.DropColumn(
                name: "DriverStartDate",
                table: "TourServices");

            migrationBuilder.DropColumn(
                name: "DriverTotal",
                table: "TourServices");

            migrationBuilder.DropColumn(
                name: "GuideEndDate",
                table: "TourServices");

            migrationBuilder.DropColumn(
                name: "GuideNights",
                table: "TourServices");

            migrationBuilder.DropColumn(
                name: "GuideRate",
                table: "TourServices");

            migrationBuilder.DropColumn(
                name: "GuideStartDate",
                table: "TourServices");

            migrationBuilder.DropColumn(
                name: "GuideTotal",
                table: "TourServices");

            migrationBuilder.DropColumn(
                name: "IncludeDriverRoom",
                table: "TourServices");

            migrationBuilder.DropColumn(
                name: "IncludeGuideRoom",
                table: "TourServices");

            migrationBuilder.DropColumn(
                name: "DblEbPaxRate",
                table: "Hotels");

            migrationBuilder.DropColumn(
                name: "DblEbRate",
                table: "Hotels");

            migrationBuilder.DropColumn(
                name: "DblEbRoomRate",
                table: "Hotels");
        }
    }
}
