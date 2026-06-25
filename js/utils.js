/**
 * utils.js — Eco-Tracks Nepal
 * Shared constants, utility functions, and DOM helpers used across all pages.
 */

// ─── App-wide constants ───────────────────────────────────────────────────────
const APP_CONSTANTS = {
  SCHOOL_DAYS_MONTH:           22,
  NOTEBOOK_WEIGHT_KG:          0.1,
  WASTE_KG_PER_STUDENT_MONTH:  1.2,
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
