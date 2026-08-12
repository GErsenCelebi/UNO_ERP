using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Uno_API.Migrations
{
    /// <inheritdoc />
    public partial class AddStandardContactFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Contact",
                table: "Vendors",
                newName: "Phone");

            migrationBuilder.RenameColumn(
                name: "ContactInfo",
                table: "TransportCompanies",
                newName: "Phone");

            migrationBuilder.RenameColumn(
                name: "ContactInfo",
                table: "Hotels",
                newName: "Phone");

            migrationBuilder.AddColumn<string>(
                name: "ContactName",
                table: "Vendors",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ContactRole",
                table: "Vendors",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Vendors",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ContactName",
                table: "TransportCompanies",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ContactRole",
                table: "TransportCompanies",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "TransportCompanies",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ContactName",
                table: "Hotels",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ContactRole",
                table: "Hotels",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Hotels",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ContactName",
                table: "Clients",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ContactRole",
                table: "Clients",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Clients",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "Clients",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "TransportCompanies",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ContactName", "ContactRole", "Email", "Phone" },
                values: new object[] { "", "", "info@transport.com", "" });

            migrationBuilder.UpdateData(
                table: "Vendors",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ContactName", "ContactRole", "Email", "Phone" },
                values: new object[] { "", "", "vendor@test.com", "" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ContactName",
                table: "Vendors");

            migrationBuilder.DropColumn(
                name: "ContactRole",
                table: "Vendors");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Vendors");

            migrationBuilder.DropColumn(
                name: "ContactName",
                table: "TransportCompanies");

            migrationBuilder.DropColumn(
                name: "ContactRole",
                table: "TransportCompanies");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "TransportCompanies");

            migrationBuilder.DropColumn(
                name: "ContactName",
                table: "Hotels");

            migrationBuilder.DropColumn(
                name: "ContactRole",
                table: "Hotels");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Hotels");

            migrationBuilder.DropColumn(
                name: "ContactName",
                table: "Clients");

            migrationBuilder.DropColumn(
                name: "ContactRole",
                table: "Clients");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Clients");

            migrationBuilder.DropColumn(
                name: "Phone",
                table: "Clients");

            migrationBuilder.RenameColumn(
                name: "Phone",
                table: "Vendors",
                newName: "Contact");

            migrationBuilder.RenameColumn(
                name: "Phone",
                table: "TransportCompanies",
                newName: "ContactInfo");

            migrationBuilder.RenameColumn(
                name: "Phone",
                table: "Hotels",
                newName: "ContactInfo");

            migrationBuilder.UpdateData(
                table: "TransportCompanies",
                keyColumn: "Id",
                keyValue: 1,
                column: "ContactInfo",
                value: "info@transport.com");

            migrationBuilder.UpdateData(
                table: "Vendors",
                keyColumn: "Id",
                keyValue: 1,
                column: "Contact",
                value: "vendor@test.com");
        }
    }
}
