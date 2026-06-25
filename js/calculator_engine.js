/**
 * CalculatorEngine — Eco-Tracks Nepal
 * Loads emission_factors.json and computes kgCO2e for each input module.
 * Compliant with IPCC 2006/2019 Refinement & AR6-GWP100.
 */
class CalculatorEngine {
  // Grade thresholds in ascending order — used by gradeFootprint() and the UI grade scale.
  static GRADE_THRESHOLDS = [
    { max: 30,       grade: 'A+', label: 'Eco Champion',          color: '#2D6A2F', rangeLabel: '0 – 30 kg'    },
    { max: 60,       grade: 'A',  label: 'Green Warrior',         color: '#56C15B', rangeLabel: '31 – 60 kg'   },
    { max: 100,      grade: 'B',  label: 'Planet Protector',      color: '#8BC34A', rangeLabel: '61 – 100 kg'  },
    { max: 150,      grade: 'C',  label: 'Eco Learner',           color: '#FFC107', rangeLabel: '101 – 150 kg' },
    { max: 200,      grade: 'D',  label: 'Needs Action',          color: '#FF9800', rangeLabel: '151 – 200 kg' },
    { max: Infinity, grade: 'E',  label: 'Needs Immediate Focus', color: '#E53935', rangeLabel: '> 200 kg'     },
  ];

  constructor() {
    this.factors = null;
    this.meta = null;
    this.display = null;
  }

  init() {
    try {
      const data = window.EMISSION_FACTORS;
      this.factors = data.factors;
      this.meta = data.meta;
      this.display = data.display;
    } catch (err) {
      console.error('[CalculatorEngine] init error:', err);
      // Fallback hardcoded factors if fetch fails (offline/file:// edge case)
      this.factors = {
        energy: { firewood_kg: 0.006, lpg_cylinder: 42.3, electricity_kwh: 0.0124 },
        commute: { motorbike_km: 0.066, public_bus_pkm: 0.016, private_car_km: 0.192, petrol_vehicle_litre: 2.31, diesel_vehicle_litre: 2.65, walking_km: 0 },
        waste: { open_plastic_burning_kg: 2.89, anaerobic_pit_burial_kg: 0.71 },
        water: { groundwater_pump_m3: 0.04, municipal_piped_m3: 0.34, water_tanker_m3: 1.02, rainwater_harvest_m3: 0 },
        paper: { virgin_paper_kg: 1.84, recycled_paper_kg: 0.92 }
      };
    }
  }

  /**
   * Calculate CO2e for a specific category & sub-key.
   * @param {string} category - e.g. 'energy', 'commute', 'waste', 'water', 'paper'
   * @param {string} subKey   - e.g. 'firewood_kg', 'motorbike_km'
   * @param {number} value    - quantity in the factor's unit
   * @returns {number}        - kg CO2e
   */
  calculateModule(category, subKey, value) {
    if (!this.factors || !this.factors[category]) return 0;
    const factor = this.factors[category][subKey] ?? 0;
    return parseFloat((value * factor).toFixed(4));
  }

  /**
   * Calculate total CO2e for an entire category object.
   * @param {string} category
   * @param {Object} inputs - { subKey: value, ... }
   * @returns {number}
   */
  calculateCategoryTotal(category, inputs) {
    return Object.entries(inputs).reduce((sum, [subKey, value]) => {
      return sum + this.calculateModule(category, subKey, parseFloat(value) || 0);
    }, 0);
  }

  /**
   * Get the factor value for display purposes.
   */
  getFactor(category, subKey) {
    if (!this.factors || !this.factors[category]) return 0;
    return this.factors[category][subKey] ?? 0;
  }

  /**
   * Get display metadata for a category.
   */
  getCategoryDisplay(category) {
    if (!this.display || !this.display[category]) return null;
    return this.display[category];
  }

  /**
   * Get all display categories with their items.
   */
  getAllDisplayCategories() {
    if (!this.display) return {};
    return this.display;
  }

  /**
   * Compute trees equivalent: 1 tree absorbs ~21.77 kg CO2/year
   */
  toTreesEquivalent(kgCO2e) {
    return Math.round(kgCO2e / 21.77);
  }

  /**
   * Grade CO2e score into a letter grade for a quarter.
   * Benchmarks per quarter per classroom (~30 students).
   */
  gradeFootprint(totalKgCO2e) {
    return CalculatorEngine.GRADE_THRESHOLDS.find(t => totalKgCO2e <= t.max)
        || CalculatorEngine.GRADE_THRESHOLDS[CalculatorEngine.GRADE_THRESHOLDS.length - 1];
  }
}
