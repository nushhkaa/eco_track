/**
 * utils.js — Eco-Tracks Nepal
 * Shared constants, utility functions, and DOM helpers used across all pages.
 */

// ─── App-wide constants ───────────────────────────────────────────────────────
// Numeric defaults read from emission_factors.js at load time so they have one source of truth.
const _efc = window.EMISSION_FACTORS?.constants || {};
const APP_CONSTANTS = {
  SCHOOL_DAYS_MONTH:           _efc.school_days_month           ?? 22,
  NOTEBOOK_WEIGHT_KG:          _efc.notebook_weight_kg          ?? 0.1,
  WASTE_KG_PER_STUDENT_MONTH:  _efc.waste_kg_per_student_month  ?? 1.2,
  DEFAULT_SYNC_URL:            'https://yourdomain.com/ecotracks/sync_server.php'
};

// Dynamic sync URL — reads from admin config so each school can point to their own server
function getSyncServerUrl() {
  try {
    const cfg = JSON.parse(localStorage.getItem('ecotracks_admin_config'));
    return cfg?.syncServerUrl || APP_CONSTANTS.DEFAULT_SYNC_URL;
  } catch { return APP_CONSTANTS.DEFAULT_SYNC_URL; }
}

// Nepal district → approximate lat/lon lookup (used for heatmap)
const DISTRICT_COORDS = {
  taplejung:[27.36,87.66],sankhuwasabha:[27.35,87.12],solukhumbu:[27.73,86.65],
  okhaldhunga:[27.30,86.50],khotang:[27.02,86.83],bhojpur:[27.18,87.05],
  dhankuta:[26.98,87.35],terhathum:[27.12,87.53],panchthar:[27.15,87.78],
  ilam:[26.90,87.93],jhapa:[26.65,87.90],morang:[26.63,87.43],sunsari:[26.67,87.20],
  dolakha:[27.67,86.10],sindhupalchok:[27.95,85.68],rasuwa:[28.10,85.35],
  nuwakot:[27.97,85.17],dhading:[27.87,84.82],makwanpur:[27.43,85.03],
  kathmandu:[27.72,85.32],bhaktapur:[27.67,85.43],lalitpur:[27.66,85.32],
  kavrepalanchok:[27.55,85.67],ramechhap:[27.33,86.08],sindhuli:[27.25,85.98],
  chitwan:[27.53,84.35],gorkha:[28.00,84.63],lamjung:[28.12,84.38],
  tanahun:[27.88,84.33],kaski:[28.21,83.99],syangja:[28.07,83.88],
  parbat:[28.22,83.68],baglung:[28.27,83.58],myagdi:[28.58,83.50],
  mustang:[28.92,83.87],manang:[28.67,84.02],nawalpur:[27.57,84.12],
  palpa:[27.87,83.55],arghakhanchi:[27.95,83.18],gulmi:[28.08,83.27],
  kapilbastu:[27.57,83.08],rupandehi:[27.70,83.45],dang:[28.00,82.30],
  pyuthan:[28.10,82.87],rolpa:[28.30,82.60],eastern_rukum:[28.50,82.88],
  western_rukum:[28.63,82.12],salyan:[28.37,82.18],dolpa:[29.02,82.87],
  humla:[30.02,81.92],jumla:[29.28,82.18],kalikot:[29.13,81.62],
  mugu:[29.62,82.10],surkhet:[28.60,81.63],dailekh:[28.82,81.70],
  jajarkot:[28.70,82.22],kailali:[28.73,80.88],kanchanpur:[29.10,80.32],
  dadeldhura:[29.30,80.57],doti:[29.27,80.95],achham:[29.08,81.35],
  bajura:[29.52,81.45],bajhang:[29.70,81.15],baitadi:[29.53,80.48],
  darchula:[29.85,80.55],saptari:[26.65,86.78],siraha:[26.65,86.22],
  dhanusha:[26.82,85.93],mahottari:[26.87,85.73],sarlahi:[26.97,85.35],
  rautahat:[27.03,85.08],bara:[27.08,85.00],parsa:[27.15,84.78]
};

// ─── Toast notification ───────────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  const t = document.createElement('div');
  t.className = `toast toast--${type}`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

// ─── Month dropdown builder ───────────────────────────────────────────────────
const MONTHS = [
  { value: 'January',   i18n: 'month_jan' },
  { value: 'February',  i18n: 'month_feb' },
  { value: 'March',     i18n: 'month_mar' },
  { value: 'April',     i18n: 'month_apr' },
  { value: 'May',       i18n: 'month_may' },
  { value: 'June',      i18n: 'month_jun' },
  { value: 'July',      i18n: 'month_jul' },
  { value: 'August',    i18n: 'month_aug' },
  { value: 'September', i18n: 'month_sep' },
  { value: 'October',   i18n: 'month_oct' },
  { value: 'November',  i18n: 'month_nov' },
  { value: 'December',  i18n: 'month_dec' },
];

function buildMonthOptions(selectEl, selectedValue = '') {
  selectEl.innerHTML = MONTHS.map(m =>
    `<option value="${m.value}"${selectedValue === m.value ? ' selected' : ''} data-i18n="${m.i18n}">${m.value}</option>`
  ).join('');
}

// ─── Waste scale radio component ─────────────────────────────────────────────
const WASTE_SCALE_TYPES = [
  { name: 'waste-scale-burn',  cls: 'waste-scale-card--burn',  labelKey: 'std_waste_burn',    label: '🔥 Open Burning'          },
  { name: 'waste-scale-pit',   cls: 'waste-scale-card--pit',   labelKey: 'std_waste_pit',     label: '🕳️ Pit Burial'            },
  { name: 'waste-scale-comp',  cls: 'waste-scale-card--comp',  labelKey: 'std_waste_comp',    label: '🌱 Composting'             },
  { name: 'waste-scale-recyc', cls: 'waste-scale-card--recyc', labelKey: 'std_waste_recycle', label: '♻️ Recycle to Collectors'  },
];
const WASTE_SCALE_OPTIONS = [
  { value: '0', i18n: 'scale_never',     label: 'Never'     },
  { value: '1', i18n: 'scale_rarely',    label: 'Rarely'    },
  { value: '2', i18n: 'scale_sometimes', label: 'Sometimes' },
  { value: '3', i18n: 'scale_often',     label: 'Often'     },
  { value: '4', i18n: 'scale_always',    label: 'Always'    },
];

function buildWasteScales(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = WASTE_SCALE_TYPES.map(t => `
    <div class="waste-scale-card ${t.cls}">
      <label class="form-label text-sm mb-12" style="display:block" data-i18n="${t.labelKey}">${t.label}</label>
      <div class="waste-scale-row">
        ${WASTE_SCALE_OPTIONS.map(s => `
          <label class="waste-scale-option">
            <input type="radio" name="${t.name}" value="${s.value}" ${s.value === '0' ? 'checked' : ''}>
            <span data-i18n="${s.i18n}">${s.label}</span>
          </label>`).join('')}
      </div>
    </div>`).join('');
}
