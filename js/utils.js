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
  SYNC_SERVER_URL:             'http://localhost:8080/sync_server.php'
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
