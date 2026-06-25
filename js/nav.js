/**
 * nav.js — Eco-Tracks Nepal
 * Shared navigation and footer rendering.
 */

const NAV_PAGES = [
  { href: 'index.html',        id: 'nav-missions', i18n: 'nav_missions', label: 'Dashboard' },
  { href: 'admin.html',        id: 'nav-myschool',  i18n: 'nav_myschool',  label: 'My School' },
  { href: 'goals.html',        id: 'nav-goals',     i18n: 'nav_goals',     label: '🎯 Goals' },
  { href: 'heatmap.html',      id: 'nav-heatmap',   i18n: 'nav_heatmap',   label: '🗺️ Schools Map' },
  { href: 'transparency.html', id: 'nav-transparency', i18n: 'nav_transparency', label: 'Transparency' },
];

function renderNav({ activePage = '', actionsHTML = '' } = {}) {
  const links = NAV_PAGES.map(p =>
    `<li><a href="${p.href}"${activePage === p.href ? ' class="active"' : ''} id="${p.id}" data-i18n="${p.i18n}">${p.label}</a></li>`
  ).join('');

  const actionsSlot = actionsHTML
    ? `<div class="nav-actions" style="display:flex;gap:12px;align-items:center;">${actionsHTML}</div>`
    : '';

  const isOnline  = navigator.onLine;
  const isAdmin   = typeof StorageManager !== 'undefined' && StorageManager.isAdminSession();

  const onlineIndicator = `
    <div id="online-indicator" style="display:flex;align-items:center;gap:6px;font-size:0.78rem;font-weight:700;padding:4px 10px;border-radius:20px;background:${isOnline ? '#E8F5E9' : '#FFF3E0'};color:${isOnline ? '#2E7D32' : '#E65100'};">
      <span id="online-dot" style="width:8px;height:8px;border-radius:50%;background:${isOnline ? '#4CAF50' : '#FF9800'};"></span>
      <span id="online-label">${isOnline ? 'Online' : 'Offline'}</span>
    </div>`;

  const accountBtn = `
    <button id="nav-account-btn" title="${isAdmin ? 'Admin logged in — click to logout' : 'Admin Login'}"
      style="width:36px;height:36px;border-radius:50%;border:2px solid ${isAdmin ? '#2D6A2F' : '#ccc'};
             background:${isAdmin ? '#E8F5E9' : '#f5f5f5'};cursor:pointer;font-size:1.1rem;
             display:flex;align-items:center;justify-content:center;transition:all 0.2s;">
      ${isAdmin ? '🔓' : '🔒'}
    </button>`;

  document.body.insertAdjacentHTML('afterbegin', `
    <nav class="nav" role="navigation" aria-label="Main navigation">
      <div class="container nav__inner">
        <a href="index.html" class="nav__logo" id="nav-logo">
          <div class="nav__logo-icon">🌿</div>
          Eco-Tracks
        </a>
        <ul class="nav__links" role="list">${links}</ul>
        <div style="display:flex;gap:8px;align-items:center;">
          ${onlineIndicator}
          <a href="https://download-ecotrack.santoshray.com.np" target="_blank" rel="noopener"
             style="padding:6px 14px;background:#2D6A2F;color:#fff;border-radius:20px;font-size:0.8rem;
                    font-weight:700;text-decoration:none;display:flex;align-items:center;gap:6px;white-space:nowrap;">
            ⬇️ Download
          </a>
          ${accountBtn}
          ${actionsSlot}
        </div>
      </div>
    </nav>`);

  // ── Admin login/logout modal ────────────────────────────────────────────
  document.body.insertAdjacentHTML('beforeend', `
    <div id="admin-modal-overlay" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;align-items:center;justify-content:center;">
      <div style="background:#fff;border-radius:16px;padding:32px;max-width:360px;width:90%;box-shadow:0 24px 48px rgba(0,0,0,0.2);position:relative;">
        <button id="admin-modal-close" style="position:absolute;top:12px;right:16px;background:none;border:none;font-size:1.4rem;cursor:pointer;color:#888;">×</button>
        <div id="admin-modal-content"></div>
      </div>
    </div>`);

  document.getElementById('nav-account-btn').addEventListener('click', _openAdminModal);
  document.getElementById('admin-modal-close').addEventListener('click', _closeAdminModal);
  document.getElementById('admin-modal-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('admin-modal-overlay')) _closeAdminModal();
  });

  // Live online/offline toggle
  window.addEventListener('online',  () => _setOnlineStatus(true));
  window.addEventListener('offline', () => _setOnlineStatus(false));
}

