# CLAUDE.md - BusinessRadar

## Project Overview

BusinessRadar is a client-side web application that helps Micro-Small-Medium Enterprises (MSMEs) discover upcoming events and holidays near their location. It enables small businesses (food services, retailers, etc.) to prepare for demand surges by tracking local events on an interactive map.

**Live entry point:** Open `version1.html` in a browser.

## Tech Stack

- **Vanilla JavaScript (ES6+)** — no frameworks or bundlers
- **HTML5 / CSS3** — single-page layout with responsive design
- **Google Maps JavaScript API** — map rendering, Places autocomplete, geocoding
- **No backend** — all event data is hardcoded in `script.js`
- **No package manager** — no npm/yarn, no `node_modules`

## File Structure

```
├── version1.html          # Main application HTML (entry point)
├── script.js              # All application logic (~660 lines, EventMapApp class)
├── styles.css             # All styles (~413 lines, responsive layout)
├── pro.html               # Pro version placeholder (Coming Soon page)
├── GOOGLE_MAPS_SETUP.md   # Google Maps API setup & troubleshooting
├── SEARCH_FEATURE_GUIDE.md # Address search feature docs
└── readme/                # Feature requirements & layout specs
    ├── README.md
    └── README1.md
```

## Architecture

All application logic lives in a single `EventMapApp` class in `script.js`:

- **Constructor** — initializes state (events array, filters, map reference)
- `init()` → `initMap()` → `getUserLocation()` — startup chain
- `initAutocomplete()` — Google Places address search
- `renderEvents()` / `renderMapMarkers()` — UI rendering
- `getFilteredEvents()` — applies distance + type filters
- `calculateDistance()` — Haversine formula for geo distance
- `addToCalendar()` / `shareEvent()` — social features

Global functions `initMap()`, `updateDistance()`, `searchEvents()` bridge HTML callbacks to the class instance.

Event data is a hardcoded array of 8 sample events around Canberra, Australia.

## Development Setup

1. Obtain a Google Maps API key (enable Maps JavaScript API + Places API)
2. Replace `(YOUR_API_KEY)` in `version1.html` (line ~68 in the script tag src)
3. Open `version1.html` in a modern browser
4. Grant geolocation permission when prompted (defaults to Canberra if denied)

## Build & Test

- **No build step** — edit files and refresh the browser
- **No test framework** — no automated tests exist
- **No linter/formatter configured** — no ESLint or Prettier

## Code Conventions

- Single class (`EventMapApp`) encapsulates all state and logic
- camelCase for variables and methods
- Event type filter tags: `Festival`, `Market`, `Exhibition`, `Conference`, `Sports`, `Cultural`
- Marker colors by type: Festival=#e11d48, Market=#059669, Exhibition=#7c3aed, Conference=#2563eb, Sports=#dc2626, Cultural=#ea580c
- User location marker: blue (#3b82f6), Search location marker: orange (#f59e0b)
- Design uses purple gradient (#667eea → #764ba2), SF Pro Display font stack

## Key Constraints

- Client-side only — no server, no database, no API calls for event data
- Tightly coupled to Google Maps APIs
- Mock data only (no real event source)
- Bilingual documentation (English & Chinese) in README.md
