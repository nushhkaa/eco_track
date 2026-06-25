/**
 * StorageManager — Eco-Tracks Nepal
 * Data persistence via localStorage & network syncing.
 */
class StorageManager {

  static KEYS = {
    HISTORY:         'ecotracks_history',
    ADMIN_CONFIG:    'ecotracks_admin_config',
    ADMIN_AUTH:      'ecotracks_admin_auth',
    ADMIN_PASSWORD:  'ecotracks_admin_password',
    ADMIN_USERNAME:  'ecotracks_admin_username',
    MONTHLY_LOGS:    'ecotracks_monthly_logs',
    GRADE:           'ecotracks_current_grade',
    HOTSPOT:         'ecotracks_highest_hotspot',
    LANG:            'ecotracks_lang',
    MISSIONS:        'ecotracks_missions',
    GOALS:           'ecotracks_goals',
    BADGES:          'ecotracks_badges',
    SYNC_QUEUE:      'ecotracks_sync_queue'
  };

  // ─── Admin Config & Auth ───────────────────────────────────────────────────
  static saveAdminConfig(config) {
    localStorage.setItem(this.KEYS.ADMIN_CONFIG, JSON.stringify({
      ...config,
      savedAt: new Date().toISOString()
    }));
  }

  static getAdminConfig() {
    const raw = localStorage.getItem(this.KEYS.ADMIN_CONFIG);
    return raw ? JSON.parse(raw) : null;
  }

  static async hashPassword(pw) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  static async setAdminPassword(pw) {
    const hash = await this.hashPassword(pw);
    localStorage.setItem(this.KEYS.ADMIN_PASSWORD, hash);
  }

  static setAdminUsername(username) {
    localStorage.setItem(this.KEYS.ADMIN_USERNAME, username.trim().toLowerCase());
  }

  static getAdminUsername() {
    return localStorage.getItem(this.KEYS.ADMIN_USERNAME) || 'admin';
  }

  static async authenticateAdmin(username, password) {
    const storedUser = this.getAdminUsername();
    if (username.trim().toLowerCase() !== storedUser) return false;
    const stored = localStorage.getItem(this.KEYS.ADMIN_PASSWORD);
    if (!stored) return false;
    const hashed = await this.hashPassword(password);
    return hashed === stored;
  }

  static isAdminSession() {
    return sessionStorage.getItem('ecotracks_admin_session') === '1';
  }

  static setAdminSession() {
    sessionStorage.setItem('ecotracks_admin_session', '1');
  }

  static clearAdminSession() {
    sessionStorage.removeItem('ecotracks_admin_session');
  }

  // ─── Monthly Usage Logs ───────────────────────────────────────────────────
  static addMonthlyLog(logData) {
    const logs = this.getMonthlyLogs();
    logs.push({ ...logData, id: `mlog_${Date.now()}`, savedAt: new Date().toISOString() });
    localStorage.setItem(this.KEYS.MONTHLY_LOGS, JSON.stringify(logs));
  }

  static getMonthlyLogs() {
    return JSON.parse(localStorage.getItem(this.KEYS.MONTHLY_LOGS)) || [];
  }

  static getLatestMonthlyLog() {
    const logs = this.getMonthlyLogs();
    return logs.length ? logs[logs.length - 1] : null;
  }

  // Returns adminConfig merged with latest monthly log values so calculators always get fresh data
  static getEffectiveConfig() {
    const base   = this.getAdminConfig() || {};
    const latest = this.getLatestMonthlyLog();
    if (!latest) return base;
    return {
      ...base,
      electricity:  latest.electricity  ?? base.electricity,
      water:        latest.water        ?? base.water,
      diesel:       latest.diesel       ?? base.diesel,
      lpg:          latest.lpg          ?? base.lpg,
      wasteType:    latest.wasteType    ?? base.wasteType,
      lunchMethod:  latest.lunchMethod  ?? base.lunchMethod,
      leakingTaps:  latest.leakingTaps  ?? base.leakingTaps,
      greyWaterUse: latest.greyWaterUse ?? base.greyWaterUse,
      reportMonth:  latest.month        ?? base.reportMonth,
      reportYear:   latest.year         ?? base.reportYear,
    };
  }

  // ─── Language ────────────────────────────────────────────────────────────────
  static setLanguage(lang) {
    localStorage.setItem(this.KEYS.LANG, lang);
  }

  static getLanguage() {
    return localStorage.getItem(this.KEYS.LANG) || 'en';
  }

  // ─── Session Grade & Section ───────────────────────────────────────────────────
  static setCurrentGrade(grade, section = 'A') {
    sessionStorage.setItem(this.KEYS.GRADE, `${grade} - Section ${section}`);
  }

