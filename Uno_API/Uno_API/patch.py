import sys

target = '''            // ROOMING
            var wsRooming = wb1.Worksheet("Rooming");
            int adults = 0, children = 0, infants = 0;
            Booking currentBooking = null;
            int lastRow = wsRooming.LastRowUsed().RowNumber();
            
            for (int r = 2; r <= lastRow; r++)
            {
                var row = wsRooming.Row(r);
                string col1 = row.Cell(1).GetString().Trim();
                
                if (!string.IsNullOrEmpty(col1) && col1.Contains("-"))
                {
                    currentBooking = new Booking
                    {
                        TourId = tour.Id,
                        ClientId = client.Id,
                        ServiceType = col1, // store BookingRef here since it doesn't exist on Booking
                        BookingDate = DateTime.UtcNow,
                        Status = "Confirmed",
                        TotalAmount = 0
                    };
                    _context.Bookings.Add(currentBooking);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    string paxType = row.Cell(8).GetString().Trim();
                    if (string.IsNullOrEmpty(paxType)) continue;

                    string fName = row.Cell(4).GetString().Trim();
                    string lName = row.Cell(5).GetString().Trim();
                    string gender = row.Cell(6).GetString().Trim();
                    string roomType = row.Cell(7).GetString().Trim();
                    string tc = row.Cell(9).GetString().Trim();
                    string dobStr = row.Cell(10).GetString().Trim();
                    string phone = row.Cell(11).GetString().Trim();
                    string passportNo = row.Cell(12).GetString().Trim();
                    string passportType = row.Cell(13).GetString().Trim();
                    string visaNo = row.Cell(14).GetString().Trim();
                    string paxNumStr = row.Cell(3).GetString().Trim();
                    
                    int.TryParse(paxNumStr, out int paxIndex);
                    
                    DateTime? dob = null;
                    if (DateTime.TryParse(dobStr, out DateTime d)) dob = d;

                    var passenger = new Passenger
                    {
                        TourId = tour.Id,
                        FirstName = fName,
                        LastName = lName,
                        Gender = gender,
                        NationalId = tc,
                        RoomType = roomType,
                        DateOfBirth = dob,
                        Phone = phone,
                        PassportNo = passportNo,
                        PassportType = passportType,
                        VisaNo = visaNo,
                        Pax = paxIndex
                    };
                    _context.Passengers.Add(passenger);

                    if (paxType.Equals("Adult", StringComparison.OrdinalIgnoreCase)) adults++;
                    else if (paxType.Equals("Children", StringComparison.OrdinalIgnoreCase) || paxType.Equals("CHD", StringComparison.OrdinalIgnoreCase)) children++;
                    else if (paxType.Equals("Infant", StringComparison.OrdinalIgnoreCase)) infants++;
                }
            }
            tour.Adults = adults;
            tour.Children = children;
            tour.Infants = infants;
            tour.Pax = adults + children + infants;
            await _context.SaveChangesAsync();'''

