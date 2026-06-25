# Eco-Tracks Nepal — Codebase Analysis Report
*Generated: June 2026*

---

## 1. Project Structure

```
eco_track/
├── index.html            ← Landing page / portal selection
├── login.html            ← Student login (grade/section picker)
├── login_admin.html      ← Admin password auth
├── setup.html            ← First-time school initialization
├── admin.html            ← Teacher operations ledger
├── student.html          ← 4-step student wizard form
├── analytics.html        ← Report card / CO2 breakdown
├── solutions.html        ← Geographic eco-missions
├── overview.html         ← School-wide grade-by-grade stats
├── transparency.html     ← Emission factors / transparency ledger
├── past_analytics.html   ← Historical chart (FAKE DATA)
├── css/main.css          ← Unified design system
└── js/
    ├── storage_manager.js    ← LocalStorage + CSV/sync logic
    ← calculator_engine.js   ← CO2 calculation engine
    ├── emission_factors.js   ← Nepal emission factor data (global)
    ├── geographic_matrix.js  ← 77-district geo data (global)
    ├── i18n.js               ← English/Nepali translation engine
    └── solutions.js          ← Geographic solutions matrix
```

---

## 2. Verified Working Features

These features have been verified by reading the full implementation end-to-end:

| Feature | Files | Status |
|---|---|---|
| School first-time setup | `setup.html` | ✅ Working |
| Admin login (hardcoded creds) | `login_admin.html`, `storage_manager.js` | ✅ Working (insecure) |
| Admin ledger — save school metrics | `admin.html` | ✅ Working |
| Live CO2 preview while typing | `admin.html` | ✅ Working |
| Student login (grade + section) | `login.html` | ✅ Working |
| 4-step student wizard | `student.html` | ✅ Working |
| Commute CO2 calculation | `student.html`, `calculator_engine.js` | ✅ Working |
| Paper CO2 calculation | `student.html`, `calculator_engine.js` | ✅ Working |
| Waste scale → CO2 calculation | `student.html`, `calculator_engine.js` | ✅ Working |
| Region-adjusted commute distance | `student.html`, `geographic_matrix.js` | ✅ Working |
| Report card with grade + bar chart | `analytics.html` | ✅ Working |
| Previous session comparison overlay | `analytics.html` | ✅ Working |
| Hotspot detection + alert | `analytics.html` | ✅ Working |
| Geographic solutions display | `solutions.html`, `solutions.js` | ✅ Working |
| Commit-to-mission + active mission banner | `solutions.html`, `student.html` | ✅ Working |
| School-wide grade overview | `overview.html` | ✅ Working |
| Transparency / emission factors table | `transparency.html` | ✅ Working |
| CSV local download | `storage_manager.js` | ✅ Working |
| Sync → server (localhost fallback to CSV) | `storage_manager.js` | ✅ Working (server deleted) |
| English ↔ Nepali toggle | `i18n.js` | ✅ Working |
| LocalStorage persistence (offline-first) | `storage_manager.js` | ✅ Working |
| Admin config guard (redirect to setup) | All pages | ✅ Working |
| Reset all data | `i18n.js` | ✅ Working |
| Methodology CSV download | `transparency.html` | ✅ Working |

### Confirmed Broken / Non-Functional
| Feature | Location | Issue |
|---|---|---|
| 12-month historical analytics | `past_analytics.html` | Entire page is hardcoded fake data, not from localStorage |
| Chart on past_analytics page | `past_analytics.html` | Loads Chart.js from CDN — breaks offline |
| Footer sync button on transparency.html | `transparency.html:446` | Calls `StorageManager.downloadCSV()` which **does not exist** (should be `downloadLocalCSV()`) |
| Weekly/Monthly tab toggle | `analytics.html` | Cosmetic only — does not change any data |
| Solutions image placeholders | `solutions.html` | Still shows `[Upload Image: src/img/${cat}.jpg]` text |
| Energy tracking in student form | `student.html` | Energy always submitted as `{ value: 0, co2: 0 }` |
| Water tracking in student form | `student.html` | Water always submitted as `{ value: 0, co2: 0 }` |

---

## 3. Hardcoded Values (Must Be Removed)

### 3.1 Admin Credentials — `storage_manager.js:31`
```js
// CRITICAL: plaintext credentials in client-side JS
return (username === 'admin' && password === 'admin123');
```
Anyone can open DevTools and read this. Should be configurable during setup or checked against a stored (hashed) value in localStorage.

### 3.2 Commute Distance Per Region — `student.html:248–257`
```js
let avgDist = 8; // Default Hilly
if (region === 'Terai') avgDist = 4;
if (region === 'Hilly') avgDist = 8;
if (region === 'Mountain') avgDist = 12;
```
These values belong in `geographic_matrix.js` as a `avg_commute_km` field per region, not buried in page logic.

