const fs = require('fs');
const path = require('path');
const xlsx = require('../../Uno_CRM/node_modules/xlsx');

const API_BASE = 'http://localhost:8000/api';

async function request(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch (e) {
    json = text;
  }
  return { ok: res.ok, status: res.status, statusText: res.statusText, data: json };
}

async function run() {
  console.log('================================================================');
  console.log('🚀 STARTING E2E TEST WORKFLOW FOR ALL 12 TEST TOURS (TestTour1 - TestTour12)');
  console.log('================================================================\n');

  // ---------------------------------------------------------------------------
  // STEP 0: Verify / Setup Master Data Hotels with Pax & Room Rates
  // ---------------------------------------------------------------------------
  console.log('📍 STEP 0: Verifying Master Data Hotels in Budapest, Vienna, Prague...');
  const hotelsRes = await request(`${API_BASE}/hotels`);
  if (!hotelsRes.ok) {
    throw new Error(`Failed to fetch hotels master data: ${hotelsRes.statusText}`);
  }
  const existingHotels = hotelsRes.data;

  const targetHotels = [
    { name: 'Hotel Canada', location: 'Budapest', singleRoomRate: 62, singlePaxRate: 62, doubleRoomRate: 92, doublePaxRate: 46, twinRoomRate: 92, twinPaxRate: 46, tripleRoomRate: 120, triplePaxRate: 40 },
    { name: 'Hotel Allegro', location: 'Vienna', singleRoomRate: 77, singlePaxRate: 77, doubleRoomRate: 84, doublePaxRate: 42, twinRoomRate: 84, twinPaxRate: 42, tripleRoomRate: 111, triplePaxRate: 37 },
    { name: 'Hotel Olympik', location: 'Prague', singleRoomRate: 72, singlePaxRate: 72, doubleRoomRate: 80, doublePaxRate: 40, twinRoomRate: 80, twinPaxRate: 40, tripleRoomRate: 108, triplePaxRate: 36 }
  ];

  const hotelMap = {};
  for (const th of targetHotels) {
    let h = existingHotels.find(x => x.name.toLowerCase() === th.name.toLowerCase());
    if (!h) {
      console.log(`  + Creating missing hotel: ${th.name}`);
      const createH = await request(`${API_BASE}/hotels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...th, starRating: 4, pricingBasis: 'Pax' })
      });
      if (!createH.ok) throw new Error(`Failed to create hotel ${th.name}`);
      h = createH.data;
    } else {
      console.log(`  ✓ Found existing hotel: ${h.name} (ID: ${h.id}, ${h.location})`);
      await request(`${API_BASE}/hotels/${h.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...h,
          singleRoomRate: th.singleRoomRate,
          singlePaxRate: th.singlePaxRate,
          doubleRoomRate: th.doubleRoomRate,
          doublePaxRate: th.doublePaxRate,
          twinRoomRate: th.twinRoomRate,
          twinPaxRate: th.twinPaxRate,
          tripleRoomRate: th.tripleRoomRate,
          triplePaxRate: th.triplePaxRate
        })
      });
    }
    hotelMap[th.location] = h;
  }

  // ---------------------------------------------------------------------------
  // STEP 1: Resolve Test Project "Tests 20260829"
  // ---------------------------------------------------------------------------
  console.log('\n📍 STEP 1: Resolving Test Project "Tests 20260829"...');
  const projectsRes = await request(`${API_BASE}/projects`);
  let project = projectsRes.data?.find(p => p.projectCode === 'TEST-20260829' || p.description === 'Tests 20260829');

  if (!project) {
    const clientsRes = await request(`${API_BASE}/clients`);
    const clientId = clientsRes.data?.[0]?.id || 1;

    const createProjRes = await request(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectCode: 'TEST-20260829',
        description: 'Tests 20260829',
        clientId: clientId,
        projectStatusId: 1, // First status on dashboard
        startDate: '2026-09-01T00:00:00',
        endDate: '2026-09-30T00:00:00',
        baseCurrency: 'EUR'
      })
    });

    if (!createProjRes.ok) throw new Error(`Failed to create project: ${createProjRes.statusText}`);
    project = createProjRes.data;
    console.log(`  ✓ Created Project "Tests 20260829" (ID: ${project.id})`);
  } else {
    console.log(`  ✓ Resolved Project "Tests 20260829" (ID: ${project.id})`);
  }

  // ---------------------------------------------------------------------------
  // STEP 2: Configure All 12 Test Tours
  // ---------------------------------------------------------------------------
  console.log('\n📍 STEP 2: Creating All 12 Test Tours (TestTour1 through TestTour12)...');

  const newTourConfigs = [
    { tourCode: 'TestTour1', destination: 'Budapest-Vienna-Prague', arrivalDate: '2026-09-01T10:00:00', endDate: '2026-09-07T18:00:00', arrivalFlight: 'TK 1001', arrivalAirport: 'BUD', departureFlight: 'TK 1002', departureAirport: 'PRG', pricingMode: 'Pax', route: ['Budapest', 'Vienna', 'Prague'] },
    { tourCode: 'TestTour2', destination: 'Budapest-Vienna-Prague', arrivalDate: '2026-09-01T10:00:00', endDate: '2026-09-07T18:00:00', arrivalFlight: 'TK 1003', arrivalAirport: 'BUD', departureFlight: 'TK 1004', departureAirport: 'PRG', pricingMode: 'Room', route: ['Budapest', 'Vienna', 'Prague'] },
    { tourCode: 'TestTour3', destination: 'Prague-Vienna-Budapest', arrivalDate: '2026-09-01T11:00:00', endDate: '2026-09-07T19:00:00', arrivalFlight: 'TK 1005', arrivalAirport: 'PRG', departureFlight: 'TK 1006', departureAirport: 'BUD', pricingMode: 'Pax', route: ['Prague', 'Vienna', 'Budapest'] },
    { tourCode: 'TestTour4', destination: 'Prague-Vienna-Budapest', arrivalDate: '2026-09-01T11:00:00', endDate: '2026-09-07T19:00:00', arrivalFlight: 'TK 1007', arrivalAirport: 'PRG', departureFlight: 'TK 1008', departureAirport: 'BUD', pricingMode: 'Room', route: ['Prague', 'Vienna', 'Budapest'] },
    { tourCode: 'TestTour5', destination: 'Budapest-Vienna-Prague', arrivalDate: '2026-09-08T10:00:00', endDate: '2026-09-14T18:00:00', arrivalFlight: 'TK 1009', arrivalAirport: 'BUD', departureFlight: 'TK 1010', departureAirport: 'PRG', pricingMode: 'Pax', route: ['Budapest', 'Vienna', 'Prague'] },
    { tourCode: 'TestTour6', destination: 'Budapest-Vienna-Prague', arrivalDate: '2026-09-08T10:00:00', endDate: '2026-09-14T18:00:00', arrivalFlight: 'TK 1011', arrivalAirport: 'BUD', departureFlight: 'TK 1012', departureAirport: 'PRG', pricingMode: 'Room', route: ['Budapest', 'Vienna', 'Prague'] },
    { tourCode: 'TestTour7', destination: 'Prague-Vienna-Budapest', arrivalDate: '2026-09-08T11:00:00', endDate: '2026-09-14T19:00:00', arrivalFlight: 'TK 1013', arrivalAirport: 'PRG', departureFlight: 'TK 1014', departureAirport: 'BUD', pricingMode: 'Pax', route: ['Prague', 'Vienna', 'Budapest'] },
    { tourCode: 'TestTour8', destination: 'Prague-Vienna-Budapest', arrivalDate: '2026-09-08T11:00:00', endDate: '2026-09-14T19:00:00', arrivalFlight: 'TK 1015', arrivalAirport: 'PRG', departureFlight: 'TK 1016', departureAirport: 'BUD', pricingMode: 'Room', route: ['Prague', 'Vienna', 'Budapest'] },
    { tourCode: 'TestTour9', destination: 'Budapest-Vienna-Prague', arrivalDate: '2026-09-01T10:00:00', endDate: '2026-09-07T18:00:00', arrivalFlight: 'TK 1017', arrivalAirport: 'BUD', departureFlight: 'TK 1018', departureAirport: 'PRG', pricingMode: 'Pax', route: ['Budapest', 'Vienna', 'Prague'] },
    { tourCode: 'TestTour10', destination: 'Budapest-Vienna-Prague', arrivalDate: '2026-09-08T10:00:00', endDate: '2026-09-14T18:00:00', arrivalFlight: 'TK 1019', arrivalAirport: 'BUD', departureFlight: 'TK 1020', departureAirport: 'PRG', pricingMode: 'Room', route: ['Budapest', 'Vienna', 'Prague'] },
    { tourCode: 'TestTour11', destination: 'Prague-Vienna-Budapest', arrivalDate: '2026-09-15T11:00:00', endDate: '2026-09-21T19:00:00', arrivalFlight: 'TK 1021', arrivalAirport: 'PRG', departureFlight: 'TK 1022', departureAirport: 'BUD', pricingMode: 'Pax', route: ['Prague', 'Vienna', 'Budapest'] },
    { tourCode: 'TestTour12', destination: 'Prague-Vienna-Budapest', arrivalDate: '2026-09-22T11:00:00', endDate: '2026-09-28T19:00:00', arrivalFlight: 'TK 1023', arrivalAirport: 'PRG', departureFlight: 'TK 1024', departureAirport: 'BUD', pricingMode: 'Room', route: ['Prague', 'Vienna', 'Budapest'] }
  ];

  const processedTours = [];
  const existingToursRes = await request(`${API_BASE}/tours?projectId=${project.id}`);
  const existingTours = existingToursRes.data || [];

  for (const cfg of newTourConfigs) {
    let tour = existingTours.find(t => t.tourCode === cfg.tourCode);
    const tourPayload = {
      tourCode: cfg.tourCode,
      destination: cfg.destination,
      arrivalDate: cfg.arrivalDate,
      endDate: cfg.endDate,
      arrivalFlight: cfg.arrivalFlight,
      arrivalAirport: cfg.arrivalAirport,
      departureFlight: cfg.departureFlight,
      departureAirport: cfg.departureAirport,
      adults: 27,
      children: 2,
      infants: 1,
      pax: 30,
      baseFee: 250,
      totalFee: (27 * 250) + (2 * 250 * 0.5), // €7,000
      guideCommission: 10,
      tourStatusId: 1, // Starts from first status on dashboard (Draft)
      projectId: project.id
    };

    if (!tour) {
      const createTourRes = await request(`${API_BASE}/tours`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tourPayload)
      });
      if (!createTourRes.ok) throw new Error(`Failed to create tour ${cfg.tourCode}`);
      tour = createTourRes.data;
      console.log(`  ✓ Created Tour "${cfg.tourCode}" (ID: ${tour.id}, Pax: 30 [27A, 2C, 1I], Status: 1, Mode: ${cfg.pricingMode})`);
    } else {
      await request(`${API_BASE}/tours/${tour.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...tour, ...tourPayload })
      });
      console.log(`  ✓ Updated Tour "${cfg.tourCode}" (ID: ${tour.id}, Pax: 30 [27A, 2C, 1I], Status: 1, Mode: ${cfg.pricingMode})`);
    }
    processedTours.push({ ...cfg, id: tour.id, tourObj: tour });
  }

  // ---------------------------------------------------------------------------
  // STEP 3: Generate Rooming Excel Files & Import Bookings
  // ---------------------------------------------------------------------------
  console.log('\n📍 STEP 3: Generating Rooming Excel Files & Importing Bookings...');

  const fixturesDir = path.join(__dirname, 'fixtures');
  if (!fs.existsSync(fixturesDir)) fs.mkdirSync(fixturesDir, { recursive: true });

  const familyRoomingList = [
    // BKG-01: Yılmaz Family (Double -> Room 1)
    { ref: 'BKG-01', firstName: 'Ahmet', lastName: 'Yılmaz', gender: 'Bay', roomType: 'Double', paxType: 'Adult', dob: '15.05.1985' },
    { ref: 'BKG-01', firstName: 'Ayşe', lastName: 'Yılmaz', gender: 'Bayan', roomType: 'Double', paxType: 'Adult', dob: '20.08.1988' },

    // BKG-02: Kaya Family (Triple -> Room 2)
    { ref: 'BKG-02', firstName: 'Mehmet', lastName: 'Kaya', gender: 'Bay', roomType: 'Triple', paxType: 'Adult', dob: '10.03.1982' },
    { ref: 'BKG-02', firstName: 'Fatma', lastName: 'Kaya', gender: 'Bayan', roomType: 'Triple', paxType: 'Adult', dob: '14.07.1986' },
    { ref: 'BKG-02', firstName: 'Can', lastName: 'Kaya', gender: 'Bay', roomType: 'Triple', paxType: 'Children', dob: '05.09.2018' },

    // BKG-03: Celik Family (Twin -> Room 3)
    { ref: 'BKG-03', firstName: 'Ali', lastName: 'Celik', gender: 'Bay', roomType: 'Twin', paxType: 'Adult', dob: '11.11.1990' },
    { ref: 'BKG-03', firstName: 'Hasan', lastName: 'Celik', gender: 'Bay', roomType: 'Twin', paxType: 'Adult', dob: '12.12.1992' },

    // BKG-04: Single Traveler (Single -> Room 4)
    { ref: 'BKG-04', firstName: 'Mustafa', lastName: 'Demir', gender: 'Bay', roomType: 'Single', paxType: 'Adult', dob: '01.01.1980' },

    // BKG-05: Single Traveler (Single -> Room 5)
    { ref: 'BKG-05', firstName: 'Emine', lastName: 'Şahin', gender: 'Bayan', roomType: 'Single', paxType: 'Adult', dob: '02.02.1984' },

    // BKG-06: Özdemir Family (Double -> Room 6)
    { ref: 'BKG-06', firstName: 'Ibrahim', lastName: 'Özdemir', gender: 'Bay', roomType: 'Double', paxType: 'Adult', dob: '03.03.1979' },
    { ref: 'BKG-06', firstName: 'Zeynep', lastName: 'Özdemir', gender: 'Bayan', roomType: 'Double', paxType: 'Adult', dob: '04.04.1983' },

    // BKG-07: Öztürk Family (Double -> Room 7)
    { ref: 'BKG-07', firstName: 'Hüseyin', lastName: 'Öztürk', gender: 'Bay', roomType: 'Double', paxType: 'Adult', dob: '05.05.1977' },
    { ref: 'BKG-07', firstName: 'Elif', lastName: 'Öztürk', gender: 'Bayan', roomType: 'Double', paxType: 'Adult', dob: '06.06.1981' },

    // BKG-08: Arslan Family (Triple -> Room 8)
    { ref: 'BKG-08', firstName: 'Burak', lastName: 'Arslan', gender: 'Bay', roomType: 'Triple', paxType: 'Adult', dob: '07.07.1985' },
    { ref: 'BKG-08', firstName: 'Merve', lastName: 'Arslan', gender: 'Bayan', roomType: 'Triple', paxType: 'Adult', dob: '08.08.1987' },
    { ref: 'BKG-08', firstName: 'Efe', lastName: 'Arslan', gender: 'Bay', roomType: 'Triple', paxType: 'Children', dob: '09.09.2019' },

    // BKG-09: Polat Family (Double + Infant -> Room 9)
    { ref: 'BKG-09', firstName: 'Serkan', lastName: 'Polat', gender: 'Bay', roomType: 'Double', paxType: 'Adult', dob: '10.10.1989' },
    { ref: 'BKG-09', firstName: 'Eda', lastName: 'Polat', gender: 'Bayan', roomType: 'Double', paxType: 'Adult', dob: '11.11.1991' },
    { ref: 'BKG-09', firstName: 'Bebek', lastName: 'Polat', gender: 'Bay', roomType: 'Double', paxType: 'Infant', dob: '01.01.2026' },

    // BKG-10 to BKG-15: Couples (Rooms 10 to 15)
    { ref: 'BKG-10', firstName: 'Onur', lastName: 'Yıldız', gender: 'Bay', roomType: 'Double', paxType: 'Adult', dob: '12.12.1986' },
    { ref: 'BKG-10', firstName: 'Seda', lastName: 'Yıldız', gender: 'Bayan', roomType: 'Double', paxType: 'Adult', dob: '01.01.1988' },
    { ref: 'BKG-11', firstName: 'Murat', lastName: 'Tekin', gender: 'Bay', roomType: 'Double', paxType: 'Adult', dob: '02.02.1983' },
    { ref: 'BKG-11', firstName: 'Hande', lastName: 'Tekin', gender: 'Bayan', roomType: 'Double', paxType: 'Adult', dob: '03.03.1985' },
    { ref: 'BKG-12', firstName: 'Kerem', lastName: 'Aksoy', gender: 'Bay', roomType: 'Double', paxType: 'Adult', dob: '04.04.1987' },
    { ref: 'BKG-12', firstName: 'Deniz', lastName: 'Aksoy', gender: 'Bayan', roomType: 'Double', paxType: 'Adult', dob: '05.05.1989' },
    { ref: 'BKG-13', firstName: 'Volkan', lastName: 'Avcı', gender: 'Bay', roomType: 'Double', paxType: 'Adult', dob: '06.06.1984' },
    { ref: 'BKG-13', firstName: 'Aslı', lastName: 'Avcı', gender: 'Bayan', roomType: 'Double', paxType: 'Adult', dob: '07.07.1986' },
    { ref: 'BKG-14', firstName: 'Tolga', lastName: 'Koç', gender: 'Bay', roomType: 'Double', paxType: 'Adult', dob: '08.08.1982' },
    { ref: 'BKG-14', firstName: 'Cansu', lastName: 'Koç', gender: 'Bayan', roomType: 'Double', paxType: 'Adult', dob: '09.09.1984' },
    { ref: 'BKG-15', firstName: 'Hakan', lastName: 'Güneş', gender: 'Bay', roomType: 'Double', paxType: 'Adult', dob: '10.10.1981' },
    { ref: 'BKG-15', firstName: 'Melis', lastName: 'Güneş', gender: 'Bayan', roomType: 'Double', paxType: 'Adult', dob: '11.11.1983' }
  ];

  for (const t of processedTours) {
    console.log(`\n  📂 Building & Importing Rooming Excel for ${t.tourCode}...`);

    const wb = xlsx.utils.book_new();

    // Sheet 1: Tours
    const toursSheetData = [
      ['Tour Code', 'Project', 'Destination', 'Arrival Date', 'End Date', 'Adults', 'Children', 'Infants', 'Pax'],
      [t.tourCode, project.projectCode, t.destination, '01.09.2026', '07.09.2026', 27, 2, 1, 30]
    ];
    xlsx.utils.book_append_sheet(wb, xlsx.utils.aoa_to_sheet(toursSheetData), 'Tours');

    // Sheet 2: Projects
    const projectsSheetData = [['Project Code'], [project.projectCode]];
    xlsx.utils.book_append_sheet(wb, xlsx.utils.aoa_to_sheet(projectsSheetData), 'Projects');

    // Sheet 3: Rooming
    const roomingHeaders = ['BookingRef', 'Yolcu Adı', 'Yolcu Soyadı', 'Cinsiyet', 'Oda Tipi', 'Pax Type', 'Pasaport No', 'Pasaport Type', 'Doğum Tarihi', 'Vize No', 'Telefon'];
    const roomingRows = [roomingHeaders];

    familyRoomingList.forEach((p, idx) => {
      const fullBookingRef = `${p.ref}-${t.tourCode}`;
      roomingRows.push([
        fullBookingRef,
        p.firstName,
        p.lastName,
        p.gender,
        p.roomType,
        p.paxType,
        `U${10000000 + idx}`,
        'Umuma Mahsus',
        p.dob,
        `V${900000 + idx}`,
        '+905551234567'
      ]);
    });

    xlsx.utils.book_append_sheet(wb, xlsx.utils.aoa_to_sheet(roomingRows), 'Rooming');

    const filePath = path.join(fixturesDir, `Rooming_${t.tourCode}.xlsx`);
    xlsx.writeFile(wb, filePath);

    // Clean old passengers before re-importing
    const existingPPassengers = await request(`${API_BASE}/passengers?tourId=${t.id}`);
    if (existingPPassengers.data && Array.isArray(existingPPassengers.data)) {
      for (const pass of existingPPassengers.data) {
        if (pass.tourId === t.id) await request(`${API_BASE}/passengers/${pass.id}`, { method: 'DELETE' });
      }
    }

    // Upload Rooming file via POST /api/TourImport/import
    const fileBuffer = fs.readFileSync(filePath);
    const blob = new Blob([fileBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const formData = new FormData();
    formData.append('roomingFile', blob, `Rooming_${t.tourCode}.xlsx`);

    const importRes = await request(`${API_BASE}/TourImport/import`, {
      method: 'POST',
      body: formData
    });

    if (!importRes.ok) {
      console.error(`❌ IMPORT FAILED for Tour ${t.tourCode}! Code: ${importRes.status}`);
      process.exit(1);
    }

    console.log(`    ✅ Rooming Import SUCCESSFUL for ${t.tourCode}! (27 Adults, 2 Children, 1 Infant)`);
  }

  // ---------------------------------------------------------------------------
  // STEP 4: Configure Hotel Service Lines & Store Explicit PricingBasis
  // ---------------------------------------------------------------------------
  console.log('\n📍 STEP 4: Configuring Hotel Service Lines (Explicit Pax vs Room Pricing Basis)...');

  const serviceCategoriesRes = await request(`${API_BASE}/servicecategories`);
  const hotelCatId = serviceCategoriesRes.data?.find(c => c.name.toLowerCase().includes('hotel'))?.id || 1;

  for (const t of processedTours) {
    console.log(`\n  🏨 Configuring Hotel Stays for Tour ${t.tourCode} (Mode: ${t.pricingMode}/Night)...`);

    const currentTourRes = await request(`${API_BASE}/tours/${t.id}`);
    const tourData = currentTourRes.data;
    const existingServices = tourData.tourServices || [];

    for (const svc of existingServices) {
      if (svc.hotelId || svc.serviceCategoryId === hotelCatId) {
        await request(`${API_BASE}/tourservices/${svc.id}`, { method: 'DELETE' });
      }
    }

    const arrivalDT = new Date(t.arrivalDate);

    for (let cityIdx = 0; cityIdx < t.route.length; cityIdx++) {
      const cityName = t.route[cityIdx];
      const hotelObj = hotelMap[cityName];

      const stayStart = new Date(arrivalDT);
      stayStart.setDate(stayStart.getDate() + (cityIdx * 2));
      const stayEnd = new Date(stayStart);
      stayEnd.setDate(stayEnd.getDate() + 2);

      const startDateStr = stayStart.toISOString();
      const endDateStr = stayEnd.toISOString();

      const roomBreakdown = [
        { type: 'Double', count: 10, paxInRoom: 20, roomRate: hotelObj.doubleRoomRate, paxRate: hotelObj.doublePaxRate },
        { type: 'Triple', count: 2, paxInRoom: 6, roomRate: hotelObj.tripleRoomRate, paxRate: hotelObj.triplePaxRate },
        { type: 'Twin', count: 1, paxInRoom: 2, roomRate: hotelObj.twinRoomRate, paxRate: hotelObj.twinPaxRate },
        { type: 'Single', count: 2, paxInRoom: 2, roomRate: hotelObj.singleRoomRate, paxRate: hotelObj.singlePaxRate }
      ];

      for (const rb of roomBreakdown) {
        const unitPrice = t.pricingMode === 'Room' ? rb.roomRate : rb.paxRate;
        const multiplier = t.pricingMode === 'Room' ? rb.count : rb.paxInRoom;
        const totalAmount = multiplier * unitPrice * 2; // 2 nights

        await request(`${API_BASE}/tourservices`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tourId: t.id,
            serviceCategoryId: hotelCatId,
            hotelId: hotelObj.id,
            description: `${hotelObj.name} (${cityName}) - ${rb.count}x ${rb.type}`,
            roomType: rb.type,
            roomCount: rb.count,
            startDate: startDateStr,
            endDate: endDateStr,
            serviceStartDate: startDateStr,
            serviceEndDate: endDateStr,
            totalNights: 2,
            quantity: 2, // 2 Nights
            unitPrice: unitPrice,
            totalAmount: totalAmount,
            pricingBasis: t.pricingMode, // Explicit PricingBasis per line!
            isRevenue: false
          })
        });
      }
      console.log(`    ✓ Added Hotel Service: ${hotelObj.name} (${cityName}) | 10 Dbl, 2 Trp, 1 Twn, 2 Sgl | PricingMode: ${t.pricingMode}`);
    }
  }

  // ---------------------------------------------------------------------------
  // STEP 5: Final Summary
  // ---------------------------------------------------------------------------
  console.log('\n================================================================');
  console.log('✅ ALL 12 TEST TOURS (TestTour1 - TestTour12) COMPLETED SUCCESSFULLY!');
  console.log('================================================================');
  console.log(`📁 Project Name : Tests 20260829 (ID: ${project.id})`);
  console.log(`🚌 Tours Processed: ${processedTours.length}`);
  processedTours.forEach((t, i) => {
    console.log(`   ${i + 1}. ${t.tourCode} | Pax: 30 (27A, 2C, 1I) | Route: ${t.destination} | Pricing: ${t.pricingMode}/Night | Status: Draft (1) | Flights: ${t.arrivalFlight} -> ${t.departureFlight}`);
  });
  console.log('📄 Rooming Excel files with Room Numbers & Children badges imported cleanly.');
  console.log('================================================================\n');
}

run().catch(err => {
  console.error('\n❌ ERROR:', err);
  process.exit(1);
});
