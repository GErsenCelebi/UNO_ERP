using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Uno_API.Migrations
{
    /// <inheritdoc />
    public partial class RevertGuideUpdateCalendar : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tours_Guides_GuideId",
                table: "Tours");

            migrationBuilder.DropIndex(
                name: "IX_Tours_GuideId",
                table: "Tours");

            migrationBuilder.DropColumn(
                name: "GuideId",
                table: "Tours");

            // migrationBuilder.AddColumn<DateTime>(
            //    name: "ServiceEndDate",
            //    table: "TourServices",
            //    type: "datetime2",
            //    nullable: true);


            migrationBuilder.Sql("UPDATE ServiceCategories SET Name = 'Invoiced Fee' WHERE Id = 8;");
            migrationBuilder.Sql("UPDATE ServiceCategories SET IsActive = 0 WHERE Id = 7;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE ServiceCategories SET Name = 'Client Flat Invoice' WHERE Id = 8;");
            migrationBuilder.Sql("UPDATE ServiceCategories SET IsActive = 1 WHERE Id = 7;");

            migrationBuilder.DropColumn(
                name: "ServiceEndDate",
                table: "TourServices");

            migrationBuilder.AddColumn<int>(
                name: "GuideId",
                table: "Tours",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tours_GuideId",
                table: "Tours",
                column: "GuideId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tours_Guides_GuideId",
                table: "Tours",
                column: "GuideId",
                principalTable: "Guides",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
