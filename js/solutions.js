/**
 * solutions.js — Eco-Tracks Nepal
 * Geographically adaptive solutions matrix keyed by region type.
 */

export const geoSolutionsMatrix = {
  "Mountain": {
    "energy": {
      "title": "Thermal Energy — Mountain Zone",
      "summary": "High wood usage for heating detected.",
      "action": "Target: Swap open cookstoves for passive solar wall attachments and thermal-brick insulations inside rooms.",
      "icon": "🏔️",
      "effort": "Medium",
      "impact": "High"
    },
    "commute": {
      "title": "Commute — Mountain Zone",
      "summary": "Rugged trails limit vehicle access.",
      "action": "Target: Form communal student walking pairs or columns ('Walking Buses') to guarantee safety along mountain pathways.",
      "icon": "🚶",
      "effort": "Low",
      "impact": "Medium"
    },
    "waste": {
      "title": "Waste Management — Mountain Zone",
      "summary": "Cold climates stall biological breakdown.",
      "action": "Target: Build enclosed, leaf-insulated composting chambers to safely process organics without burning synthetic waste wraps.",
      "icon": "♻️",
      "effort": "Medium",
      "impact": "High"
    },
    "water": {
      "title": "Water Systems — Mountain Zone",
      "summary": "Freezing pipes waste cooking fuel thawing ice.",
      "action": "Target: Wrap exposed gravity pipes in thick layers of jute and dry grass insulations to prevent freeze losses.",
      "icon": "💧",
      "effort": "Low",
      "impact": "Medium"
    },
    "paper": {
      "title": "Paper & Books — Mountain Zone",
      "summary": "High procurement shipping footprints.",
      "action": "Target: Set up a classroom logbook return pool where scrap margins are bound together for scratchbooks.",
      "icon": "📚",
      "effort": "Low",
      "impact": "Low"
    }
  },
  "Hilly": {
    "energy": {
      "title": "Thermal Energy — Hilly Zone",
      "summary": "Heavy reliance on open flames for cooking.",
      "action": "Target: Transition the kitchen completely to community-scale anaerobic biogas systems or institutional biomass gasifier stoves.",
      "icon": "🔥",
      "effort": "High",
      "impact": "Very High"
    },
    "commute": {
      "title": "Commute — Hilly Zone",
      "summary": "Hilly terrain increases fuel loads on climbs.",
      "action": "Target: Support or create safe trail paths specifically dedicated to cycling or student foot traffic.",
      "icon": "🚴",
      "effort": "Medium",
      "impact": "High"
    },
    "waste": {
      "title": "Waste Management — Hilly Zone",
      "summary": "Trash easily catches wind down ridges.",
      "action": "Target: Establish distinct class sorting bins and organize upcycling collections instead of open-pit burning behind walls.",
      "icon": "🗑️",
      "effort": "Low",
      "impact": "High"
    },
    "water": {
      "title": "Water Systems — Hilly Zone",
      "summary": "Electric pumps run heavily for elevation lifting.",
      "action": "Target: Setup large bamboo roof rainwater harvesting structures to supply toilets completely via gravity feed.",
      "icon": "🌧️",
      "effort": "Medium",
      "impact": "High"
    },
    "paper": {
      "title": "Paper & Books — Hilly Zone",
      "summary": "High classroom material waste.",
      "action": "Target: Create a handmade recycling screen kit to transform shredded old assignment books into artistic cardstocks.",
      "icon": "📄",
      "effort": "Low",
      "impact": "Medium"
    }
  },
  "Terai": {
    "energy": {
      "title": "Thermal Energy — Terai Zone",
      "summary": "High summer heat waves trigger cooling energy draw.",
      "action": "Target: Plant native broad-leaf shade trees outside south windows and construct simple vertical bamboo screen sunshades.",
      "icon": "🌳",
      "effort": "Low",
      "impact": "Medium"
    },
    "commute": {
      "title": "Commute — Terai Zone",
      "summary": "Flat terrain makes vehicle travel unnecessary.",
      "action": "Target: Organize a student-led flat-terrain bicycle sharing network using older, shared community frames.",
      "icon": "🚲",
      "effort": "Medium",
      "impact": "Very High"
    },
    "waste": {
      "title": "Waste Management — Terai Zone",
      "summary": "Agricultural byproduct burning is common.",
      "action": "Target: Collect discarded rice husks and stalks to transform into structural classroom compost bedding or board blocks.",
      "icon": "🌾",
      "effort": "Medium",
      "impact": "High"
    },
    "water": {
      "title": "Water Systems — Terai Zone",
      "summary": "Shallow wells risk contamination, using fuel to boil.",
      "action": "Target: Install gravity-fed bio-sand and charcoal filter layers to clean water without fuel.",
      "icon": "🧪",
      "effort": "Medium",
      "impact": "Very High"
    },
    "paper": {
      "title": "Paper & Books — Terai Zone",
      "summary": "High resource turnover in lowland schools.",
      "action": "Target: Advocate for switching school supply inventories to local, fast-growing banana-fiber or elephant grass alternative papers.",
      "icon": "🍌",
      "effort": "High",
      "impact": "Medium"
    }
  }
};

export const categoryLabels = {
  energy:  { emoji: '⚡', label: 'Energy',  color: '#5B8DD9', bg: '#EEF4FF' },
  commute: { emoji: '🚌', label: 'Commute', color: '#56C15B', bg: '#EDFAEE' },
  waste:   { emoji: '🗑️', label: 'Waste',   color: '#E57373', bg: '#FFF0F0' },
  water:   { emoji: '💧', label: 'Water',   color: '#64B5F6', bg: '#EBF5FF' },
  paper:   { emoji: '📄', label: 'Paper',   color: '#C8A400', bg: '#FFFBEB' },
};

export const effortColors = {
  'Low':    '#56C15B',
  'Medium': '#FFC107',
  'High':   '#FF9800',
  'Very High': '#E57373',
};