function _openAdminModal() {
  const isAdmin = typeof StorageManager !== 'undefined' && StorageManager.isAdminSession();
  const overlay = document.getElementById('admin-modal-overlay');
  const content = document.getElementById('admin-modal-content');

  if (isAdmin) {
    const uname = typeof StorageManager !== 'undefined' ? StorageManager.getAdminUsername() : 'admin';
    content.innerHTML = `
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:3rem;margin-bottom:8px;">🔓</div>
        <h3 style="color:#2D6A2F;margin-bottom:4px;">Admin Active</h3>
        <p style="color:#666;font-size:0.9rem;">Logged in as <strong>${uname}</strong></p>
      </div>
      <button id="modal-logout-btn" class="btn btn-outline w-full" style="color:var(--red);border-color:var(--red);">Logout Admin</button>`;
    document.getElementById('modal-logout-btn').addEventListener('click', () => {
      StorageManager.clearAdminSession();
      _closeAdminModal();
      _refreshAccountBtn();
      if (typeof showToast !== 'undefined') showToast('Admin logged out.', 'success');
      // Reload admin page if on it to show locked state
      if (location.pathname.endsWith('admin.html')) location.reload();
    });
  } else {
    content.innerHTML = `
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:3rem;margin-bottom:8px;">🔒</div>
        <h3 style="color:#333;margin-bottom:4px;">Admin Login</h3>
        <p style="color:#666;font-size:0.9rem;">Enter credentials to edit school data</p>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px;">
        <input id="modal-username" type="text" placeholder="Username" class="form-input" autocomplete="username">
        <input id="modal-password" type="password" placeholder="Password" class="form-input" autocomplete="current-password">
        <div id="modal-error" style="color:#C62828;font-size:0.85rem;display:none;text-align:center;"></div>
        <button id="modal-login-btn" class="btn btn-primary w-full">Login</button>
      </div>`;

    const doLogin = async () => {
      const btn  = document.getElementById('modal-login-btn');
      const u    = document.getElementById('modal-username').value;
      const p    = document.getElementById('modal-password').value;
      const err  = document.getElementById('modal-error');
      if (!u || !p) { err.textContent = 'Enter username and password.'; err.style.display='block'; return; }
      btn.disabled = true; btn.textContent = 'Checking...';
      const ok = await StorageManager.authenticateAdmin(u, p);
      if (ok) {
        StorageManager.setAdminSession();
        _closeAdminModal();
        _refreshAccountBtn();
        if (typeof showToast !== 'undefined') showToast('✅ Admin access granted!', 'success');
        if (location.pathname.endsWith('admin.html')) location.reload();
      } else {
        err.textContent = 'Incorrect username or password.';
        err.style.display = 'block';
        btn.disabled = false; btn.textContent = 'Login';
      }
    };

    document.getElementById('modal-login-btn').addEventListener('click', doLogin);
    document.getElementById('modal-password').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
    setTimeout(() => document.getElementById('modal-username')?.focus(), 100);
  }

  overlay.style.display = 'flex';
}

function _closeAdminModal() {
  document.getElementById('admin-modal-overlay').style.display = 'none';
}

