using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Uno_API.Migrations
{
    /// <inheritdoc />
    public partial class AddExcursionVendorFK : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "VendorId",
                table: "Excursions",
                type: "int",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Excursions",
                keyColumn: "Id",
                keyValue: 1,
                column: "VendorId",
                value: null);

            migrationBuilder.CreateIndex(
                name: "IX_Excursions_VendorId",
                table: "Excursions",
                column: "VendorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Excursions_Vendors_VendorId",
                table: "Excursions",
                column: "VendorId",
                principalTable: "Vendors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Excursions_Vendors_VendorId",
                table: "Excursions");

            migrationBuilder.DropIndex(
                name: "IX_Excursions_VendorId",
                table: "Excursions");

            migrationBuilder.DropColumn(
                name: "VendorId",
                table: "Excursions");
        }
    }
}
