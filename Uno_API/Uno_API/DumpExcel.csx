using System;
using System.Linq;
using ClosedXML.Excel;
using System.Text.Json;
using System.IO;

var file1 = @"C:\Ersen\Projects_2025\Uno_ERP\Uno_E2E_Tests\20260731_import\PRJ-BVP1_tourBVP01092026.xlsx";
var file2 = @"C:\Ersen\Projects_2025\Uno_ERP\Uno_E2E_Tests\20260731_import\PRJ-BVP1_BVP010926_guide_excursions_sale_report.xlsx";

DumpFile(file1);
DumpFile(file2);

void DumpFile(string path)
{
    Console.WriteLine($"\nFile: {path}");
    if (!File.Exists(path)) { Console.WriteLine("NOT FOUND!"); return; }
    using var wb = new XLWorkbook(path);
    foreach (var ws in wb.Worksheets)
    {
        Console.WriteLine($"Sheet: {ws.Name}");
        var rows = ws.RowsUsed().Take(10);
        foreach (var row in rows)
        {
            var cells = row.CellsUsed().Select(c => c.Value.ToString()).ToArray();
            Console.WriteLine($"Row {row.RowNumber()}: {string.Join(" | ", cells)}");
        }
    }
}