function _refreshAccountBtn() {
  const btn     = document.getElementById('nav-account-btn');
  const isAdmin = typeof StorageManager !== 'undefined' && StorageManager.isAdminSession();
  if (!btn) return;
  btn.title     = isAdmin ? 'Admin logged in — click to logout' : 'Admin Login';
  btn.style.borderColor = isAdmin ? '#2D6A2F' : '#ccc';
  btn.style.background  = isAdmin ? '#E8F5E9' : '#f5f5f5';
  btn.innerHTML = isAdmin ? '🔓' : '🔒';
}

function _setOnlineStatus(online) {
  const dot  = document.getElementById('online-dot');
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
      StorageManager.flushSyncQueue().then(result => {
        if (result.synced > 0 && typeof showToast !== 'undefined')
          showToast(`✅ ${result.synced} record(s) synced to server!`, 'success');
      }).catch(() => {});
    }
  }
}

function renderFooter({ showRefresh = false, showOverviewLink = false, showHowItWorks = false } = {}) {
  const extras = [];
  if (showOverviewLink) {
    extras.push(`<a href="overview.html" class="btn btn-primary btn-sm">📈 School Overview</a>`);
  }
  if (showRefresh) {
    extras.push(`<button class="btn btn-ghost btn-sm" id="btn-refresh-footer">↺ Refresh</button>`);
  }

  const howItWorksHTML = showHowItWorks ? `
    <div style="border-top:1px solid rgba(255,255,255,0.1);margin-top:24px;padding-top:24px;">
      <div style="font-weight:800;color:#A5D6A7;margin-bottom:16px;font-size:0.9rem;text-transform:uppercase;letter-spacing:1px;">How It Works</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;">
        <div style="background:rgba(255,255,255,0.06);border-radius:12px;padding:16px;">
          <div style="font-size:1.5rem;margin-bottom:8px;">1️⃣</div>
          <div style="font-weight:700;color:#E8F5E9;margin-bottom:4px;font-size:0.9rem;">Setup Your School</div>
          <div style="font-size:0.8rem;color:#A5D6A7;line-height:1.5;">Admin sets up school profile with location, student count, and energy sources.</div>
        </div>
        <div style="background:rgba(255,255,255,0.06);border-radius:12px;padding:16px;">
          <div style="font-size:1.5rem;margin-bottom:8px;">2️⃣</div>
          <div style="font-weight:700;color:#E8F5E9;margin-bottom:4px;font-size:0.9rem;">Log Monthly Data</div>
          <div style="font-size:0.8rem;color:#A5D6A7;line-height:1.5;">Each grade logs their energy, water, commute, and waste data monthly.</div>
        </div>
        <div style="background:rgba(255,255,255,0.06);border-radius:12px;padding:16px;">
          <div style="font-size:1.5rem;margin-bottom:8px;">3️⃣</div>
          <div style="font-weight:700;color:#E8F5E9;margin-bottom:4px;font-size:0.9rem;">See Your Impact</div>
          <div style="font-size:0.8rem;color:#A5D6A7;line-height:1.5;">Analytics shows CO₂ breakdown, pain points, and targeted solutions to reduce emissions.</div>
        </div>
      </div>
    </div>` : '';

  document.body.insertAdjacentHTML('beforeend', `
    <footer class="footer" role="contentinfo">
      <div class="container">
        <div class="footer__inner">
          <div>
            <div class="footer__brand">Eco-Tracks <span>| Nepal</span></div>
            <div class="footer__copy">&copy; 2026 <a href="transparency.html">HimalEdge Eco-Track</a></div>
          </div>
          <div class="footer__actions">
            <button class="btn btn-ghost btn-sm" id="btn-sync-footer">🔄 Sync to Server</button>
            <button class="btn btn-outline btn-sm" id="btn-reset-data" style="color:var(--red);border-color:var(--red)">🗑️ Reset Data</button>
            ${extras.join('')}
          </div>
        </div>
        ${howItWorksHTML}
      </div>
    </footer>`);
}
