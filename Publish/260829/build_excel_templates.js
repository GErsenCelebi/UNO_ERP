const fs = require('fs');
const path = require('path');
const xlsx = require('../../Uno_CRM/node_modules/xlsx');

const outputDir = 'C:\\Ersen\\Projects_2025\\Uno_ERP\\Publish\\260829\\importfiles';
const publicDir = 'C:\\Ersen\\Projects_2025\\Uno_ERP\\Uno_CRM\\public\\templates';
const wwwrootDir = 'C:\\Ersen\\Projects_2025\\Uno_ERP\\Uno_API\\Uno_API\\wwwroot\\templates';

[outputDir, publicDir, wwwrootDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

function safeWrite(wb, targetPath) {
  try {
    xlsx.writeFile(wb, targetPath);
  } catch (err) {
    console.warn(`  ⚠️ Could not write to ${targetPath} (file locked or open). Skipped.`);
  }
}

console.log('🚀 Building domain-aligned Excel Import Templates (100% Consistent with Green Download Sale Button & Importer)...');

// ============================================================================
// 1. MASTER DATA IMPORT TEMPLATE (MasterData_Import_Template_v2.xlsx)
// ============================================================================
const wbMaster = xlsx.utils.book_new();

const hotelHeaders = [
  'Hotel Name', 'Location', 'Star Rating', 'Pricing Basis (Pax/Room)', 
  'Single Room Rate (€)', 'Single Pax Rate (€)', 
  'Double Room Rate (€)', 'Double Pax Rate (€)', 
  'Twin Room Rate (€)', 'Twin Pax Rate (€)', 
  'Triple Room Rate (€)', 'Triple Pax Rate (€)', 
  'Contact Name', 'Contact Role', 'Email', 'Phone'
];

const hotelSampleData = [
  hotelHeaders,
  ['Hotel Canada', 'Budapest', 4, 'Pax', 62.00, 62.00, 92.00, 46.00, 92.00, 46.00, 120.00, 40.00, 'János Kovács', 'Reservation Manager', 'janos@hotelcanada.hu', '+36 1 234 5678'],
  ['Hotel Allegro', 'Vienna', 4, 'Pax', 77.00, 77.00, 84.00, 42.00, 84.00, 42.00, 111.00, 37.00, 'Markus Weber', 'Front Desk', 'm.weber@allegro-vienna.at', '+43 1 987 6543'],
  ['Hotel Olympik', 'Prague', 4, 'Room', 72.00, 72.00, 80.00, 40.00, 80.00, 40.00, 108.00, 36.00, 'Eva Dvořáková', 'Sales Director', 'eva@olympik.cz', '+420 283 001 111']
];
xlsx.utils.book_append_sheet(wbMaster, xlsx.utils.aoa_to_sheet(hotelSampleData), 'Hotels');

const guideHeaders = ['Guide Name', 'Language', 'Daily Rate (€)', 'Phone Number', 'Email'];
const guideSampleData = [
  guideHeaders,
  ['Jan Hus', 'Czech, English', 150.00, '+420 601 234 567', 'jan.hus@guides.cz'],
  ['István Szabó', 'Hungarian, English, German', 140.00, '+36 30 987 6543', 'istvan@guides.hu']
];
xlsx.utils.book_append_sheet(wbMaster, xlsx.utils.aoa_to_sheet(guideSampleData), 'Guides');

const transportHeaders = ['Company Name', 'Contact Name', 'Contact Role', 'Email', 'Phone', 'Daily Rate (€)', 'Fleet Size'];
const transportSampleData = [
  transportHeaders,
  ['Bohemia Bus Express', 'Petr Čech', 'Operations Manager', 'petr@bohemiabus.cz', '+420 777 112 233', 450.00, 12],
  ['Danube Coaches Ltd', 'László Németh', 'Fleet Supervisor', 'info@danubecoaches.hu', '+36 20 445 5667', 480.00, 8]
];
xlsx.utils.book_append_sheet(wbMaster, xlsx.utils.aoa_to_sheet(transportSampleData), 'Transport');

const driverHeaders = ['Driver Name', 'Company Name', 'Phone Number', 'Daily Rate (€)'];
const driverSampleData = [
  driverHeaders,
  ['Milan Horák', 'Bohemia Bus Express', '+420 723 456 789', 180.00],
  ['Gábor Varga', 'Danube Coaches Ltd', '+36 30 112 2334', 190.00]
];
xlsx.utils.book_append_sheet(wbMaster, xlsx.utils.aoa_to_sheet(driverSampleData), 'Drivers');

const excursionHeaders = ['Excursion Name', 'City / Region', 'Vendor Name', 'Adult Cost (€)', 'Child Cost (€)', 'Adult Sale Price (€)', 'Child Sale Price (€)', 'Description'];
const excursionSampleData = [
  excursionHeaders,
  ['Prague Castle Guided Tour', 'Prague', 'Prague Sightseeing Tours', 15.00, 8.00, 25.00, 15.00, 'Full guided walk through Prague Castle and St. Vitus Cathedral'],
  ['Budapest Danube Dinner Cruise', 'Budapest', 'Legenda Cruises', 22.00, 12.00, 45.00, 25.00, 'Evening dinner cruise on the Danube with live folklore show']
];
xlsx.utils.book_append_sheet(wbMaster, xlsx.utils.aoa_to_sheet(excursionSampleData), 'Excursions');

['MasterData_Import_Template_v2.xlsx', 'MasterData_Import_Template.xlsx'].forEach(filename => {
  safeWrite(wbMaster, path.join(outputDir, filename));
  safeWrite(wbMaster, path.join(publicDir, filename));
  safeWrite(wbMaster, path.join(wwwrootDir, filename));
});
console.log('  ✓ Generated MasterData_Import_Template_v2.xlsx (With Pax & Room Rates)');

// ============================================================================
// 2. ROOMING & TOUR IMPORT TEMPLATE (Orta Avrupa -BVP_PVB05072026_importroomingV4.xlsx)
// ============================================================================
const wbRooming = xlsx.utils.book_new();

const tourHeaders = ['Tour Code', 'Project', 'Destination', 'Arrival Date', 'End Date', 'Adults', 'Children', 'Infants', 'Pax', 'Status (Default: Draft)'];
const tourSampleData = [
  tourHeaders,
  ['BVP05072026', 'PRJ-BVP1', 'Budapest-Vienna-Prague', '05.07.2026', '12.07.2026', 27, 2, 1, 30, 'Draft']
];
xlsx.utils.book_append_sheet(wbRooming, xlsx.utils.aoa_to_sheet(tourSampleData), 'Tours');

const projectHeaders = ['Project Code', 'Client Name', 'Description', 'Start Date', 'End Date', 'Currency'];
const projectSampleData = [
  projectHeaders,
  ['PRJ-BVP1', 'Apex Travel Agency', 'Orta Avrupa 2026 Summer Tours', '01.07.2026', '31.07.2026', 'EUR']
];
xlsx.utils.book_append_sheet(wbRooming, xlsx.utils.aoa_to_sheet(projectSampleData), 'Projects');

const roomingHeaders = [
  'BookingRef', 'Yolcu Adı', 'Yolcu Soyadı', 'Cinsiyet', 
  'Oda Tipi', 'Pax Type', 'Pasaport No', 'Pasaport Type', 
  'Doğum Tarihi', 'Vize No', 'Telefon'
];
const roomingSampleData = [
  roomingHeaders,
  ['BKG-01-BVP05072026', 'Ahmet', 'Yılmaz', 'Bay', 'Double', 'Adult', 'U10000001', 'Umuma Mahsus', '15.05.1985', 'V900001', '+905551234567'],
  ['BKG-01-BVP05072026', 'Ayşe', 'Yılmaz', 'Bayan', 'Double', 'Adult', 'U10000002', 'Umuma Mahsus', '20.08.1988', 'V900002', '+905551234567'],
  ['BKG-02-BVP05072026', 'Mehmet', 'Kaya', 'Bay', 'Triple', 'Adult', 'U10000003', 'Umuma Mahsus', '10.03.1982', 'V900003', '+905559876543'],
  ['BKG-02-BVP05072026', 'Fatma', 'Kaya', 'Bayan', 'Triple', 'Adult', 'U10000004', 'Umuma Mahsus', '14.07.1986', 'V900004', '+905559876543'],
  ['BKG-02-BVP05072026', 'Can', 'Kaya', 'Bay', 'Triple', 'Children', 'U10000005', 'Umuma Mahsus', '05.09.2018', 'V900005', '+905559876543']
];
xlsx.utils.book_append_sheet(wbRooming, xlsx.utils.aoa_to_sheet(roomingSampleData), 'Rooming');
xlsx.utils.book_append_sheet(wbRooming, xlsx.utils.aoa_to_sheet(hotelSampleData), 'Hotels');

['Orta Avrupa -BVP_PVB05072026_importroomingV4.xlsx', 'ExcelSample1_TourRooming_Import.xlsx'].forEach(filename => {
  safeWrite(wbRooming, path.join(outputDir, filename));
  safeWrite(wbRooming, path.join(publicDir, filename));
  safeWrite(wbRooming, path.join(wwwrootDir, filename));
});
console.log('  ✓ Generated Orta Avrupa -BVP_PVB05072026_importroomingV4.xlsx');

// ============================================================================
// 3. EXCURSION SALES IMPORT TEMPLATE (Orta Avrupa -BVP_PVB05072026_importSalesV4.xlsx)
// MATCHES EXACT GENERATION LOGIC OF GREEN "Download Sale File" BUTTON & TourImportController
// ============================================================================
const wbExcursion = xlsx.utils.book_new();

const excursionSalesMatrix = [
  ['Dates', '06.07.2026', '08.07.2026', '10.07.2026'],
  ['Prices', 25.00, 45.00, 35.00],
  ['Code', 'PRG-CASTLE', 'BUD-CRUISE', 'VIE-SCHONBRUNN'],
  ['Passenger Name', 'Prague Castle Guided Tour', 'Budapest Danube Dinner Cruise', 'Schönbrunn Palace Tour'],
  ['Ahmet Yılmaz', '☑', '☑', '☐'],
  ['Ayşe Yılmaz', '☑', '☑', '☐'],
  ['Mehmet Kaya', '☐', '☑', '☑'],
  ['Fatma Kaya', '☐', '☑', '☑'],
  ['Can Kaya (CHD)', '☐', '☑', '☑'],
  ['', '', '', ''],
  ['Count', '=COUNTIF(B5:B9, "☑") + COUNTIF(B5:B9, TRUE)', '=COUNTIF(C5:C9, "☑") + COUNTIF(C5:C9, TRUE)', '=COUNTIF(D5:D9, "☑") + COUNTIF(D5:D9, TRUE)'],
  ['Total Amount', '=B11*B2', '=C11*C2', '=D11*D2']
];

xlsx.utils.book_append_sheet(wbExcursion, xlsx.utils.aoa_to_sheet(excursionSalesMatrix), 'ExcusionSales');

const baseServiceHeaders = ['Base Service', 'Revenue', 'Expense', 'Other', 'per/Pax', 'UnitPrice', 'Adult', 'Children', 'Infant', 'Total'];
const baseServiceSampleData = [
  baseServiceHeaders,
  ['Agency Fee', '☑', '☐', '☐', '☑', 250.00, 27, 2, 1, 7000.00],
  ['CityTax', '☐', '☑', '☐', '☑', 2.50, 27, 2, 0, 435.00]
];
xlsx.utils.book_append_sheet(wbExcursion, xlsx.utils.aoa_to_sheet(baseServiceSampleData), 'BaseServices');

['Orta Avrupa -BVP_PVB05072026_importSalesV4.xlsx', 'ExcelSample1_ExcursionSales_Import.xlsx'].forEach(filename => {
  safeWrite(wbExcursion, path.join(outputDir, filename));
  safeWrite(wbExcursion, path.join(publicDir, filename));
  safeWrite(wbExcursion, path.join(wwwrootDir, filename));
});
console.log('  ✓ Generated Orta Avrupa -BVP_PVB05072026_importSalesV4.xlsx (Identical to Green Download Button Output)');

// ============================================================================
// 4. DYNAMIC COMBINED IMPORT TEMPLATE (UNO_Dynamic_Import_Template.xlsx)
// ============================================================================
const wbCombined = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(wbCombined, xlsx.utils.aoa_to_sheet(hotelSampleData), 'Hotels');
xlsx.utils.book_append_sheet(wbCombined, xlsx.utils.aoa_to_sheet(tourSampleData), 'Tours');
xlsx.utils.book_append_sheet(wbCombined, xlsx.utils.aoa_to_sheet(projectSampleData), 'Projects');
xlsx.utils.book_append_sheet(wbCombined, xlsx.utils.aoa_to_sheet(roomingSampleData), 'Rooming');
xlsx.utils.book_append_sheet(wbCombined, xlsx.utils.aoa_to_sheet(guideSampleData), 'Guides');
xlsx.utils.book_append_sheet(wbCombined, xlsx.utils.aoa_to_sheet(excursionSampleData), 'Excursions');

['UNO_Dynamic_Import_Template.xlsx', 'uno_import_template.xlsx'].forEach(filename => {
  safeWrite(wbCombined, path.join(outputDir, filename));
  safeWrite(wbCombined, path.join(publicDir, filename));
  safeWrite(wbCombined, path.join(wwwrootDir, filename));
});
console.log('  ✓ Generated UNO_Dynamic_Import_Template.xlsx');

console.log('\n✅ All Domain Excel Import Templates Built & Saved Successfully in Publish/260829/importfiles!');
