/**
 * nav.js — Eco-Tracks Nepal
 * Shared navigation and footer rendering.
 * Call renderNav() at the top of <body>, renderFooter() before I18n.init().
 */

const NAV_PAGES = [
  { href: 'index.html',        id: 'nav-missions', i18n: 'nav_missions', label: 'Missions' },
  { href: 'admin.html',        id: 'nav-myschool',  i18n: 'nav_myschool',  label: 'My School' },
  { href: 'goals.html',        id: 'nav-goals',     i18n: 'nav_goals',     label: '🎯 Goals' },
  { href: 'heatmap.html',      id: 'nav-heatmap',   i18n: 'nav_heatmap',   label: '🗺️ Schools Map' },
  { href: 'transparency.html', id: 'nav-badges',    i18n: 'nav_badges',    label: 'Transparency' },
];

/**
 * Inject the shared top nav into the page.
 * @param {string} activePage  - filename of the current page e.g. 'admin.html'
 * @param {string} actionsHTML - HTML string for the right-side nav actions slot
 */
function renderNav({ activePage = '', actionsHTML = '' } = {}) {
  const links = NAV_PAGES.map(p =>
    `<li><a href="${p.href}"${activePage === p.href ? ' class="active"' : ''} id="${p.id}" data-i18n="${p.i18n}">${p.label}</a></li>`
  ).join('');

  const actionsSlot = actionsHTML
    ? `<div class="nav-actions" style="display:flex;gap:12px;align-items:center;">${actionsHTML}</div>`
    : '';

  const isOnline = navigator.onLine;
  const onlineIndicator = `
    <div id="online-indicator" style="display:flex;align-items:center;gap:6px;font-size:0.78rem;font-weight:700;padding:4px 10px;border-radius:20px;background:${isOnline ? '#E8F5E9' : '#FFF3E0'};color:${isOnline ? '#2E7D32' : '#E65100'};">
      <span id="online-dot" style="width:8px;height:8px;border-radius:50%;background:${isOnline ? '#4CAF50' : '#FF9800'};"></span>
      <span id="online-label">${isOnline ? 'Online' : 'Offline'}</span>
    </div>`;

  document.body.insertAdjacentHTML('afterbegin', `
    <nav class="nav" role="navigation" aria-label="Main navigation">
      <div class="container nav__inner">
        <a href="index.html" class="nav__logo" id="nav-logo">
          <div class="nav__logo-icon">🌿</div>
          Eco-Tracks
        </a>
        <ul class="nav__links" role="list">${links}</ul>
        <div style="display:flex;gap:10px;align-items:center;">
          ${onlineIndicator}
          ${actionsSlot}
        </div>
      </div>
    </nav>`);

  // Live online/offline toggle
  window.addEventListener('online',  () => _setOnlineStatus(true));
  window.addEventListener('offline', () => _setOnlineStatus(false));
}

function _setOnlineStatus(online) {
  const dot   = document.getElementById('online-dot');
  const label = document.getElementById('online-label');
  const wrap  = document.getElementById('online-indicator');
  if (!dot) return;
  dot.style.background   = online ? '#4CAF50' : '#FF9800';
  label.textContent      = online ? 'Online' : 'Offline';
  wrap.style.background  = online ? '#E8F5E9' : '#FFF3E0';
  wrap.style.color       = online ? '#2E7D32' : '#E65100';
  if (online && typeof StorageManager !== 'undefined') {
    const pending = StorageManager.getPendingSyncCount();
    if (pending > 0) {
      if (typeof showToast !== 'undefined')
        showToast(`🔄 Back online! Syncing ${pending} record(s)...`, 'success');
      // Auto-flush in background
      StorageManager.flushSyncQueue().then(result => {
        if (result.synced > 0 && typeof showToast !== 'undefined')
          showToast(`✅ ${result.synced} record(s) synced to server!`, 'success');
      }).catch(() => {});
    }
  }
}

/**
 * Inject the shared footer at the end of the page.
 * Must be called BEFORE I18n.init() so translations apply.
 * @param {boolean} showRefresh      - include the Refresh Data button
 * @param {boolean} showOverviewLink - include the Overview link button
 */
function renderFooter({ showRefresh = false, showOverviewLink = false } = {}) {
  const extras = [];
  if (showOverviewLink) {
    extras.push(`<a href="overview.html" class="btn btn-primary btn-sm" data-i18n="footer_overview">📈 Sync with my school</a>`);
  }
  if (showRefresh) {
    extras.push(`<button class="btn btn-ghost btn-sm" id="btn-refresh-footer">&#8635; Refresh Data</button>`);
  }

  document.body.insertAdjacentHTML('beforeend', `
    <footer class="footer" role="contentinfo">
      <div class="container">
        <div class="footer__inner">
          <div>
            <div class="footer__brand">Eco-Tracks <span>| Nepal</span></div>
            <div class="footer__copy">&copy; 2026 <a href="transparency.html">HimalEdge Eco-Track</a></div>
          </div>
          <div class="footer__actions">
            <button class="btn btn-ghost btn-sm" id="btn-sync-footer" data-i18n="footer_sync">🔄 Sync with School Server</button>
            <button class="btn btn-outline btn-sm" id="btn-reset-data" style="color:var(--red);border-color:var(--red)">🗑️ Reset Data</button>
            ${extras.join('')}
          </div>
        </div>
      </div>
    </footer>`);
}