### 3.3 Calculation Constants — `student.html:315–339`
```js
const days = 22;           // school days/month — hardcoded
let pVirg = cNew * 0.1;    // 0.1kg per notebook — hardcoded
const totalWasteMonthly = students * 1.2;  // 1.2kg waste/student/month — hardcoded
```
These are scientific parameters that need to be in `emission_factors.js` or a dedicated `constants.js`.

### 3.4 Server URL — `storage_manager.js:148`
```js
const res = await fetch('http://localhost:8080/sync_server.php', ...);
```
Should be a configurable constant at the top of the file, not buried in a function.

### 3.5 Fake 12-Month Data — `past_analytics.html:113–194`
The entire historical analytics page uses hardcoded data arrays. The table and chart are completely fabricated (Jul 2025 – Jun 2026 with hand-typed values). This page should read from `StorageManager.getHistory()`.

### 3.6 Emission Factors Table — `transparency.html:378–398`
```js
const factorsData = [
  { category: 'Energy', activity: 'Firewood (Biomass)', factor: 0.006 },
  // ... 14 more rows, all duplicating emission_factors.js
];
```
This is a full duplication of `window.EMISSION_FACTORS.display`. The table should be built by reading the existing data structure.

### 3.7 Grade Scale Table — `analytics.html:517–522`
```html
<span class="badge" style="background:#2E7D32;color:white">A+</span> 0 kg
<span class="badge" style="background:#4CAF50;color:white">A</span> 1 - 50 kg
```
These thresholds and colors are already defined in `calculator_engine.js:gradeFootprint()`. The HTML duplicates them with hardcoded hex values that will go out of sync if grades change.

### 3.8 Default Year — `setup.html:79`
```html
<input type="number" id="setup-year" value="2024" min="2020">
```
Should default to `new Date().getFullYear()`, not a hardcoded year (currently 2 years out of date).

### 3.9 Grade Range — `overview.html:122`
```js
for (let i = 1; i <= 10; i++) {
  gradeStats[`Grade ${i}`] = ...
}
```
If the school ever uses a different grade system, this breaks. Should derive grades from actual history data.

### 3.10 Effort/Impact → Percentage — `solutions.html:125–131`
```js
function mapPerc(val) {
  if (val === 'Low') return '30%';
  if (val === 'Medium') return '60%';
  if (val === 'High') return '85%';
  if (val === 'Very High') return '95%';
}
```
The numeric percentages are arbitrary. The `solutions.js` data already has `effort` and `impact` as strings. Either store numeric values in the matrix or define this mapping in `solutions.js` next to the data.

---

## 4. Repetitive / Copy-Pasted Code

### 4.1 Navigation Block — Duplicated 9 Times
Identical (or near-identical) `<nav>` HTML is copy-pasted in every single HTML file. Any change to navigation requires editing 9 files. The only variation is which link gets `class="active"`.

```html
<!-- This block repeats across: index, admin, analytics, student, 
     solutions, overview, transparency, past_analytics, login_admin -->
<nav class="nav" role="navigation" aria-label="Main navigation">
  <div class="container nav__inner">
    <a href="index.html" class="nav__logo" id="nav-logo">
      <div class="nav__logo-icon">🌿</div>
      Eco-Tracks
    </a>
    <ul class="nav__links" role="list">...</ul>
    ...
  </div>
</nav>
```

### 4.2 Footer Block — Duplicated 6+ Times
Footer with sync/reset buttons is copy-pasted across: `index.html`, `admin.html`, `analytics.html`, `overview.html`, `transparency.html`. Each copy also contains slight variations.

### 4.3 `showToast()` — Defined 4 Times
```js
function showToast(msg, type = 'success') {
  const t = document.createElement('div');
  t.className = `toast toast--${type}`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}
```
Identical implementation in: `admin.html:474`, `analytics.html:552`, `overview.html:155`, `transparency.html:451`. Should be a single function in a shared `utils.js`.

### 4.4 Month `<option>` List — Duplicated Twice
The full 12-month dropdown is copy-pasted in `admin.html:229–242` and `setup.html:62–75`. Should be built dynamically from an array.

### 4.5 Waste Radio Group — Copy-Pasted 4 Times in `student.html`
The 5-option radio scale (Never/Rarely/Sometimes/Often/Always) for Burn, Pit, Composting, Recycling are structurally identical HTML repeated 4 times with different `name` attributes. English labels are hardcoded instead of using existing i18n keys (`scale_never`, `scale_rarely`, etc.).