replacement = '''            // ROOMING
            var wsRooming = wb1.Worksheet("Rooming");

            // Load ExcelMapping.json
            string jsonPath = System.IO.Path.Combine(System.IO.Directory.GetCurrentDirectory(), "Config", "ExcelMapping.json");
            var mappingJson = System.IO.File.ReadAllText(jsonPath);
            var mappings = System.Text.Json.JsonSerializer.Deserialize<System.Collections.Generic.Dictionary<string, System.Collections.Generic.Dictionary<string, System.Text.Json.JsonElement>>>(mappingJson);
            var roomingMapping = mappings["Rooming"];

            var roomingHeaders = new System.Collections.Generic.Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
            var headerRow = wsRooming.Row(1);
            int lastCol = headerRow.LastCellUsed()?.Address.ColumnNumber ?? 20;
            for (int c = 1; c <= lastCol; c++)
            {
                string hName = headerRow.Cell(c).GetString().Trim();
                if (!string.IsNullOrEmpty(hName))
                    roomingHeaders[hName] = c;
            }

            System.Collections.Generic.List<string> missingCols = new System.Collections.Generic.List<string>();
            foreach (var kvp in roomingMapping)
            {
                bool isRequired = kvp.Value.TryGetProperty("required", out var reqProp) && reqProp.GetBoolean();
                if (isRequired && !roomingHeaders.ContainsKey(kvp.Key))
                    missingCols.Add(kvp.Key);
            }

            if (missingCols.Any())
                return BadRequest($"Validation Error in Rooming sheet. Missing required columns: {string.Join(", ", missingCols)}");

            int GetCol(string headerName) => roomingHeaders.ContainsKey(headerName) ? roomingHeaders[headerName] : -1;
            string GetVal(ClosedXML.Excel.IXLRow r, string headerName) 
            {
                int c = GetCol(headerName);
                return c != -1 ? r.Cell(c).GetString().Trim() : string.Empty;
            }

            int adults = 0, children = 0, infants = 0;
            Booking currentBooking = null;
            int lastRow = wsRooming.LastRowUsed().RowNumber();
            
            for (int r = 2; r <= lastRow; r++)
            {
                var row = wsRooming.Row(r);
                string col1 = row.Cell(1).GetString().Trim();
                string bookingRef = GetVal(row, "BookingRef");

                // Legacy format check (Booking Ref in col 1) vs New format mapping
                if (!string.IsNullOrEmpty(bookingRef) || (!string.IsNullOrEmpty(col1) && col1.Contains("-") && GetCol("Yolcu Adı") != 1))
                {
                    string finalRef = !string.IsNullOrEmpty(bookingRef) ? bookingRef : col1;
                    currentBooking = new Booking
                    {
                        TourId = tour.Id,
                        ClientId = client.Id,
                        ServiceType = finalRef,
                        BookingDate = DateTime.UtcNow,
                        Status = "Confirmed",
                        TotalAmount = 0
                    };
                    _context.Bookings.Add(currentBooking);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    string fName = GetVal(row, "Yolcu Adı");
                    if (string.IsNullOrEmpty(fName)) continue;

                    string paxType = GetVal(row, "Pax Type");
                    string lName = GetVal(row, "Yolcu Soyadı");
                    string gender = GetVal(row, "Cinsiyet");
                    string roomType = GetVal(row, "RoomType");
                    string tc = GetVal(row, "T.C. Kimlik No");
                    string dobStr = GetVal(row, "Doğum Tarihi");
                    string phone = GetVal(row, "Telefon");
                    string passportNo = GetVal(row, "Pasaport No");
                    string passportType = GetVal(row, "Pasaport type");
                    string visaNo = GetVal(row, "Visa No");
                    string paxNumStr = GetVal(row, "Pax Index");
                    
                    int.TryParse(paxNumStr, out int paxIndex);
                    if (paxIndex == 0) paxIndex = 1;
                    
                    DateTime? dob = null;
                    if (DateTime.TryParse(dobStr, out DateTime d)) dob = d;

                    var passenger = new Passenger
                    {
                        TourId = tour.Id,
                        FirstName = fName,
                        LastName = lName,
                        Gender = gender,
                        NationalId = tc,
                        RoomType = roomType,
                        DateOfBirth = dob,
                        Phone = phone,
                        PassportNo = passportNo,
                        PassportType = passportType,
                        VisaNo = visaNo,
                        Pax = paxIndex
                    };
                    _context.Passengers.Add(passenger);

                    if (!string.IsNullOrEmpty(paxType))
                    {
                        if (paxType.Equals("Adult", StringComparison.OrdinalIgnoreCase)) adults++;
                        else if (paxType.Equals("Children", StringComparison.OrdinalIgnoreCase) || paxType.Equals("CHD", StringComparison.OrdinalIgnoreCase)) children++;
                        else if (paxType.Equals("Infant", StringComparison.OrdinalIgnoreCase)) infants++;
                    }
                }
            }
            tour.Adults = adults;
            tour.Children = children;
            tour.Infants = infants;
            tour.Pax = adults + children + infants;
            await _context.SaveChangesAsync();'''

with open(r'C:\Ersen\Projects_2025\Uno_ERP\Uno_API\Uno_API\Controllers\TourImportController.cs', 'r', encoding='utf-8') as f:
    content = f.read()

if target in content:
    content = content.replace(target, replacement)
    with open(r'C:\Ersen\Projects_2025\Uno_ERP\Uno_API\Uno_API\Controllers\TourImportController.cs', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Replacement successful')
else:
    print('Target not found')
