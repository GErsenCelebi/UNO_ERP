const fs = require('fs');
let content = fs.readFileSync('C:/Ersen/Projects_2025/Uno_ERP/Uno_CRM/src/app/master-data/page.tsx', 'utf8');

// 1. Update TAB_CONFIG for Clients
content = content.replace(
  "{ key: 'location', label: 'Location', type: 'text' }]",
  "{ key: 'location', label: 'Location', type: 'text' }, { key: 'contactName', label: 'Contact Name', type: 'text' }, { key: 'contactRole', label: 'Contact Role', type: 'text' }, { key: 'email', label: 'Email', type: 'text' }, { key: 'phone', label: 'Phone', type: 'text' }]"
);

// 2. Update TAB_CONFIG for Hotels (replace contactInfo)
content = content.replace(
  "{ key: 'contactInfo', label: 'Contact Info', type: 'text' }, ",
  "{ key: 'contactName', label: 'Contact Name', type: 'text' }, { key: 'contactRole', label: 'Contact Role', type: 'text' }, { key: 'email', label: 'Email', type: 'text' }, { key: 'phone', label: 'Phone', type: 'text' }, "
);

// 3. Update TAB_CONFIG for Transports (replace contactInfo)
content = content.replace(
  "{ key: 'contactInfo', label: 'Contact Info', type: 'text' }, ",
  "{ key: 'contactName', label: 'Contact Name', type: 'text' }, { key: 'contactRole', label: 'Contact Role', type: 'text' }, { key: 'email', label: 'Email', type: 'text' }, { key: 'phone', label: 'Phone', type: 'text' }, "
);

// 4. Update TAB_CONFIG for Vendors (replace contact)
content = content.replace(
  "{ key: 'contact', label: 'Contact', type: 'text' },",
  "{ key: 'contactName', label: 'Contact Name', type: 'text' }, { key: 'contactRole', label: 'Contact Role', type: 'text' }, { key: 'email', label: 'Email', type: 'text' }, { key: 'phone', label: 'Phone', type: 'text' },"
);


// 5. Update Excel import mappings
// Clients
content = content.replace(
  /const c = await apiPost\('clients', \{ name: r\.Name, location: r\.Location \|\| '', avatarUrl: '' \}\);/g,
  "const c = await apiPost('clients', { name: r.Name, location: r.Location || '', avatarUrl: '', contactName: r.ContactName || '', contactRole: r.ContactRole || '', email: r.Email || '', phone: r.Phone || '' });"
);

// Hotels
content = content.replace(
  /contactInfo: r\.ContactInfo \|\| ''/g,
  "contactName: r.ContactName || '', contactRole: r.ContactRole || '', email: r.Email || '', phone: r.Phone || ''"
);

// Transports (It also has contactInfo: r.ContactInfo || '', so the above regex will match it too, which is perfect)

// Vendors
content = content.replace(
  /contact: r\.Contact \|\| ''/g,
  "contactName: r.ContactName || '', contactRole: r.ContactRole || '', email: r.Email || '', phone: r.Phone || ''"
);

fs.writeFileSync('C:/Ersen/Projects_2025/Uno_ERP/Uno_CRM/src/app/master-data/page.tsx', content);
console.log('Updated page.tsx mappings');
