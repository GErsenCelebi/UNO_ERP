const fs = require('fs');
let content = fs.readFileSync('C:/Ersen/Projects_2025/Uno_ERP/Uno_API/Uno_API/generate_masterdata.py', 'utf8');

// 1. Clients
content = content.replace(
  "ws_clients.append(['Name', 'Location'])",
  "ws_clients.append(['Name', 'Location', 'ContactName', 'ContactRole', 'Email', 'Phone'])"
);

// 2. Hotels
content = content.replace(
  "ws_hotels.append(['Name', 'Location', 'StarRating', 'ContactInfo', 'SingleRate', 'DoubleRate', 'TwinRate', 'TripleRate'])",
  "ws_hotels.append(['Name', 'Location', 'StarRating', 'SingleRate', 'DoubleRate', 'TwinRate', 'TripleRate', 'ContactName', 'ContactRole', 'Email', 'Phone'])"
);

// 3. Transport
content = content.replace(
  "ws_transport.append(['Name', 'ContactInfo', 'FleetSize', 'DailyRate'])",
  "ws_transport.append(['Name', 'FleetSize', 'DailyRate', 'ContactName', 'ContactRole', 'Email', 'Phone'])"
);

// 4. Vendors
content = content.replace(
  "ws_vendors.append(['Name', 'Contact', 'ServiceType'])",
  "ws_vendors.append(['Name', 'ServiceType', 'ContactName', 'ContactRole', 'Email', 'Phone'])"
);

fs.writeFileSync('C:/Ersen/Projects_2025/Uno_ERP/Uno_API/Uno_API/generate_masterdata.py', content);
console.log('Updated python script');
