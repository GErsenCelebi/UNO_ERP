const http = require('http');

const API_BASE = 'http://127.0.0.1:8001/api';

const seedData = [
  { endpoint: 'TransportCompanies', data: { name: 'VIP Transports', contactInfo: 'vip@transports.com', fleetSize: 20, dailyRate: 200 } },
  { endpoint: 'Drivers', data: { name: 'Michael Schumacher', phoneNumber: '555-0101', dailyRate: 75, transportCompanyId: 1 } },
  { endpoint: 'Vendors', data: { name: 'Gourmet Catering', contact: 'catering@gourmet.com', serviceType: 'Food' } },
  { endpoint: 'Excursions', data: { name: 'Museum Tour', type: 'Full Day', price: 50, salePrice: 75 } },
  { endpoint: 'Guides', data: { name: 'Indiana Jones', language: 'English', phoneNumber: '555-0102', dailyRate: 150 } }
];

async function postData(endpoint, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const req = http.request(API_BASE + '/' + endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`[OK] Seeded ${endpoint}`);
          resolve(JSON.parse(body));
        } else {
          console.error(`[ERROR] Failed to seed ${endpoint}: ${res.statusCode} ${body}`);
          resolve(null); // Resolve anyway so it doesn't crash the loop
        }
      });
    });
    
    req.on('error', (e) => {
      console.error(`[ERROR] Request failed for ${endpoint}: ${e.message}`);
      resolve(null);
    });
    
    req.write(postData);
    req.end();
  });
}

async function run() {
  console.log('Starting seed process...');
  // Transport is a dependency for Drivers, so do them in order
  for (const item of seedData) {
    await postData(item.endpoint, item.data);
  }
  console.log('Seed process finished.');
}

run();
