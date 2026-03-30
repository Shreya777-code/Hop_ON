# 🚌 HopOn – City Bus Finder

Full-stack bus information web app with a Node.js/Express backend powered by real CSV data.

---

## Project Structure

```
hopon/
├── server.js          ← Express backend (entry point)
├── package.json
├── data/
│   ├── stopdata.csv   ← Bus stop data (stop_id, stop_name, lat, lng)
│   └── routedata.csv  ← Route data (route_id, bus_details, stop_ids)
└── public/            ← Frontend (served by Express)
    ├── index.html
    ├── nearby-stops.html
    ├── bus-routes.html
    ├── schedule.html
    ├── tourist-places.html
    ├── help.html
    ├── search-results.html
    ├── style.css
    ├── script.js       ← Updated frontend JS (connects to API)
    └── *.png           ← Image assets
```

---

## Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Start the server
node server.js

# 3. Open the app in your browser
#    http://localhost:3000
```

The Express server serves both the API **and** the frontend static files from `public/`.

---

## API Endpoints

### `GET /stops`
Returns all bus stops.

**Example response:**
```json
[
  { "stop_id": "0", "stop_name": "CEMENTRY(MANDAVELI)", "lat": 13.0299, "lon": 80.26191 },
  ...
]
```

---

### `GET /routes`
Returns a summary of all routes.

**Example response:**
```json
[
  {
    "route_id": "1101",
    "bus_details": "19B-Towards-saidapet",
    "stop_count": 33,
    "first_stop": "KELAMBAKKAM",
    "last_stop": "SAIDAPET_BUS_STOP"
  },
  ...
]
```

---

### `GET /routes/:route_id`
Returns full stop details for a specific route (joined from stopdata).

**Example:** `GET /routes/1101`

```json
{
  "route_id": "1101",
  "bus_details": "19B-Towards-saidapet",
  "stops": [
    { "stop_id": "4032", "stop_name": "KELAMBAKKAM", "lat": 12.786396, "lon": 80.220312 },
    { "stop_id": "4033", "stop_name": "HINDUSTAN_COLLEGE", "lat": 12.801506, "lon": 80.223545 },
    ...
  ]
}
```

---

### `GET /nearby?lat=<lat>&lon=<lon>&radius=<km>`
Returns the closest 10 stops within `radius` km (default 2 km), sorted by distance. Each stop also includes which route IDs serve it.

**Example:** `GET /nearby?lat=13.0299&lon=80.2619`

```json
[
  {
    "stop_id": "0",
    "stop_name": "CEMENTRY(MANDAVELI)",
    "lat": 13.0299,
    "lon": 80.26191,
    "distance_km": 0.0,
    "routes": ["1101", "1305"]
  },
  ...
]
```

---

### `GET /search?q=<query>`
Searches stop names (case-insensitive, partial match). Returns up to 20 results.

**Example:** `GET /search?q=saidapet`

```json
[
  { "stop_id": "12", "stop_name": "SAIDAPET", "lat": 13.021571, "lon": 80.226036 },
  { "stop_id": "4000", "stop_name": "SAIDAPET  ", "lat": 13.021571, "lon": 80.226036 }
]
```

---

## Frontend Changes

- **`script.js`** – Fully rewritten to call the real `/nearby`, `/routes`, `/search` API endpoints.
- **`nearby-stops.html`** – Dynamically loads real stops from `/nearby?lat=&lon=` with route badges.
- **`bus-routes.html`** – Loads all real routes from `/routes` via `script.js`.
- **`schedule.html`** – Fetches real stop timeline from `/routes/:id`.
- Autocomplete in the search form calls `/search?q=` for live stop name suggestions.
