# Eco-Tracks Nepal: Empowering Classrooms to Fight Climate Change 🌿

### The Problem
Global climate trackers usually ask kids about their family's SUV or their home's central heating. But for a student in a rural Nepali village, these questions just don't make sense. Their reality is often open-air plastic burning, off-grid firewood stoves, and walking miles through the mountains to get to school. 

When educational tools don't reflect a student's actual world, they disconnect and lose interest. We wanted to change that.

### The Solution
**Eco-Tracks Nepal** is a hyper-localized, offline-first carbon footprint tracker built specifically for the unique landscapes of Nepal. 

Instead of asking about Uber rides and HVAC systems, we ask students how many new paper notebooks they use, how their family disposes of waste, and how they commute. 

*   **For Teachers:** An admin dashboard to set the school's geographical region and infrastructural baselines (like municipal waste or diesel generator usage).
*   **For Students:** A beautiful, gamified portal where classroom teams log their weekly activities to earn "Eco-Warrior" status.

### Why It's Different
*   **Built for the Terrain:** The app adapts entirely based on whether a school is in the high Himalayas, the Hills, or the flat Terai plains.
*   **Hyper-Local Math:** We threw out the generic global APIs. Our custom CO₂ engine knows the real emission difference between an anaerobic pit burial and burning plastic in Nepal.
*   **Action, Not Just Numbers:** We don't just spit out a scary carbon score. Students receive a simple letter grade (A+ to E) and unlock fun, actionable "Eco-Missions" to improve their score.
*   **No Internet? No Problem:** Fully offline-first and instantly switchable between English and Nepali. It works flawlessly in remote schools with zero connectivity.

### Under the Hood
Eco-Tracks Nepal was engineered to be lightweight, incredibly fast, and independent of complex server infrastructure.
*   **Architecture:** A zero-framework Vanilla JavaScript Single Page Application (SPA).
*   **Storage:** Runs entirely in the browser using LocalStorage—no cloud servers or databases required.
*   **Engine:** Powered by modular, JSON-based rules engines for both climate calculations and dual-language translations.

---

## Getting Started

Open `index.html` in any modern browser. No build step, no server needed.

**First run:** The app redirects to `setup.html` automatically. Enter your school name, district, reporting month, and set an admin password. After that, the full app is unlocked.

**Typical flow:**
1. Admin enters school-wide metrics once a month via `admin.html`
2. Each class visits the Student Portal → selects their grade/section → fills the 5-step form
3. Analytics are instantly available on the report card after submission

---

## File Structure

### Pages

| File | Purpose |
|---|---|
| `index.html` | Home hub. Entry point. Routes to `setup.html` on first run, otherwise links to both portals. |
| `class_select.html` | Student portal entry. Grade + section picker; sets the active session in `sessionStorage` before forwarding to `student.html`. |
| `student.html` | 5-step student data-entry wizard: Demographics → Commute → Energy & Water → Paper → Waste. Calculates CO₂e and saves via `StorageManager`. |
| `analytics.html` | Session report card. Bar chart by emission category, grade badge, hotspot alert, improvement vs. last session. Weekly/monthly tab rescales all values. |
| `history.html` | Historical trends. Aggregates all past sessions from localStorage into a monthly CO₂e table and Chart.js line chart. |
| `overview.html` | School-wide view. Shows the latest session for every grade in one grid, plus total school emissions. |
| `solutions.html` | Geographic solution cards per emission category, tailored to Nepal's Mountain/Hilly/Terai regions and the current hotspot. |
| `transparency.html` | Methodology ledger. Full table of every emission factor with source and unit so users can verify any CO₂e number. |
| `admin.html` | Admin dashboard. Monthly school-wide inputs: electricity, LPG, diesel, water, waste type. Also manages Eco-Missions. |
| `admin_login.html` | Admin authentication. SHA-256 hashed password check before granting access to `admin.html`. |
| `setup.html` | First-run setup. School name, district, reporting period, admin password. Guarded on every other page. |

### JavaScript (`js/`)

| File | Purpose |
|---|---|
| `emission_factors.js` | Single source of truth for all CO₂e factors (IPCC 2006/2019, AR6-GWP100). Holds display metadata and shared constants (`school_days_month`, `notebook_weight_kg`, etc.). |
| `geographic_matrix.js` | Nepal's 77 districts mapped to region (Mountain/Hilly/Terai) with average commute distances and `region_defaults`. |
| `calculator_engine.js` | Core calculation logic. `calculateModule(category, key, value)` multiplies inputs by emission factors. Holds `GRADE_THRESHOLDS` and `gradeFootprint()`. |
| `storage_manager.js` | All localStorage read/write: history, admin config, grade, hotspot, missions, hashed password, CSV export, server sync. |
| `utils.js` | Shared across every page: `APP_CONSTANTS`, `showToast()`, `buildMonthOptions()`, `buildWasteScales()`. |
| `nav.js` | `renderNav()` and `renderFooter()` inject consistent navigation into every app page. |
| `solutions.js` | `categoryLabels` (emoji, label, color, bg per category) and `geoSolutionsMatrix` (district → solution cards). |
| `i18n.js` | English/Nepali bilingual support. Reads `data-i18n` attributes and swaps text from a flat key map. |
| `vendor/chart.min.js` | Chart.js 4.4.3 bundled locally for offline use. |

### Styles

| File | Purpose |
|---|---|
| `css/main.css` | Single stylesheet. Design tokens, layout utilities, and all component classes (cards, badges, wizard steps, bar chart, toast). |

---

## Emission Categories

| Category | What is tracked |
|---|---|
| Energy | Firewood (kg), LPG cylinders, electricity (kWh) per student per month |
| Commute | Walk, cycle, bus, motorbike, car — distance × students × school days |
| Water | Monthly usage (litres) by source type: groundwater, municipal, tanker, or rainwater |
| Paper | New notebooks used; whether old books were recycled or thrown away |
| Waste | Disposal method mix: open burning, pit burial, composting, recycling |

All factors are Nepal-localised. Source: IPCC 2006/2019 Refinement, AR6-GWP100.

---

## Grading Scale

Based on total monthly CO₂e per classroom (~30 students).

| Grade | Label | Range |
|---|---|---|
| A+ | Eco Champion | 0 – 30 kg |
| A | Green Warrior | 31 – 60 kg |
| B | Planet Protector | 61 – 100 kg |
| C | Eco Learner | 101 – 150 kg |
| D | Needs Action | 151 – 200 kg |
| E | Needs Immediate Focus | > 200 kg |

---

## Data & Privacy

All data is stored exclusively in the browser's `localStorage`. Nothing is sent anywhere unless the admin explicitly clicks **Sync to Server** (requires a running `sync_server.php`) or **Export CSV**.

To reset: Settings → Reset All Data, or clear site data in the browser's developer tools.
