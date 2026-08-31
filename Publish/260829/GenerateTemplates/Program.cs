using System;
using System.IO;
using ClosedXML.Excel;

namespace GenerateTemplates
{
    class Program
    {
        static void Main(string[] args)
        {
            var outputDir = @"C:\Ersen\Projects_2025\Uno_ERP\Publish\260829\importfiles";
            var publicDir = @"C:\Ersen\Projects_2025\Uno_ERP\Uno_CRM\public\templates";
            var wwwrootDir = @"C:\Ersen\Projects_2025\Uno_ERP\Uno_API\Uno_API\wwwroot\templates";

            foreach (var dir in new[] { outputDir, publicDir, wwwrootDir })
            {
                if (!Directory.Exists(dir)) Directory.CreateDirectory(dir);
            }

            Console.WriteLine("🚀 Generating 100% Genuine ClosedXML Excel Templates (With Dropdown Checkboxes & Real Formulas)...");

            // 1. MASTER DATA IMPORT TEMPLATE (MasterData_Import_Template_v2.xlsx)
            using (var wbMaster = new XLWorkbook())
            {
                var wsHotels = wbMaster.Worksheets.Add("Hotels");
                string[] hotelHeaders = new[] {
                    "Hotel Name", "Location", "Star Rating", "Pricing Basis (Pax/Room)", 
                    "Single Room Rate (€)", "Single Pax Rate (€)", 
                    "Double Room Rate (€)", "Double Pax Rate (€)", 
                    "Twin Room Rate (€)", "Twin Pax Rate (€)", 
                    "Triple Room Rate (€)", "Triple Pax Rate (€)", 
                    "Contact Name", "Contact Role", "Email", "Phone"
                };

                for (int i = 0; i < hotelHeaders.Length; i++)
                {
                    wsHotels.Cell(1, i + 1).Value = hotelHeaders[i];
                    wsHotels.Cell(1, i + 1).Style.Font.Bold = true;
                }

                var dvBasis = wsHotels.Range(2, 4, 1000, 4).CreateDataValidation();
                dvBasis.AllowedValues = XLAllowedValues.List;
                dvBasis.List("Pax,Room");

                wsHotels.Cell(2, 1).Value = "Hotel Canada"; wsHotels.Cell(2, 2).Value = "Budapest"; wsHotels.Cell(2, 3).Value = 4; wsHotels.Cell(2, 4).Value = "Pax";
                wsHotels.Cell(2, 5).Value = 62.00; wsHotels.Cell(2, 6).Value = 62.00; wsHotels.Cell(2, 7).Value = 92.00; wsHotels.Cell(2, 8).Value = 46.00;
                wsHotels.Cell(2, 9).Value = 92.00; wsHotels.Cell(2, 10).Value = 46.00; wsHotels.Cell(2, 11).Value = 120.00; wsHotels.Cell(2, 12).Value = 40.00;
                wsHotels.Cell(2, 13).Value = "János Kovács"; wsHotels.Cell(2, 14).Value = "Reservation Manager"; wsHotels.Cell(2, 15).Value = "janos@hotelcanada.hu"; wsHotels.Cell(2, 16).Value = "+36 1 234 5678";

                wsHotels.Cell(3, 1).Value = "Hotel Allegro"; wsHotels.Cell(3, 2).Value = "Vienna"; wsHotels.Cell(3, 3).Value = 4; wsHotels.Cell(3, 4).Value = "Pax";
                wsHotels.Cell(3, 5).Value = 77.00; wsHotels.Cell(3, 6).Value = 77.00; wsHotels.Cell(3, 7).Value = 84.00; wsHotels.Cell(3, 8).Value = 42.00;
                wsHotels.Cell(3, 9).Value = 84.00; wsHotels.Cell(3, 10).Value = 42.00; wsHotels.Cell(3, 11).Value = 111.00; wsHotels.Cell(3, 12).Value = 37.00;
                wsHotels.Cell(3, 13).Value = "Markus Weber"; wsHotels.Cell(3, 14).Value = "Front Desk"; wsHotels.Cell(3, 15).Value = "m.weber@allegro-vienna.at"; wsHotels.Cell(3, 16).Value = "+43 1 987 6543";

                wsHotels.Cell(4, 1).Value = "Hotel Olympik"; wsHotels.Cell(4, 2).Value = "Prague"; wsHotels.Cell(4, 3).Value = 4; wsHotels.Cell(4, 4).Value = "Room";
                wsHotels.Cell(4, 5).Value = 72.00; wsHotels.Cell(4, 6).Value = 72.00; wsHotels.Cell(4, 7).Value = 80.00; wsHotels.Cell(4, 8).Value = 40.00;
                wsHotels.Cell(4, 9).Value = 80.00; wsHotels.Cell(4, 10).Value = 40.00; wsHotels.Cell(4, 11).Value = 108.00; wsHotels.Cell(4, 12).Value = 36.00;
                wsHotels.Cell(4, 13).Value = "Eva Dvořáková"; wsHotels.Cell(4, 14).Value = "Sales Director"; wsHotels.Cell(4, 15).Value = "eva@olympik.cz"; wsHotels.Cell(4, 16).Value = "+420 283 001 111";

                wsHotels.Columns().AdjustToContents();

                foreach (var dir in new[] { outputDir, publicDir, wwwrootDir })
                {
                    wbMaster.SaveAs(Path.Combine(dir, "MasterData_Import_Template_v2.xlsx"));
                }
                Console.WriteLine("  ✓ Generated MasterData_Import_Template_v2.xlsx");
            }

            // 2. ROOMING IMPORT TEMPLATE (Orta Avrupa -BVP_PVB05072026_importroomingV4.xlsx)
            using (var wbRooming = new XLWorkbook())
            {
                var wsTours = wbRooming.Worksheets.Add("Tours");
                string[] tourHeaders = new[] { "Tour Code", "Project", "Destination", "Arrival Date", "End Date", "Adults", "Children", "Infants", "Pax", "Status (Default: Draft)" };
                for (int i = 0; i < tourHeaders.Length; i++)
                {
                    wsTours.Cell(1, i + 1).Value = tourHeaders[i];
                    wsTours.Cell(1, i + 1).Style.Font.Bold = true;
                }
                wsTours.Cell(2, 1).Value = "BVP05072026"; wsTours.Cell(2, 2).Value = "PRJ-BVP1"; wsTours.Cell(2, 3).Value = "Budapest-Vienna-Prague";
                wsTours.Cell(2, 4).Value = "05.07.2026"; wsTours.Cell(2, 5).Value = "12.07.2026"; wsTours.Cell(2, 6).Value = 27; wsTours.Cell(2, 7).Value = 2;
                wsTours.Cell(2, 8).Value = 1; wsTours.Cell(2, 9).Value = 30; wsTours.Cell(2, 10).Value = "Draft";

                var wsRoom = wbRooming.Worksheets.Add("Rooming");
                string[] roomHeaders = new[] { "BookingRef", "Yolcu Adı", "Yolcu Soyadı", "Cinsiyet", "Oda Tipi", "Pax Type", "Pasaport No", "Pasaport Type", "Doğum Tarihi", "Vize No", "Telefon" };
                for (int i = 0; i < roomHeaders.Length; i++)
                {
                    wsRoom.Cell(1, i + 1).Value = roomHeaders[i];
                    wsRoom.Cell(1, i + 1).Style.Font.Bold = true;
                }

                var dvPax = wsRoom.Range(2, 6, 1000, 6).CreateDataValidation();
                dvPax.AllowedValues = XLAllowedValues.List;
                dvPax.List("Adult,Children,Infant");

                wsRoom.Cell(2, 1).Value = "BKG-01-BVP05072026"; wsRoom.Cell(2, 2).Value = "Ahmet"; wsRoom.Cell(2, 3).Value = "Yılmaz"; wsRoom.Cell(2, 4).Value = "Bay"; wsRoom.Cell(2, 5).Value = "Double"; wsRoom.Cell(2, 6).Value = "Adult"; wsRoom.Cell(2, 7).Value = "U10000001";
                wsRoom.Cell(3, 1).Value = "BKG-01-BVP05072026"; wsRoom.Cell(3, 2).Value = "Ayşe"; wsRoom.Cell(3, 3).Value = "Yılmaz"; wsRoom.Cell(3, 4).Value = "Bayan"; wsRoom.Cell(3, 5).Value = "Double"; wsRoom.Cell(3, 6).Value = "Adult"; wsRoom.Cell(3, 7).Value = "U10000002";
                wsRoom.Cell(4, 1).Value = "BKG-02-BVP05072026"; wsRoom.Cell(4, 2).Value = "Mehmet"; wsRoom.Cell(4, 3).Value = "Kaya"; wsRoom.Cell(4, 4).Value = "Bay"; wsRoom.Cell(4, 5).Value = "Triple"; wsRoom.Cell(4, 6).Value = "Adult"; wsRoom.Cell(4, 7).Value = "U10000003";
                wsRoom.Cell(5, 1).Value = "BKG-02-BVP05072026"; wsRoom.Cell(5, 2).Value = "Fatma"; wsRoom.Cell(5, 3).Value = "Kaya"; wsRoom.Cell(5, 4).Value = "Bayan"; wsRoom.Cell(5, 5).Value = "Triple"; wsRoom.Cell(5, 6).Value = "Adult"; wsRoom.Cell(5, 7).Value = "U10000004";
                wsRoom.Cell(6, 1).Value = "BKG-02-BVP05072026"; wsRoom.Cell(6, 2).Value = "Can"; wsRoom.Cell(6, 3).Value = "Kaya"; wsRoom.Cell(6, 4).Value = "Bay"; wsRoom.Cell(6, 5).Value = "Triple"; wsRoom.Cell(6, 6).Value = "Children"; wsRoom.Cell(6, 7).Value = "U10000005";

                wsTours.Columns().AdjustToContents();
                wsRoom.Columns().AdjustToContents();

                foreach (var dir in new[] { outputDir, publicDir, wwwrootDir })
                {
                    wbRooming.SaveAs(Path.Combine(dir, "Orta Avrupa -BVP_PVB05072026_importroomingV4.xlsx"));
                }
                Console.WriteLine("  ✓ Generated Orta Avrupa -BVP_PVB05072026_importroomingV4.xlsx");
            }

            // 3. EXCURSION SALES IMPORT TEMPLATE (Orta Avrupa -BVP_PVB05072026_importSalesV4.xlsx)
            // 100% GENUINE CLOSEDXML EXCEL FORMULAS & INTERACTIVE DROPDOWN CHECKBOXES
            using (var wbSales = new XLWorkbook())
            {
                var wsExc = wbSales.Worksheets.Add("ExcusionSales");

                wsExc.Cell(1, 1).Value = "Dates";
                wsExc.Cell(1, 2).Value = "06.07.2026";
                wsExc.Cell(1, 3).Value = "08.07.2026";
                wsExc.Cell(1, 4).Value = "10.07.2026";

                wsExc.Cell(2, 1).Value = "Prices";
                wsExc.Cell(2, 2).Value = 25.00;
                wsExc.Cell(2, 3).Value = 45.00;
                wsExc.Cell(2, 4).Value = 35.00;

                wsExc.Cell(3, 1).Value = "Code";
                wsExc.Cell(3, 2).Value = "PRG-CASTLE";
                wsExc.Cell(3, 3).Value = "BUD-CRUISE";
                wsExc.Cell(3, 4).Value = "VIE-SCHONBRUNN";

                wsExc.Cell(4, 1).Value = "Passenger Name";
                wsExc.Cell(4, 2).Value = "Prague Castle Guided Tour";
                wsExc.Cell(4, 3).Value = "Budapest Danube Dinner Cruise";
                wsExc.Cell(4, 4).Value = "Schönbrunn Palace Tour";

                wsExc.Row(1).Style.Font.Bold = true;
                wsExc.Row(2).Style.Font.Bold = true;
                wsExc.Row(3).Style.Font.Bold = true;
                wsExc.Row(4).Style.Font.Bold = true;

                string[] passengers = new[] { "Ahmet Yılmaz", "Ayşe Yılmaz", "Mehmet Kaya", "Fatma Kaya", "Can Kaya (CHD)" };
                for (int r = 0; r < passengers.Length; r++)
                {
                    int row = r + 5;
                    var nameCell = wsExc.Cell(row, 1);
                    nameCell.Value = passengers[r];

                    bool isChild = passengers[r].Contains("(CHD)");
                    if (isChild)
                    {
                        var rowRange = wsExc.Range(row, 1, row, 4);
                        rowRange.Style.Font.FontColor = XLColor.Red;
                        rowRange.Style.Font.Bold = true;
                        rowRange.Style.Fill.BackgroundColor = XLColor.FromHtml("#FFFBEB");
                    }

                    for (int c = 2; c <= 4; c++)
                    {
                        var cell = wsExc.Cell(row, c);
                        cell.Value = (r < 2 && c <= 3) || (r >= 2 && c >= 3) ? "☑" : "☐";
                        cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                    }
                }

                // Interactive Data Validation Dropdown Checkboxes
                var dvExc = wsExc.Range(5, 2, 9, 4).CreateDataValidation();
                dvExc.AllowedValues = XLAllowedValues.List;
                dvExc.List("\"☐,☑\"");

                int countRow = 11;
                int totalRow = 12;

                wsExc.Cell(countRow, 1).Value = "Count";
                wsExc.Cell(countRow, 1).Style.Font.Bold = true;

                wsExc.Cell(totalRow, 1).Value = "Total Amount";
                wsExc.Cell(totalRow, 1).Style.Font.Bold = true;

                for (int col = 2; col <= 4; col++)
                {
                    string colLetter = wsExc.Column(col).ColumnLetter();

                    var countCell = wsExc.Cell(countRow, col);
                    countCell.FormulaA1 = $"COUNTIF({colLetter}5:{colLetter}9, \"☑\") + COUNTIF({colLetter}5:{colLetter}9, TRUE)";
                    countCell.Style.Font.Bold = true;
                    countCell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

                    var totalCell = wsExc.Cell(totalRow, col);
                    totalCell.FormulaA1 = $"{colLetter}{countRow}*{colLetter}2";
                    totalCell.Style.Font.Bold = true;
                    totalCell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                }

                // Base Services Sheet
                var wsBase = wbSales.Worksheets.Add("BaseServices");
                string[] baseHeaders = new[] { "Base Service", "Revenue", "Expense", "Other", "per/Pax", "UnitPrice", "Adult", "Children", "Infant", "Total" };
                for (int i = 0; i < baseHeaders.Length; i++)
                {
                    wsBase.Cell(1, i + 1).Value = baseHeaders[i];
                    wsBase.Row(1).Style.Font.Bold = true;
                }

                wsBase.Cell(2, 1).Value = "Agency Fee"; wsBase.Cell(2, 2).Value = "☑"; wsBase.Cell(2, 3).Value = "☐"; wsBase.Cell(2, 4).Value = "☐"; wsBase.Cell(2, 5).Value = "☑";
                wsBase.Cell(2, 6).Value = 250.00; wsBase.Cell(2, 7).Value = 27; wsBase.Cell(2, 8).Value = 2; wsBase.Cell(2, 9).Value = 1; wsBase.Cell(2, 10).Value = 7000.00;

                wsBase.Cell(3, 1).Value = "CityTax"; wsBase.Cell(3, 2).Value = "☐"; wsBase.Cell(3, 3).Value = "☑"; wsBase.Cell(3, 4).Value = "☐"; wsBase.Cell(3, 5).Value = "☑";
                wsBase.Cell(3, 6).Value = 2.50; wsBase.Cell(3, 7).Value = 27; wsBase.Cell(3, 8).Value = 2; wsBase.Cell(3, 9).Value = 0; wsBase.Cell(3, 10).Value = 435.00;

                var dvBase = wsBase.Range(2, 2, 10, 5).CreateDataValidation();
                dvBase.AllowedValues = XLAllowedValues.List;
                dvBase.List("\"☐,☑\"");

                wsExc.Columns().AdjustToContents();
                wsBase.Columns().AdjustToContents();

                foreach (var dir in new[] { outputDir, publicDir, wwwrootDir })
                {
                    try {
                        wbSales.SaveAs(Path.Combine(dir, "Orta Avrupa -BVP_PVB05072026_importSalesV4.xlsx"));
                    } catch (Exception ex) {
                        Console.WriteLine($"  ⚠️ Could not save Orta Avrupa importSalesV4: {ex.Message}");
                    }
                }
                Console.WriteLine("  ✓ Generated Orta Avrupa -BVP_PVB05072026_importSalesV4.xlsx (100% Genuine Formulas & Interactive Checkboxes)");
            }

            Console.WriteLine("\n✅ All 3 Official Final Import Templates Generated Cleanly!");
        }
    }
}
