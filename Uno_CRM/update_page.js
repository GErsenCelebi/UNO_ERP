const fs = require('fs');
let content = fs.readFileSync('C:/Ersen/Projects_2025/Uno_ERP/Uno_CRM/src/app/master-data/page.tsx', 'utf8');

// 1. Update TAB_CONFIG for Excursions
content = content.replace(
  "{ key: 'salePrice', label: 'Sale Price per Pax (â‚¬)', type: 'number' }",
  "{ key: 'salePrice', label: 'Sale Price per Pax (â‚¬)', type: 'number' },\n      { key: 'vendorId', label: 'Vendor', type: 'select', optionsEndpoint: 'Vendors', optionLabel: 'name' }"
);

// 2. Update Excursion parse logic
content = content.replace(
  "salePrice: Number(r.SalePrice) || 0 });",
  "salePrice: Number(r.SalePrice) || 0, vendorId: vendorMap[String(r.VendorName || '').toUpperCase()] || null });"
);

// 3. Remove ExcursionVendors parse logic
content = content.replace(
  /\/\/ ── 6\.5\. ExcursionVendors ──[\s\S]*?\/\/ ── 7\. Projects ──/,
  "// ── 7. Projects ──"
);


fs.writeFileSync('C:/Ersen/Projects_2025/Uno_ERP/Uno_CRM/src/app/master-data/page.tsx', content);
console.log('Updated page.tsx for excursions');