### 4.6 `categoryLabels` / `catMeta` — Defined in 3 Places
```js
// solutions.js:133
const categoryLabels = { energy: { emoji:'⚡', label:'Energy', color:'#5B8DD9', bg:'#EEF4FF' }, ... };

// analytics.html:330
const catMeta = { energy: { emoji:'⚡', label:'Energy', color:'#5B8DD9' }, ... };

// transparency.html:381 (inline in factorsData)
{ emoji: '⚡', color: '#5B8DD9', bg: '#EEF4FF', ... }
```
Three separate definitions of the same category metadata. One source of truth in `solutions.js` or a shared `constants.js`.

### 4.7 Admin Config Guard — Repeated 6 Times
```js
if (!StorageManager.getAdminConfig()) { window.location.replace('setup.html'); }
```
This auth guard snippet sits at the top of 6 different HTML files. Should be a single function in a shared utility script.

### 4.8 Script Loading Order — Repeated on Every Page
```html
<script src="./js/geographic_matrix.js"></script>
<script src="./js/emission_factors.js"></script>
```
…then later…
```html
<script src="./js/i18n.js"></script>
```
This manual dependency chain is fragile and repeated across all pages.

### 4.9 Google Fonts Link — Repeated 9 Times
```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari..." rel="stylesheet">
```
Repeated in every HTML file. Since the CSS already `@import`s Nunito, Noto Sans Devanagari is only needed when Nepali is active.

---

## 5. Bugs

| # | File | Line | Bug |
|---|---|---|---|
| 1 | `transparency.html` | 446 | `StorageManager.downloadCSV()` called — method does not exist. Should be `downloadLocalCSV()`. Sync button on transparency page is silently broken. |
| 2 | `past_analytics.html` | 143 | Chart.js loaded from CDN (`cdn.jsdelivr.net`). Breaks the core offline-first promise. |
| 3 | `student.html` | 364–365 | `energy` and `water` categories always saved as `{ value: 0, co2: 0 }` — no inputs exist for these in the student form, so they are permanently zero in all reports. |
| 4 | `analytics.html` | 534–542 | Weekly/Monthly tab toggle is purely cosmetic — changing tabs does nothing to the displayed data. |
| 5 | `solutions.html` | 165–167 | Image placeholder text `[Upload Image: src/img/${cat}.jpg]` ships as visible content in every solution card. |
| 6 | `setup.html` | 79 | Year defaults to `2024`, not the current year. |
| 7 | `storage_manager.js` | 170 | `downloadLocalCSV()` uses `encodeURI` (does not encode commas/quotes) instead of `encodeURIComponent`, which can corrupt CSV if data contains special characters. |
| 8 | `storage_manager.js` | 63 | `setActiveMission` uses raw string key `'ecotracks_missions'` instead of `this.KEYS` — inconsistent with the rest of the class. |
| 9 | `admin.html` | 446 | `StorageManager.getAdminConfig()` called twice in the submit handler (lines 434 and 446) — redundant double-read. |
| 10 | `student.html` | 11–14 | `alert()` fires during page load (before paint) if admin hasn't set metrics. Poor UX — should redirect cleanly. |
| 11 | `admin.html` | 352 | `loadDistricts()` is declared `async` but awaits nothing. Leftover from when data was fetched via HTTP. |
| 12 | `past_analytics.html` | — | Page has no auth guard — accessible even without school setup. |

---

## 6. Structural / Architecture Issues

### 6.1 No Shared Module / Component System
Every page is fully self-contained HTML with repeated nav, footer, toast, and script boilerplate. Without a build tool or even a minimal template system, maintaining consistency across 11 pages is error-prone.

**Minimum fix:** Extract nav, footer, and `showToast` into an `app.js` that gets loaded universally.

### 6.2 All Data Is Global Variables
`window.EMISSION_FACTORS`, `window.GEOGRAPHIC_MATRIX`, `CalculatorEngine`, `StorageManager`, `I18n`, `geoSolutionsMatrix`, `categoryLabels`, `effortColors` are all injected into global scope. This means any script or browser extension can accidentally overwrite them.

### 6.3 Massive Inline Style Usage
`student.html`, `analytics.html`, and `admin.html` each have 30–50+ inline `style=""` attributes overriding the design system. This makes theme changes require editing HTML, not CSS.

### 6.4 The `async/await` Wrapper Is Unnecessary
In `analytics.html` and `student.html`, the main logic is wrapped in `async function() { ... }` and `await engine.init()` is called. But `engine.init()` only reads from `window.EMISSION_FACTORS` which is already a synchronous global. The async wrapper adds confusion with no benefit.

### 6.5 `calculator_engine.js` is Constructed But Never Reused Across Pages
A new `new CalculatorEngine()` is created in `admin.html`, `analytics.html`, and `student.html` independently. There's no shared instance. For a localStorage-only SPA, a singleton export pattern would be cleaner.

---

## 7. Refactoring Plan (Without Breaking Working Features)

