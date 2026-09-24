---
id: metadata-masterdata-setup-management
title: Master Data Setup & Supplier Catalog Management (Hotels, Guides, Transport, Excursions)
category: Metadata
subTopic: Hotels Master
targetUrl: /master-data
actionLabel: Open Master Data
applicableRoles: [Administrator, TourAdmin]
tags: [master data, hotels, guides, transport, drivers, excursions, star rating, pricing basis, pax vs room, contract rates]
triggerQueries:
  - "How to manage Hotels master data, star ratings and pricing basis?"
  - "How to manage Guides master data, languages and daily fee rates?"
  - "How to set up Transport companies and Drivers in master data?"
  - "How to create Excursions in master data with ticket costs and retail selling prices?"
  - "Where do I add new hotel contracts?"
  - "How to configure guide languages and daily wages?"
---

# ⚙️ Master Data - Setup & Detailed Entry Management

## 💡 Executive Summary & Core Purpose
**Master Data** houses the central supplier and catalog registries (Hotels, Guides, Transport Companies, Drivers, Excursions) utilized across **UNO ERP**. 

Establishing accurate master records ensures dynamic pricing calculations, automatic vendor voucher generation, and consistent contract rate management across all tour departures.

---

## 🏬 1. Hotels Master Management
* **Target Screen**: Sidebar $\rightarrow$ **Master Data** $\rightarrow$ **[Hotels](/master-data)** tab.
* **Fields & Rules**:
  * **Hotel Name**: Commercial name (e.g. `Hotel Canada`, `Hotel Olympik`).
  * **City / Destination**: Destination city (`Prague`, `Vienna`, `Budapest`).
  * **Star Rating**: 3-star, 4-star, or 5-star rating.
  * **Pricing Basis**: Select **`Pax`** (per person per night) or **`Room`** (per room type per night).
  * **Rate Matrix**: Single, Double, Twin, and Triple room/pax contract rates.
  * **Contact Details**: Contact person, voucher dispatch email, emergency telephone.

---

## 🚩 2. Tour Guides Master Management
* **Target Screen**: Sidebar $\rightarrow$ **Master Data** $\rightarrow$ **Guides** tab.
* **Fields & Rules**:
  * **Guide Name**: Full legal name.
  * **Languages Spoken**: Spoken tour languages (e.g. `English`, `Turkish`, `German`). Used for tour assignment matching.
  * **Daily Fee (€)**: Base contracted daily wage rate.
  * **Phone & Email**: Contact details for automated assignment notifications.
  * *Note*: Guide daily fee is distinct from the **10% Excursion Commission**, which is calculated dynamically from sales.

---

## 🚌 3. Transport Companies & Drivers Management
* **Target Screen**: Sidebar $\rightarrow$ **Master Data** $\rightarrow$ **Transports / Drivers** tab.
* **Fields & Rules**:
  * **Transport Company**: Company name, fleet capacity (e.g. 35-seat / 50-seat coaches), daily bus rates (€).
  * **Drivers**: Driver name, mobile phone number, assigned coach company, daily allowance rate (€).

---

## 🎟️ 4. Optional Excursions Catalog Management
* **Target Screen**: Sidebar $\rightarrow$ **Master Data** $\rightarrow$ **Excursions** tab.
* **Fields & Rules**:
  * **Excursion Title**: Official title (e.g. `Dresden Tour`, `Mozart Concert`, `Danube Dinner Cruise`).
  * **Destination City**: Location city.
  * **Vendor Ticket Cost (€)**: Direct admission fee paid per adult/child to the attraction vendor.
  * **Selling Price (€)**: Retail price charged to passengers.
  * *Net Margin*: Computed automatically as `Selling Price - Vendor Ticket Cost - 10% Guide Commission`.