  static getCurrentGrade() {
    return sessionStorage.getItem(this.KEYS.GRADE) || 'Grade 5 - Section A';
  }

  // ─── Hotspot ─────────────────────────────────────────────────────────────────
  static setHotspot(category) {
    sessionStorage.setItem(this.KEYS.HOTSPOT, category);
  }

  static getHotspot() {
    return sessionStorage.getItem(this.KEYS.HOTSPOT) || 'energy';
  }

  // ─── Active Missions ─────────────────────────────────────────────────────────
  static setActiveMission(grade, solutionTitle) {
    const missions = JSON.parse(localStorage.getItem(this.KEYS.MISSIONS)) || {};
    missions[grade] = {
      title: solutionTitle,
      startedAt: new Date().toISOString()
    };
    localStorage.setItem(this.KEYS.MISSIONS, JSON.stringify(missions));
  }

  static getActiveMission(grade) {
    const missions = JSON.parse(localStorage.getItem(this.KEYS.MISSIONS)) || {};
    return missions[grade] || null;
  }

  // ─── Quarterly History ───────────────────────────────────────────────────────
  static saveQuarterlyLog(grade, dataPayload) {
    const history = this.getHistory();
    const config = this.getAdminConfig() || {};
    const timestamp = new Date().toISOString().substring(0, 10);
    const totalCO2 = Object.values(dataPayload).reduce((s, d) => s + (d.co2 || 0), 0);
    
    // Store month/year context
    const monthYear = config.reportMonth ? `${config.reportMonth}_${config.reportYear}` : timestamp.substring(0, 7);

    history.push({ 
      timestamp, 
      monthYear,
      grade, 
      data: dataPayload, 
      totalCO2: parseFloat(totalCO2.toFixed(4)) 
    });
    localStorage.setItem(this.KEYS.HISTORY, JSON.stringify(history));
  }

  static getHistory() {
    return JSON.parse(localStorage.getItem(this.KEYS.HISTORY)) || [];
  }

  static getLatestForGrade(grade) {
    const filtered = this.getHistory().filter(i => i.grade === grade);
    return filtered.length ? filtered[filtered.length - 1] : null;
  }

  static getPreviousForGrade(grade) {
    const filtered = this.getHistory().filter(i => i.grade === grade);
    return filtered.length > 1 ? filtered[filtered.length - 2] : null;
  }

  static clearHistory() {
    localStorage.removeItem(this.KEYS.HISTORY);
  }

  // ─── CSV Export & Sync ───────────────────────────────────────────────────────
  static getCSVString() {
    const history = this.getHistory();
    if (!history.length) return null;

    const header = 'Timestamp,ReportMonth,Grade,Category,MetricValue,Computed_kgCO2e,TotalSessionCO2e\n';
    const rows = [];

    history.forEach(row => {
      Object.keys(row.data).forEach(cat => {
        const entry = row.data[cat];
        rows.push(`${row.timestamp},${row.monthYear || ''},${row.grade},${cat},${entry.value ?? ''},${entry.co2 ?? ''},${row.totalCO2 ?? ''}`);
      });
    });

    return header + rows.join('\n');
  }

  static getSyncUrl() {
    return this.getAdminConfig()?.syncServerUrl || (typeof APP_CONSTANTS !== 'undefined' ? APP_CONSTANTS.DEFAULT_SYNC_URL : '');
  }

  static async syncWithServer() {
    const csvStr = this.getCSVString();
    if (!csvStr) return { success: false, message: 'No data to sync.' };

    const config    = this.getAdminConfig();
    const schoolName = config ? config.schoolName : 'UnknownSchool';
    const monthYear  = config?.reportMonth ? `${config.reportMonth}_${config.reportYear}` : 'Current';
    const syncUrl    = this.getSyncUrl();

    if (!syncUrl) return { success: false, message: 'Sync server URL not configured.' };

    const blob = new Blob([csvStr], { type: 'text/csv' });
    const formData = new FormData();
    formData.append('csvFile', blob, 'data.csv');
    formData.append('schoolName', schoolName);
    formData.append('monthYear', monthYear);

    try {
      const res  = await fetch(syncUrl, { method: 'POST', body: formData });
      const json = await res.json();
      return res.ok
        ? { success: true,  message: json.message || 'Synced successfully.' }
        : { success: false, message: json.message || 'Server rejected data.' };
    } catch (err) {
      console.error(err);
      this.downloadLocalCSV();
      return { success: false, message: 'Server unreachable. Downloaded locally instead.' };
    }
  }

