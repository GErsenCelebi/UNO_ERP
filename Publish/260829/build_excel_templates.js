const fs = require('fs');
const path = require('path');
const xlsx = require('../../Uno_CRM/node_modules/xlsx');

const outputDir = 'C:\\Ersen\\Projects_2025\\Uno_ERP\\Publish\\260829\\importfiles';
const publicDir = 'C:\\Ersen\\Projects_2025\\Uno_ERP\\Uno_CRM\\public\\templates';
const wwwrootDir = 'C:\\Ersen\\Projects_2025\\Uno_ERP\\Uno_API\\Uno_API\\wwwroot\\templates';

[outputDir, publicDir, wwwrootDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

console.log('🚀 Building updated Excel Import Templates...');

// ============================================================================
// 1. MASTER DATA IMPORT TEMPLATE (MasterData_Import_Template.xlsx)
// ============================================================================
const wbMaster = xlsx.utils.book_new();

// Sheet: Hotels (With Explicit Pax vs Room Rates & PricingBasis)
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

// Sheet: Guides
const guideHeaders = ['Guide Name', 'Language', 'Daily Rate (€)', 'Phone Number', 'Email'];
const guideSampleData = [
  guideHeaders,
  ['Jan Hus', 'Czech, English', 150.00, '+420 601 234 567', 'jan.hus@guides.cz'],
  ['István Szabó', 'Hungarian, English, German', 140.00, '+36 30 987 6543', 'istvan@guides.hu']
];
xlsx.utils.book_append_sheet(wbMaster, xlsx.utils.aoa_to_sheet(guideSampleData), 'Guides');

// Sheet: Transport Companies
const transportHeaders = ['Company Name', 'Contact Name', 'Contact Role', 'Email', 'Phone', 'Daily Rate (€)', 'Fleet Size'];
const transportSampleData = [
  transportHeaders,
  ['Bohemia Bus Express', 'Petr Čech', 'Operations Manager', 'petr@bohemiabus.cz', '+420 777 112 233', 450.00, 12],
  ['Danube Coaches Ltd', 'László Németh', 'Fleet Supervisor', 'info@danubecoaches.hu', '+36 20 445 5667', 480.00, 8]
];
xlsx.utils.book_append_sheet(wbMaster, xlsx.utils.aoa_to_sheet(transportSampleData), 'Transport');

// Sheet: Drivers
const driverHeaders = ['Driver Name', 'Company Name', 'Phone Number', 'Daily Rate (€)'];
const driverSampleData = [
  driverHeaders,
  ['Milan Horák', 'Bohemia Bus Express', '+420 723 456 789', 180.00],
  ['Gábor Varga', 'Danube Coaches Ltd', '+36 30 112 2334', 190.00]
];
xlsx.utils.book_append_sheet(wbMaster, xlsx.utils.aoa_to_sheet(driverSampleData), 'Drivers');

// Sheet: Excursions
const excursionHeaders = ['Excursion Name', 'City / Region', 'Vendor Name', 'Adult Cost (€)', 'Child Cost (€)', 'Adult Sale Price (€)', 'Child Sale Price (€)', 'Description'];
const excursionSampleData = [
  excursionHeaders,
  ['Prague Castle Guided Tour', 'Prague', 'Prague Sightseeing Tours', 15.00, 8.00, 25.00, 15.00, 'Full guided walk through Prague Castle and St. Vitus Cathedral'],
  ['Budapest Danube Dinner Cruise', 'Budapest', 'Legenda Cruises', 22.00, 12.00, 45.00, 25.00, 'Evening dinner cruise on the Danube with live folklore show']
];
xlsx.utils.book_append_sheet(wbMaster, xlsx.utils.aoa_to_sheet(excursionSampleData), 'Excursions');

const masterFileOut = path.join(outputDir, 'MasterData_Import_Template.xlsx');
xlsx.writeFile(wbMaster, masterFileOut);
xlsx.writeFile(wbMaster, path.join(publicDir, 'MasterData_Import_Template.xlsx'));
xlsx.writeFile(wbMaster, path.join(wwwrootDir, 'MasterData_Import_Template.xlsx'));
console.log('  ✓ Generated MasterData_Import_Template.xlsx (With Pax & Room Rates)');

// ============================================================================
// 2. TOUR & ROOMING IMPORT TEMPLATE (ExcelSample1_TourRooming_Import.xlsx)
// ============================================================================
const wbRooming = xlsx.utils.book_new();

// Sheet: Tours
const tourHeaders = ['Tour Code', 'Project', 'Destination', 'Arrival Date', 'End Date', 'Adults', 'Children', 'Infants', 'Pax', 'Status (Default: Draft)'];
const tourSampleData = [
  tourHeaders,
  ['BVP01092026', 'PRJ-BVP1', 'Budapest-Vienna-Prague', '01.09.2026', '07.09.2026', 27, 2, 1, 30, 'Draft']
];
xlsx.utils.book_append_sheet(wbRooming, xlsx.utils.aoa_to_sheet(tourSampleData), 'Tours');

// Sheet: Projects
const projectHeaders = ['Project Code', 'Client Name', 'Description', 'Start Date', 'End Date', 'Currency'];
const projectSampleData = [
  projectHeaders,
  ['PRJ-BVP1', 'Apex Travel Agency', 'Orta Avrupa 2026 Autumn Tours', '01.09.2026', '30.09.2026', 'EUR']
];
xlsx.utils.book_append_sheet(wbRooming, xlsx.utils.aoa_to_sheet(projectSampleData), 'Projects');

// Sheet: Rooming
const roomingHeaders = [
  'BookingRef', 'Yolcu Adı', 'Yolcu Soyadı', 'Cinsiyet', 
  'Oda Tipi', 'Pax Type', 'Pasaport No', 'Pasaport Type', 
  'Doğum Tarihi', 'Vize No', 'Telefon'
];
const roomingSampleData = [
  roomingHeaders,
  ['BKG-01-BVP01092026', 'Ahmet', 'Yılmaz', 'Bay', 'Double', 'Adult', 'U10000001', 'Umuma Mahsus', '15.05.1985', 'V900001', '+905551234567'],
  ['BKG-01-BVP01092026', 'Ayşe', 'Yılmaz', 'Bayan', 'Double', 'Adult', 'U10000002', 'Umuma Mahsus', '20.08.1988', 'V900002', '+905551234567'],
  ['BKG-02-BVP01092026', 'Mehmet', 'Kaya', 'Bay', 'Triple', 'Adult', 'U10000003', 'Umuma Mahsus', '10.03.1982', 'V900003', '+905559876543'],
  ['BKG-02-BVP01092026', 'Fatma', 'Kaya', 'Bayan', 'Triple', 'Adult', 'U10000004', 'Umuma Mahsus', '14.07.1986', 'V900004', '+905559876543'],
  ['BKG-02-BVP01092026', 'Can', 'Kaya', 'Bay', 'Triple', 'Children', 'U10000005', 'Umuma Mahsus', '05.09.2018', 'V900005', '+905559876543']
];
xlsx.utils.book_append_sheet(wbRooming, xlsx.utils.aoa_to_sheet(roomingSampleData), 'Rooming');

const roomingFileOut = path.join(outputDir, 'ExcelSample1_TourRooming_Import.xlsx');
xlsx.writeFile(wbRooming, roomingFileOut);
xlsx.writeFile(wbRooming, path.join(publicDir, 'ExcelSample1_TourRooming_Import.xlsx'));
xlsx.writeFile(wbRooming, path.join(wwwrootDir, 'ExcelSample1_TourRooming_Import.xlsx'));
console.log('  ✓ Generated ExcelSample1_TourRooming_Import.xlsx');

// ============================================================================
// 3. EXCURSION SALES IMPORT TEMPLATE (ExcelSample1_ExcursionSales_Import.xlsx)
// ============================================================================
const wbExcursion = xlsx.utils.book_new();

const excursionSaleHeaders = ['Tour Code', 'Excursion Name', 'Passenger Name', 'Adult Count', 'Child Count', 'Sale Price (€)', 'Total Amount (€)', 'Payment Method', 'Notes'];
const excursionSaleSampleData = [
  excursionSaleHeaders,
  ['BVP01092026', 'Prague Castle Guided Tour', 'Ahmet Yılmaz', 2, 0, 25.00, 50.00, 'Cash (EUR)', 'Paid to guide'],
  ['BVP01092026', 'Budapest Danube Dinner Cruise', 'Mehmet Kaya', 2, 1, 45.00, 115.00, 'Credit Card', 'Family ticket with 1 child']
];
xlsx.utils.book_append_sheet(wbExcursion, xlsx.utils.aoa_to_sheet(excursionSaleSampleData), 'ExcursionSales');

const excursionFileOut = path.join(outputDir, 'ExcelSample1_ExcursionSales_Import.xlsx');
xlsx.writeFile(wbExcursion, excursionFileOut);
xlsx.writeFile(wbExcursion, path.join(publicDir, 'ExcelSample1_ExcursionSales_Import.xlsx'));
xlsx.writeFile(wbExcursion, path.join(wwwrootDir, 'ExcelSample1_ExcursionSales_Import.xlsx'));
console.log('  ✓ Generated ExcelSample1_ExcursionSales_Import.xlsx');

// ============================================================================
// 4. COMPREHENSIVE COMBINED IMPORT TEMPLATE (uno_import_template.xlsx)
// ============================================================================
const wbCombined = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(wbCombined, xlsx.utils.aoa_to_sheet(hotelSampleData), 'Hotels');
xlsx.utils.book_append_sheet(wbCombined, xlsx.utils.aoa_to_sheet(tourSampleData), 'Tours');
xlsx.utils.book_append_sheet(wbCombined, xlsx.utils.aoa_to_sheet(projectSampleData), 'Projects');
xlsx.utils.book_append_sheet(wbCombined, xlsx.utils.aoa_to_sheet(roomingSampleData), 'Rooming');
xlsx.utils.book_append_sheet(wbCombined, xlsx.utils.aoa_to_sheet(guideSampleData), 'Guides');
xlsx.utils.book_append_sheet(wbCombined, xlsx.utils.aoa_to_sheet(excursionSampleData), 'Excursions');

const combinedFileOut = path.join(outputDir, 'uno_import_template.xlsx');
xlsx.writeFile(wbCombined, combinedFileOut);
xlsx.writeFile(wbCombined, path.join(publicDir, 'uno_import_template.xlsx'));
xlsx.writeFile(wbCombined, path.join(wwwrootDir, 'uno_import_template.xlsx'));
console.log('  ✓ Generated uno_import_template.xlsx');

console.log('\n✅ All Excel Import Templates Built & Saved Successfully in Publish/260829/importfiles!');
