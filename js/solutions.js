/**
 * solutions.js — Eco-Tracks Nepal
 * Geographically adaptive solutions with specific actions and CO₂ reduction data.
 * Emission reduction figures sourced from IPCC 2006/2019 and Nepal-specific field studies.
 */

const categoryLabels = {
  energy:  { emoji: '⚡', label: 'Energy',  color: '#5B8DD9', bg: '#EEF4FF' },
  commute: { emoji: '🚌', label: 'Commute', color: '#56C15B', bg: '#EDFAEE' },
  waste:   { emoji: '🗑️', label: 'Waste',   color: '#E57373', bg: '#FFF0F0' },
  water:   { emoji: '💧', label: 'Water',   color: '#64B5F6', bg: '#EBF5FF' },
  paper:   { emoji: '📄', label: 'Paper',   color: '#C8A400', bg: '#FFFBEB' },
};

// Each action: reduction_pct (% of that category's CO₂), cost, difficulty, time_to_impact
const geoSolutionsMatrix = {
  Mountain: {
    energy: {
      title: 'Energy — Mountain Zone',
      context: 'High-altitude schools burn firewood and biomass for heating up to 6 months/year. Switching heat sources and insulating buildings gives the highest return per rupee spent.',
      actions: [
        {
          id: 'solar_wall',
          title: 'Passive Solar Trombe Wall',
          description: 'Attach dark-painted thermal-mass panels to south-facing classroom walls. Absorbs solar heat by day, radiates at night — no fuel cost.',
          steps: ['Identify south-facing walls (>4m²)', 'Paint wall black or attach corrugated metal', 'Add polycarbonate glazing 15cm in front', 'Cut vents at top and bottom to allow airflow'],
          reduction_pct: 35,
          monthly_kg_typical: 22,
          cost: 'Low (NPR 3,000–8,000)',
          difficulty: 'Medium',
          time_to_impact: '1 month',
          badge: 'energy_saver'
        },
        {
          id: 'improved_cookstove',
          title: 'Improved Biomass Cookstove (ICS)',
          description: 'Replace open firewood cooking with a RETS-certified improved cookstove. Burns 40–60% less wood, cuts smoke, and reduces indoor air pollution.',
          steps: ['Contact district energy office for subsidised ICS units', 'Install in kitchen/canteen area', 'Train canteen staff on proper fuel loading', 'Track firewood usage before vs. after (target: 40% less)'],
          reduction_pct: 50,
          monthly_kg_typical: 31,
          cost: 'Low (NPR 1,500–4,000 subsidised)',
          difficulty: 'Low',
          time_to_impact: '1 week',
          badge: 'energy_saver'
        },
        {
          id: 'insulation',
          title: 'Jute/Grass Pipe & Wall Insulation',
          description: 'Wrap exposed gravity water pipes and roof-joints in jute and dry grass bundles to prevent freeze-burst losses and heat escape through walls.',
          steps: ['Buy jute bags or collect dry grass', 'Wrap exposed pipes 10cm thick, secure with wire', 'Seal window gaps with mud-plaster or rubber strips', 'Check and reseal before winter (October)'],
          reduction_pct: 20,
          monthly_kg_typical: 12,
          cost: 'Free (local materials)',
          difficulty: 'Low',
          time_to_impact: '1 week',
          badge: 'energy_saver'
        }
      ]
    },
    commute: {
      title: 'Commute — Mountain Zone',
      context: 'Rugged mountain terrain limits vehicles. Students travel on foot or by motorbike. Walking buses and organised groups make foot travel safer and reduce private vehicle use.',
      actions: [
        {
          id: 'walking_bus',
          title: 'Student Walking Bus Network',
          description: 'Assign a "walking bus" route per neighbourhood — a group of students walks together with a parent/teacher at front and back. Replaces 80% of private vehicle pickups.',
          steps: ['Map student home clusters on a paper/offline map', 'Designate 3–5 walking routes with meeting points', 'Assign parent volunteer pairs per route', 'Launch trial week; track participating households'],
          reduction_pct: 65,
          monthly_kg_typical: 28,
          cost: 'Free',
          difficulty: 'Low',
          time_to_impact: '2 weeks',
          badge: 'green_commuter'
        },
        {
          id: 'motorbike_pooling',
          title: 'Motorbike Ride-Sharing Roster',
          description: 'Create a shared pickup roster — teachers and parents with motorbikes take turns carrying 2 students instead of 1, halving total trips.',
          steps: ['Create a shared WhatsApp/paper roster', 'Match students by proximity', 'Track weekly: total trips before vs. after', 'Reward consistent participants monthly'],
          reduction_pct: 40,
          monthly_kg_typical: 17,
          cost: 'Free',
          difficulty: 'Low',
          time_to_impact: '1 week',
          badge: 'green_commuter'
        }
      ]
    },
    waste: {
      title: 'Waste — Mountain Zone',
      context: 'Cold temperatures slow biological breakdown, making open burning the default. Enclosed composting chambers maintain heat and compost even in winter, eliminating the highest-impact disposal method.',
      actions: [
        {
          id: 'enclosed_compost',
          title: 'Insulated Composting Chamber',
          description: 'Build a leaf-insulated compost box (wood or stone walls, lid) that maintains >15°C internally — enough for year-round decomposition without burning.',
          steps: ['Build 1m×1m×1m box from local stone or wood planks', 'Line walls with 15cm of dry leaves or straw', 'Add kitchen/organic waste daily; cover with soil layer', 'Turn pile weekly; compost is ready in 6–8 weeks'],
          reduction_pct: 90,
          monthly_kg_typical: 38,
          cost: 'Free–Low (local stone)',
          difficulty: 'Medium',
          time_to_impact: '1 month',
          badge: 'waste_champion'
        },
        {
          id: 'segregation_bins',
          title: '3-Bin Segregation System',
          description: 'Label 3 bins: Organic (wet food), Dry (paper/plastic), Hazardous (batteries/gloves). Organic goes to compost; dry to collectors; hazardous to municipality drop-off.',
          steps: ['Label 3 buckets or barrels (colour-coded)', 'Brief students with a 10-minute session', 'Assign weekly "waste monitors" per class', 'Track contamination rate weekly (target <10%)'],
          reduction_pct: 70,
          monthly_kg_typical: 29,
          cost: 'Free (reuse existing containers)',
          difficulty: 'Low',
          time_to_impact: '1 week',
          badge: 'waste_champion'
        }
      ]
    },
    water: {
      title: 'Water — Mountain Zone',
      context: 'Gravity-fed pipes often freeze and burst in winter, wasting water and requiring fuel to thaw. Insulating pipes and fixing leaks prevents both water loss and energy waste.',
      actions: [
        {
          id: 'pipe_insulation',
          title: 'Pipe Freeze Protection',
          description: 'Wrap all exposed pipe sections in thick jute and dry-grass sleeves. Prevents freeze-burst that wastes thousands of litres and requires fuel to thaw.',
          steps: ['Walk all pipes in October; mark exposed sections', 'Wrap 3 layers of jute + grass (10cm total thickness)', 'Secure with wire ties every 30cm', 'Check joints for cracks; seal with PTFE tape'],
          reduction_pct: 30,
          monthly_kg_typical: 4,
          cost: 'Free',
          difficulty: 'Low',
          time_to_impact: '1 week',
          badge: 'water_warrior'
        },
        {
          id: 'leak_fix',
          title: 'Systematic Tap & Joint Repair',
          description: 'A single leaking tap wastes 100–500 litres/month. Fix all leaking taps and joints — the cheapest water and CO₂ reduction available.',
          steps: ['Do a tap audit: test every tap and joint; mark leakers', 'Buy washers and PTFE tape (NPR 50–200 total)', 'Involve senior students as repair crew (supervised)', 'Recheck monthly; target: 0 leaking taps'],
          reduction_pct: 25,
          monthly_kg_typical: 3,
          cost: 'NPR 50–200',
          difficulty: 'Low',
          time_to_impact: '1 day',
          badge: 'leak_fixer'
        }
      ]
    },
    paper: {
      title: 'Paper — Mountain Zone',
      context: 'Remote procurement adds transport CO₂ to paper footprint. Maximising reuse of existing paper and sharing books between grade cohorts cuts both cost and emissions.',
      actions: [
        {
          id: 'scratchbook_pool',
          title: 'Scrap-Paper Scratchbook Program',
          description: 'Collect single-sided printed sheets and staple into scratchbooks for rough work. Each A4 reuse displaces 1.84 kg CO₂/kg of virgin paper saved.',
          steps: ['Set up a "scrap paper" tray in every class', 'Monthly: collect single-sided sheets, staple in sets of 20', 'Distribute as scratchbooks for maths/rough work', 'Track: aim to replace 50% of rough-work notebooks'],
          reduction_pct: 40,
          monthly_kg_typical: 6,
          cost: 'Free',
          difficulty: 'Low',
          time_to_impact: '1 week',
          badge: null
        },
        {
          id: 'book_return',
          title: 'Book Return & Redistribution Pool',
          description: 'Set up a library shelf where graduating classes donate textbooks to junior classes. Cuts new book procurement by 30–50% per year.',
          steps: ['Announce annual book return in final-term assembly', 'Label and catalogue returned books by subject/grade', 'Distribute at start of next academic year before purchase', 'Track: % of classes receiving donated books (target 40%)'],
          reduction_pct: 30,
          monthly_kg_typical: 4,
          cost: 'Free',
          difficulty: 'Low',
          time_to_impact: '1 semester',
          badge: null
        }
      ]
    }
  },

  Hilly: {
    energy: {
      title: 'Energy — Hilly Zone',
      context: 'Hilly-zone schools rely heavily on firewood and LPG for cooking, and grid electricity for lighting. Switching cooking fuel and cutting lighting waste are the two highest-impact actions.',
      actions: [
        {
          id: 'biogas_stove',
          title: 'Community Biogas Plant for Kitchen',
          description: 'A small biogas plant (2–4 m³ dome) fed by kitchen organic waste + toilet waste produces enough gas for daily canteen cooking — replacing LPG or firewood entirely.',
          steps: ['Contact Alternative Energy Promotion Centre (AEPC) for 30–50% subsidy', 'Site near kitchen and toilet block (10m apart)', 'Construct dome with mason over 3–5 days', 'Train canteen staff on gas valve operation and slurry use as fertiliser'],
          reduction_pct: 70,
          monthly_kg_typical: 44,
          cost: 'NPR 40,000–80,000 (50% subsidised by AEPC)',
          difficulty: 'High',
          time_to_impact: '3 months',
          badge: 'energy_saver'
        },
        {
          id: 'led_retrofit',
          title: 'LED Lighting Retrofit + Smart Controls',
          description: 'Replace all fluorescent/incandescent bulbs with LED equivalents. Add occupancy stickers ("Last out? Lights off!") and a designated light monitor per class.',
          steps: ['Audit all bulbs: count and wattage', 'Calculate payback (LED saves 60–80% per bulb)', 'Replace starting with highest-usage rooms', 'Assign a weekly "Lights Monitor" per class'],
          reduction_pct: 40,
          monthly_kg_typical: 18,
          cost: 'NPR 200–400 per bulb; payback in 4–8 months',
          difficulty: 'Low',
          time_to_impact: '1 month',
          badge: 'energy_saver'
        },
        {
          id: 'solar_pv',
          title: 'Rooftop Solar PV (100–300W starter)',
          description: 'A 100W solar panel charges a 12V battery bank powering LED lights in 3–6 classrooms — eliminating their grid electricity demand entirely.',
          steps: ['Check roof orientation (ideally south-facing, >30° tilt)', 'Get quote from local solar installer (NEA-registered)', 'Apply for Rural Energy Fund subsidy if off-grid', 'Install and connect; monitor monthly kWh offset'],
          reduction_pct: 50,
          monthly_kg_typical: 22,
          cost: 'NPR 25,000–60,000',
          difficulty: 'Medium',
          time_to_impact: '1–2 months',
          badge: 'energy_saver'
        }
      ]
    },
    commute: {
      title: 'Commute — Hilly Zone',
      context: 'Hilly terrain makes cycling difficult on steep grades, but safe foot paths and cycling corridors on flatter valley stretches can replace 60%+ of motorized trips.',
      actions: [
        {
          id: 'cycle_path',
          title: 'School Cycling Corridor Campaign',
          description: 'Lobby VDC/municipality to mark or maintain a dedicated student cycling path on the main flat route. Provide parking and secure a few shared bikes.',
          steps: ['Identify flat sections (< 5% grade) within 3 km of school', 'Submit letter to VDC/Nagarpalika for path marking', 'Apply for Youth Cycle Program bikes (UNDP/local NGO)', 'Run a monthly "Cycle to School Day"'],
          reduction_pct: 55,
          monthly_kg_typical: 24,
          cost: 'Free–Low',
          difficulty: 'Medium',
          time_to_impact: '3 months',
          badge: 'green_commuter'
        },
        {
          id: 'walking_groups',
          title: 'Neighbourhood Walking Groups',
          description: 'Map student residence clusters and create 4–6 walking groups. Each group has a senior student or parent "guide". Replaces individual motorbike/vehicle trips.',
          steps: ['Survey: ask each student their home neighbourhood', 'Form groups of 5–8 students per route', 'Create simple map showing meeting points (timed)', 'Run a 2-week trial; reward consistent walkers in assembly'],
          reduction_pct: 45,
          monthly_kg_typical: 20,
          cost: 'Free',
          difficulty: 'Low',
          time_to_impact: '2 weeks',
          badge: 'green_commuter'
        }
      ]
    },
    waste: {
      title: 'Waste — Hilly Zone',
      context: 'Wind easily carries loose waste down slopes. Enclosed composting and sorting prevents environmental spread and eliminates the 2.89 kg CO₂e/kg from open plastic burning.',
      actions: [
        {
          id: 'compost_system',
          title: 'Open-Air Bin Composting System',
          description: 'Three-bin composting: fill → wait → use. Organic kitchen waste becomes compost for school garden or farmland in 8 weeks — zero burning required.',
          steps: ['Build 3 adjacent wooden bins (1m³ each) near kitchen', 'Bin 1: add fresh waste + dry leaves daily', 'After 1 month: move to Bin 2 (mixing); Bin 1 restarts', 'After 8 weeks in Bin 3: compost is ready to use on garden'],
          reduction_pct: 85,
          monthly_kg_typical: 36,
          cost: 'NPR 2,000–5,000 (lumber)',
          difficulty: 'Medium',
          time_to_impact: '2 months',
          badge: 'waste_champion'
        },
        {
          id: 'upcycle_program',
          title: 'Dry Waste Upcycling & Collector Link',
          description: 'Partner with a local waste collector or NGO to collect sorted dry waste (plastic, metal, paper) monthly. Converts waste from burning to recycling income.',
          steps: ['Contact district solid waste office for registered collector list', 'Set up a dry waste storage room/corner in school', 'Run monthly collection day (2nd Saturday)', 'Use income from sales for class events/prizes'],
          reduction_pct: 60,
          monthly_kg_typical: 25,
          cost: 'Free (earns income)',
          difficulty: 'Low',
          time_to_impact: '1 month',
          badge: 'waste_champion'
        }
      ]
    },
    water: {
      title: 'Water — Hilly Zone',
      context: 'Electric pumps raising water to hilly-zone storage tanks consume significant grid energy. Rainwater harvesting and gravity feed reduces pump runtime, cutting electricity AND water CO₂.',
      actions: [
        {
          id: 'rainwater_harvest',
          title: 'Bamboo-Gutter Rooftop Rainwater Harvesting',
          description: 'Bamboo gutters on sloped roofs channel rainwater into a 2,000–5,000 L tank. Gravity-feeds toilets and taps, eliminating pump energy for 4–6 months/year.',
          steps: ['Measure roof area (L×W) — 1mm rain → 0.8L per m²', 'Install bamboo gutters along roof edge (split bamboo, slope 1°)', 'Connect to a food-grade polyethylene tank', 'Add first-flush diverter (first 2mm of rain diverted away)'],
          reduction_pct: 35,
          monthly_kg_typical: 5,
          cost: 'NPR 8,000–20,000',
          difficulty: 'Medium',
          time_to_impact: '1 month',
          badge: 'water_warrior'
        },
        {
          id: 'grey_water_reuse',
          title: 'Grey Water Garden Reuse System',
          description: 'Channel handwashing and kitchen-rinse water through a gravel-sand filter into a barrel used for garden irrigation — reducing fresh water demand by 15–20%.',
          steps: ['Identify handwashing points closest to garden', 'Run pipe from sink drain to a gravel-filled barrel (filter)', 'Overflow from barrel waters garden beds by gravity', 'Clean filter gravel monthly (rinse with clean water)'],
          reduction_pct: 20,
          monthly_kg_typical: 3,
          cost: 'NPR 1,000–3,000',
          difficulty: 'Low',
          time_to_impact: '2 weeks',
          badge: 'water_warrior'
        }
      ]
    },
    paper: {
      title: 'Paper — Hilly Zone',
      context: 'High classroom throughput in hilly schools means paper waste is proportionately large. Double-sided printing, book sharing and assignment digitisation are highest-impact actions.',
      actions: [
        {
          id: 'double_sided',
          title: 'Mandatory Double-Sided Printing Policy',
          description: 'All school notices, worksheets and tests must be printed double-sided. Simple policy cuts paper consumption — and its CO₂ — by 50% immediately.',
          steps: ['Set printer default to "double-sided" in driver settings', 'Post reminder sticker on each printer: "Double-sided only"', 'Issue a circular to all teachers', 'Monthly audit: weigh paper reams used vs. previous month'],
          reduction_pct: 50,
          monthly_kg_typical: 7,
          cost: 'Free',
          difficulty: 'Low',
          time_to_impact: '1 day',
          badge: null
        },
        {
          id: 'digital_homework',
          title: 'Digital Homework Submission Pilot',
          description: 'For classes with phone/device access: students photograph written homework and submit via shared folder or messaging group. Eliminates assignment paper for participating classes.',
          steps: ['Identify classes where ≥60% of students have phones', 'Create shared Google Drive/WhatsApp group per subject', 'Teachers review photos and give verbal feedback in class', 'Measure: % of assignments submitted digitally (target 50%)'],
          reduction_pct: 40,
          monthly_kg_typical: 5,
          cost: 'Free',
          difficulty: 'Low',
          time_to_impact: '1 week',
          badge: null
        }
      ]
    }
  },

  Terai: {
    energy: {
      title: 'Energy — Terai Zone',
      context: 'Terai schools face intense summer heat (40°C+), driving air-cooling energy demand. Natural cooling strategies can cut cooling energy by 30–50%, and solar PV turns the ample sun into a resource.',
      actions: [
        {
          id: 'shade_trees',
          title: 'Native Shade Tree Plantation',
          description: 'Plant fast-growing native trees (Neem, Mango, Bamboo) on the south and west sides of classrooms. Mature trees reduce indoor temperature by 4–7°C, cutting cooling energy by 30–40%.',
          steps: ['Identify south/west wall locations (3–5m from wall)', 'Contact district forest office for free seedlings', 'Plant 3–5 trees per classroom block', 'Water daily for first 3 months; protect with bamboo ring'],
          reduction_pct: 35,
          monthly_kg_typical: 18,
          cost: 'Free (govt. seedlings)',
          difficulty: 'Low',
          time_to_impact: '6–12 months',
          badge: 'energy_saver'
        },
        {
          id: 'bamboo_sunscreen',
          title: 'Vertical Bamboo Sunscreen Panels',
          description: 'Install split-bamboo screens on south and west windows. Blocks direct radiation, reducing solar heat gain by 50% while maintaining airflow — an immediate, zero-cost retrofit.',
          steps: ['Split dried bamboo poles into 5cm strips', 'Weave into 1m×1.5m panels (match window width)', 'Hang from window frame top with wire hooks', 'Remove in winter to allow solar warming'],
          reduction_pct: 25,
          monthly_kg_typical: 13,
          cost: 'Free (local bamboo)',
          difficulty: 'Low',
          time_to_impact: '1 week',
          badge: 'energy_saver'
        },
        {
          id: 'solar_pv_terai',
          title: 'Rooftop Solar PV System',
          description: 'Terai has 5.5+ peak sun hours/day — highest in Nepal. A 500W system covers 80%+ of school lighting/fan demand and exports excess to the grid.',
          steps: ['Get site assessment from NEA-authorised installer', 'Apply for SREP subsidy (Solar Rooftop Energy Programme)', 'Install south-facing panels at 15° tilt', 'Monitor monthly: units generated vs. bill reduction'],
          reduction_pct: 60,
          monthly_kg_typical: 31,
          cost: 'NPR 60,000–150,000 (40% subsidy available)',
          difficulty: 'High',
          time_to_impact: '2–3 months',
          badge: 'energy_saver'
        }
      ]
    },
    commute: {
      title: 'Commute — Terai Zone',
      context: 'Flat terrain is perfectly suited to cycling. Bicycle commuting can replace 70%+ of motorbike trips with zero CO₂ — the single highest-impact commute intervention in the Terai.',
      actions: [
        {
          id: 'bicycle_sharing',
          title: 'School Bicycle Sharing Network',
          description: 'A pool of 10–20 shared bicycles, available daily for students within 5km radius. Each bicycle replaces 1–2 motorbike trips/day, saving ~0.7 kg CO₂ per 10km trip.',
          steps: ['Apply to local NGO or municipality for bicycle grant', 'Set up secure storage (locked shed or courtyard)', 'Issue bicycle cards — students book for week-long use', 'Track: % of cyclists vs. previous vehicle users'],
          reduction_pct: 70,
          monthly_kg_typical: 30,
          cost: 'NPR 1,200–2,000 per bicycle',
          difficulty: 'Medium',
          time_to_impact: '1 month',
          badge: 'green_commuter'
        },
        {
          id: 'rickshaw_pool',
          title: 'Cycle-Rickshaw Carpool Scheme',
          description: 'Negotiate fixed-route school rickshaw contracts. One rickshaw carries 3–4 students, replacing 3–4 motorbike trips — reducing commute CO₂ by 50% for participants.',
          steps: ['Map student clusters within 3km radius', 'Negotiate monthly rate with local rickshaw operators', 'Create pickup schedules with parents', 'Track: % of students using rickshaw vs. private vehicles'],
          reduction_pct: 50,
          monthly_kg_typical: 21,
          cost: 'NPR 400–600/student/month',
          difficulty: 'Low',
          time_to_impact: '2 weeks',
          badge: 'green_commuter'
        }
      ]
    },
    waste: {
      title: 'Waste — Terai Zone',
      context: 'Agricultural byproduct burning (rice husks, straw) adds to school waste emissions in the Terai. Converting this to useful material while segregating school waste eliminates double-burning.',
      actions: [
        {
          id: 'rice_husk_compost',
          title: 'Rice Husk Biochar Bedding',
          description: 'Collect surplus rice husks from nearby farms. Mix with kitchen organic waste to create biochar-enriched compost — 60% more nutrients, zero burning.',
          steps: ['Contact nearby farmers for rice husk (often free)', 'Layer school kitchen waste with rice husks (1:2 ratio)', 'Compost in open pile or bin for 6 weeks', 'Use as garden/flower bed soil amendment'],
          reduction_pct: 80,
          monthly_kg_typical: 34,
          cost: 'Free',
          difficulty: 'Low',
          time_to_impact: '6 weeks',
          badge: 'waste_champion'
        },
        {
          id: 'plastic_collector',
          title: 'Plastic-Free Zone + Collector Partnership',
          description: 'Ban single-use plastics on school premises and partner with a local "kabadi" collector for weekly pickup of dry recyclables — converting potential burning into circular economy.',
          steps: ['Issue school plastic-free policy (principal sign-off)', 'Place "No Plastic Bags" signs at gate and canteen', 'Contact nearest kabadi/waste collector for weekly pickup', 'Donate income to school garden fund or prizes'],
          reduction_pct: 65,
          monthly_kg_typical: 27,
          cost: 'Free',
          difficulty: 'Low',
          time_to_impact: '1 month',
          badge: 'waste_champion'
        }
      ]
    },
    water: {
      title: 'Water — Terai Zone',
      context: 'Shallow wells and boreholes often require electric pumps, and seasonal flooding contaminates supply. Bio-sand filtration eliminates fuel-boiling, and drip irrigation halves garden water use.',
      actions: [
        {
          id: 'biosand_filter',
          title: 'Bio-Sand & Charcoal Water Filter',
          description: 'A gravity-fed concrete box filter (gravel → sand → charcoal → sand layers) removes 99%+ of bacteria — eliminating the need to boil water with fuel before drinking.',
          steps: ['Build 50cm×50cm×80cm concrete box or use large barrel', 'Layer from bottom: gravel (10cm) → coarse sand (15cm) → charcoal (5cm) → fine sand (25cm)', 'Let water drip through slowly into a sealed container', 'Recharge filter sand every 6 months'],
          reduction_pct: 45,
          monthly_kg_typical: 6,
          cost: 'NPR 3,000–8,000',
          difficulty: 'Medium',
          time_to_impact: '1 month',
          badge: 'water_warrior'
        },
        {
          id: 'drip_irrigation',
          title: 'Drip Irrigation for School Garden',
          description: 'Replace overhead sprinklers/bucket watering with a simple drip-line system from a rooftop tank. Cuts garden water use by 50% and eliminates pump runtime during watering.',
          steps: ['Install a 500–1,000 L elevated tank (2m above ground)', 'Connect drip lines (low-cost perforated hose) to garden rows', 'Set gravity timer or manual valve for 30-min watering', 'Compare monthly water meter readings before vs. after'],
          reduction_pct: 30,
          monthly_kg_typical: 4,
          cost: 'NPR 2,000–6,000',
          difficulty: 'Low',
          time_to_impact: '2 weeks',
          badge: 'water_warrior'
        }
      ]
    },
    paper: {
      title: 'Paper — Terai Zone',
      context: 'High resource throughput in lowland schools and access to agricultural fibre make alternative paper sources viable. Combined with digital-first practices, paper CO₂ can be cut by 60%+.',
      actions: [
        {
          id: 'banana_fiber_paper',
          title: 'Banana Fibre / Recycled Paper Advocacy',
          description: 'Transition school purchase orders to locally-produced banana-fibre or recycled paper. Banana-fibre paper emits 0.4 kg CO₂/kg vs. 1.84 kg for virgin paper — a 78% reduction per sheet.',
          steps: ['Contact Paper Innovation Centre Pokhara or local suppliers', 'Request samples; compare price (often 10–20% premium)', 'Submit supplier-switch request to school management', 'Track % of paper orders switched (target 50%)'],
          reduction_pct: 60,
          monthly_kg_typical: 8,
          cost: '10–20% premium on paper cost',
          difficulty: 'Medium',
          time_to_impact: '1–3 months',
          badge: null
        },
        {
          id: 'notice_board_digital',
          title: 'Digital Notice Board (WhatsApp/Viber)',
          description: 'Replace all printed notices with digital distribution via class parent groups. A school of 400 students sends ~200 printed notices/week — going digital saves 10+ kg paper/month.',
          steps: ['Create class-level parent WhatsApp/Viber groups', 'Train admin staff to send digital notices (photo of typed notice is fine)', 'Track: # of physical notices printed per week (target: 0)', 'Emergency notices still printed in small batches'],
          reduction_pct: 45,
          monthly_kg_typical: 6,
          cost: 'Free',
          difficulty: 'Low',
          time_to_impact: '1 week',
          badge: null
        }
      ]
    }
  }
};
