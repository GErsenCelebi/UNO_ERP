# ⚙️ Master Data - Setup & Detailed Entry Management

Master Data contains the core reference entities (Hotels, Guides, Transport Companies, Drivers, Excursions) required by UNO ERP to calculate pricing, assign operational staff, and build tour itineraries.

---

## 🏬 **1. Hotels Management**

* **Target Screen**: Sidebar → **Master Data** → **Hotels** tab.
* **Fields**:
  * **Hotel Name**: Full commercial name (e.g. `Hotel Canada`, `Hotel Olympik`).
  * **City / Location**: Destination city (`Prague`, `Vienna`, `Budapest`).
  * **Star Rating**: 3-star, 4-star, or 5-star rating.
  * **Pricing Basis**: Select **`Pax`** (per person per night) or **`Room`** (per room per night).
  * **Rate Matrix**: Single Room/Pax Rate, Double Room/Pax Rate, Twin Room/Pax Rate, Triple Room/Pax Rate.
  * **Contact Details**: Contact person, email, and emergency telephone number.

---

## 🚩 **2. Guides Management**

* **Target Screen**: Sidebar → **Master Data** → **Guides** tab.
* **Fields**:
  * **Guide Name**: Full legal name.
  * **Languages Spoken**: Spoken languages (e.g. `English`, `Turkish`, `German`).
  * **Daily Fee (€)**: Contracted daily wage rate in Euros (€).
  * **Phone & Email**: Operational contact details for tour communications.

---

## 🚌 **3. Transport & Drivers Management**

* **Target Screen**: Sidebar → **Master Data** → **Transport / Drivers** tab.
* **Fields**:
  * **Transport Company**: Company name, fleet capacity, daily bus rates (€).
  * **Drivers**: Driver name, phone number, assigned transport company, daily rate (€).

---

## 🎟️ **4. Excursions Management**

* **Target Screen**: Sidebar → **Master Data** → **Excursions** tab.
* **Fields**:
  * **Excursion Title**: Official excursion title (e.g. `Dresden Tour`, `Mozart Concert`).
  * **City**: Location city.
  * **Vendor Ticket Cost (€)**: Attraction entry ticket fee paid per adult/child.
  * **Selling Price (€)**: Retail price charged per adult/child passenger.