### Phase 1: Bug Fixes (Safe, Zero Risk)

1. **Fix `StorageManager.downloadCSV()` bug** in `transparency.html:446` → rename to `downloadLocalCSV()`
2. **Fix setup year** in `setup.html:79` → `new Date().getFullYear()`
3. **Fix `encodeURI` → `encodeURIComponent`** in `storage_manager.js:downloadLocalCSV()`
4. **Move `'ecotracks_missions'`** to `StorageManager.KEYS` object
5. **Remove alert() on page load** in `student.html:12–14` → redirect silently
6. **Add auth guard** to `past_analytics.html`
7. **Remove `async` keyword** from `loadDistricts()` in `admin.html:352`

### Phase 2: Extract Shared Utilities

8. **Create `js/utils.js`** containing:
   - `showToast(msg, type)` — remove 4 copies
   - `requireAdminConfig()` — replaces the 6 copy-pasted auth guard lines
   - `buildMonthOptions(selectEl)` — replaces 2 copy-pasted month dropdowns
   - A `CONSTANTS` object: `{ SCHOOL_DAYS_MONTH: 22, NOTEBOOK_WEIGHT_KG: 0.1, WASTE_KG_PER_STUDENT_MONTH: 1.2, SYNC_SERVER_URL: 'http://localhost:8080/sync_server.php' }`

9. **Create `js/nav.js`** — inject nav and footer HTML once:
   ```js
   function renderNav(activePage) { ... }
   function renderFooter() { ... }
   ```
   Remove 9 copies of nav HTML and 6 copies of footer HTML from every page.

### Phase 3: Eliminate Data Duplication

10. **`transparency.html` factor table** — remove `factorsData` array, build table by iterating `window.EMISSION_FACTORS.display`
11. **`analytics.html` grade scale** — remove hardcoded grade badge HTML, generate from `engine.gradeFootprint()` thresholds
12. **`categoryLabels` in `analytics.html`** — import/reference `categoryLabels` from `solutions.js` instead of redefining `catMeta`
13. **Move commute distance per region** into `geographic_matrix.js` as `avg_commute_km` field
14. **Move calculation constants** (school days, notebook weight, waste rate) into `emission_factors.js` under a `"constants"` key

### Phase 4: Fix `past_analytics.html`

15. **Replace hardcoded data table** — read from `StorageManager.getHistory()`, group by `monthYear`, aggregate per category
16. **Bundle Chart.js locally** (copy the minified file into `js/vendor/`) to restore offline capability
17. **Remove fake data rows** from HTML

### Phase 5: Structural Improvements (Moderate Effort)

18. **Extract inline styles** from `student.html`, `analytics.html`, `admin.html` into `main.css` classes — reduce inline `style=""` count by ~80%
19. **Make waste radio group a reusable component** — a JS function `renderWasteScale(container, name, i18nLabel)` that generates the radio group HTML, replacing 4 copy-pasted blocks. Use existing i18n keys (`scale_never`, `scale_rarely`, etc.)
20. **Admin credential handling** — during `setup.html`, let the admin choose a password. Store it hashed (SHA-256 via Web Crypto API) in localStorage. `StorageManager.authenticateAdmin()` compares hash.
21. **Remove `async/await` from synchronous code** in `analytics.html` and `student.html` — simplify to sync calls since no actual async operation occurs

### Phase 6: Complete Missing Features

22. **Energy inputs in student form** — add a Step 2.5 or extend Step 2 for monthly firewood/LPG use at home (most impactful Nepal-specific metric)
23. **Water inputs in student form** — add to appropriate step (e.g., water source type)
24. **Weekly/Monthly tab** — actually wire up to aggregate data by week vs. full month from `StorageManager.getHistory()`
25. **Solutions image placeholders** — either add real images or remove the placeholder div

---

## 8. Quick-Win Priority Summary

| Priority | Task | Risk | Effort |
|---|---|---|---|
| 🔴 Critical | Fix `downloadCSV()` bug (silent breakage) | Zero | 2 min |
| 🔴 Critical | Fix hardcoded year 2024 in setup | Zero | 2 min |
| 🟠 High | Extract `showToast` to shared utils | Very Low | 30 min |
| 🟠 High | Extract constants (days, weights) to config | Low | 1 hr |
| 🟠 High | Fix past_analytics.html (real data + offline chart) | Medium | 3–4 hr |
| 🟡 Medium | Build transparency table from emission_factors.js | Low | 1 hr |
| 🟡 Medium | Extract nav/footer to shared component | Medium | 2–3 hr |
| 🟡 Medium | Add energy + water to student form | Medium | 3 hr |
| 🟢 Low | Remove inline styles → CSS classes | Low | 2–3 hr |
| 🟢 Low | Admin password configurability | Medium | 2 hr |
