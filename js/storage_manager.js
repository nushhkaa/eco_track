/**
 * StorageManager — Eco-Tracks Nepal
 * Data persistence via localStorage & network syncing.
 */
class StorageManager {

  static KEYS = {
    HISTORY:      'ecotracks_history',
    ADMIN_CONFIG: 'ecotracks_admin_config',
    ADMIN_AUTH:   'ecotracks_admin_auth',
    GRADE:        'ecotracks_current_grade',
    HOTSPOT:      'ecotracks_highest_hotspot',
    LANG:         'ecotracks_lang',
    MISSIONS:     'ecotracks_missions'
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

  static authenticateAdmin(username, password) {
    // Phase 3: Discreet predefined admin access
    return (username === 'admin' && password === 'admin123');
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

  static async syncWithServer() {
    const csvStr = this.getCSVString();
    if (!csvStr) return { success: false, message: 'No data to sync.' };

    const config = this.getAdminConfig();
    const schoolName = config ? config.schoolName : 'UnknownSchool';
    const monthYear = config && config.reportMonth ? `${config.reportMonth}_${config.reportYear}` : 'Current';

    const blob = new Blob([csvStr], { type: 'text/csv' });
    const formData = new FormData();
    formData.append('csvFile', blob, 'data.csv');
    formData.append('schoolName', schoolName);
    formData.append('monthYear', monthYear);

    try {
      const res = await fetch(APP_CONSTANTS.SYNC_SERVER_URL, {
        method: 'POST',
        body: formData
      });
      const json = await res.json();
      if (res.ok) {
        return { success: true, message: json.message || 'Synced successfully.' };
      } else {
        return { success: false, message: json.message || 'Server rejected data.' };
      }
    } catch (err) {
      console.error(err);
      // Fallback: download locally if server unreachable
      this.downloadLocalCSV();
      return { success: false, message: 'Server unreachable. Downloaded locally instead.' };
    }
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