  static async flushSyncQueue() {
    const queue   = this.getSyncQueue().filter(q => !q.synced);
    if (queue.length === 0) return { synced: 0, failed: 0 };

    const config   = this.getAdminConfig() || {};
    const syncUrl  = this.getSyncUrl();
    if (!syncUrl) return { synced: 0, failed: 0 };

    let synced = 0, failed = 0;

    for (const item of queue) {
      try {
        const body = JSON.stringify({
          action:     'sync',
          schoolName: config.schoolName || 'Unknown',
          district:   config.district   || '',
          region:     config.region     || '',
          reportMonth: config.reportMonth || '',
          reportYear:  config.reportYear  || new Date().getFullYear(),
          grade:      item.grade,
          payload:    item.payload,
          createdAt:  item.createdAt
        });

        const res = await fetch(syncUrl, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body
        });

        if (res.ok) {
          this.markSynced(item.id);
          synced++;
        } else {
          failed++;
        }
      } catch {
        failed++;
      }
    }

    return { synced, failed };
  }

  static downloadLocalCSV(filename = 'ecotracks_local_backup.csv') {
    const csvStr = this.getCSVString();
    if (!csvStr) return false;
    
    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvStr);
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  }

  // ─── Goals & Badges ──────────────────────────────────────────────────────────
  static getGoals(grade) {
    const all = JSON.parse(localStorage.getItem(this.KEYS.GOALS)) || {};
    return all[grade] || [];
  }

  static saveGoals(grade, goals) {
    const all = JSON.parse(localStorage.getItem(this.KEYS.GOALS)) || {};
    all[grade] = goals;
    localStorage.setItem(this.KEYS.GOALS, JSON.stringify(all));
  }

  static getBadges(grade) {
    const all = JSON.parse(localStorage.getItem(this.KEYS.BADGES)) || {};
    return all[grade] || [];
  }

  static saveBadges(grade, badges) {
    const all = JSON.parse(localStorage.getItem(this.KEYS.BADGES)) || {};
    all[grade] = badges;
    localStorage.setItem(this.KEYS.BADGES, JSON.stringify(all));
  }

  static awardBadge(grade, badge) {
    const badges = this.getBadges(grade);
    if (!badges.find(b => b.id === badge.id)) {
      badges.push({ ...badge, earnedAt: new Date().toISOString() });
      this.saveBadges(grade, badges);
      return true;
    }
    return false;
  }

  // ─── Sync Queue ───────────────────────────────────────────────────────────────
  static addToSyncQueue(type, grade, payload) {
    const queue = JSON.parse(localStorage.getItem(this.KEYS.SYNC_QUEUE)) || [];
    queue.push({ id: `sync_${Date.now()}`, type, grade, payload, createdAt: new Date().toISOString(), synced: false });
    localStorage.setItem(this.KEYS.SYNC_QUEUE, JSON.stringify(queue));
  }

  static getSyncQueue() {
    return JSON.parse(localStorage.getItem(this.KEYS.SYNC_QUEUE)) || [];
  }

  static markSynced(id) {
    const queue = this.getSyncQueue();
    const item = queue.find(q => q.id === id);
    if (item) {
      item.synced = true;
      localStorage.setItem(this.KEYS.SYNC_QUEUE, JSON.stringify(queue));
    }
  }

  static getPendingSyncCount() {
    return this.getSyncQueue().filter(q => !q.synced).length;
  }

  // ─── Setup Export / Import ────────────────────────────────────────────────────
  static exportSetupPackage() {
    const pkg = {
      version: 1,
      exportedAt: new Date().toISOString(),
      adminConfig: this.getAdminConfig(),
      adminPasswordHash: localStorage.getItem(this.KEYS.ADMIN_PASSWORD)
    };
    const blob = new Blob([JSON.stringify(pkg, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const school = (pkg.adminConfig?.schoolName || 'school').replace(/\s+/g, '_');
    link.href = url;
    link.download = `ecotracks_setup_${school}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static importSetupPackage(json) {
    try {
      const pkg = typeof json === 'string' ? JSON.parse(json) : json;
      if (!pkg.adminConfig) throw new Error('Invalid setup file');
      this.saveAdminConfig(pkg.adminConfig);
      if (pkg.adminPasswordHash) {
        localStorage.setItem(this.KEYS.ADMIN_PASSWORD, pkg.adminPasswordHash);
      }
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  // ─── Summary Stats ───────────────────────────────────────────────────────────
  static getSummaryStats() {
    const history = this.getHistory();
    if (!history.length) return null;

    const totalEntries = history.length;
    const totalCO2 = history.reduce((s, i) => s + (i.totalCO2 || 0), 0);
    const avgCO2 = totalCO2 / totalEntries;
    const lastEntry = history[history.length - 1];

    return { totalEntries, totalCO2: parseFloat(totalCO2.toFixed(2)), avgCO2: parseFloat(avgCO2.toFixed(2)), lastEntry };
  }
}
