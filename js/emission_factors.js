window.EMISSION_FACTORS = {
  "meta": {
    "compliance": "UNFCCC Decision 18/CMA.1",
    "methodology": "IPCC 2006/2019 Refinement",
    "gwp_metric": "AR6-GWP100",
    "source": "Nepal localized factors — Pokhara school study + IPCC + DEFRA"
  },
  "constants": {
    "school_days_month": 22,
    "notebook_weight_kg": 0.1,
    "waste_kg_per_student_month": 1.2
  },
  "factors": {
    "energy": {
      "firewood_kg": 0.0060,
      "lpg_cylinder": 42.3000,
      "lpg_kg": 2.9800,
      "lpg_litre": 1.5100,
      "electricity_kwh_iea": 0.0200,
      "electricity_kwh": 0.0124
    },
    "commute": {
      "motorbike_km": 0.066,
      "public_bus_pkm": 0.016,
      "private_car_km": 0.1920,
      "petrol_vehicle_litre": 2.3100,
      "diesel_vehicle_litre": 2.6500,
      "walking_km": 0.0000,
      "cycling_km": 0.0000
    },
    "waste": {
      "open_plastic_burning_kg": 2.8900,
      "anaerobic_pit_burial_kg": 0.7100,
      "municipal_mixed_kg": 0.5000,
      "municipal_separated_kg": 0.1000
    },
    "water": {
      "groundwater_pump_m3": 0.0400,
      "municipal_piped_m3": 0.3400,
      "water_tanker_m3": 1.0200,
      "rainwater_harvest_m3": 0.0000
    },
    "paper": {
      "virgin_paper_kg": 1.8400,
      "recycled_paper_kg": 0.9200
    }
  },
  "display": {
    "energy": {
      "label": "Energy",
      "icon": "⚡",
      "color": "#5B8DD9",
      "bg": "#EEF4FF",
      "items": [
        { "key": "firewood_kg", "label": "Firewood (Biomass)", "unit": "kg CO₂e / kg" },
        { "key": "lpg_cylinder", "label": "LPG Cylinder (14.2 kg)", "unit": "kg CO₂e / cylinder" },
        { "key": "electricity_kwh", "label": "NEA Hydro Grid Electricity", "unit": "kg CO₂e / kWh" }
      ]
    },
    "commute": {
      "label": "Commute",
      "icon": "🚌",
      "color": "#56C15B",
      "bg": "#EDFAEE",
      "items": [
        { "key": "private_car_km", "label": "Private Car / Taxi", "unit": "kg CO₂e / km" },
        { "key": "motorbike_km", "label": "Staff / Student Motorbike", "unit": "kg CO₂e / km" },
        { "key": "public_bus_pkm", "label": "Local Public Bus / Microbus", "unit": "kg CO₂e / pass-km" },
        { "key": "petrol_vehicle_litre", "label": "Petrol Vehicle", "unit": "kg CO₂e / litre" },
        { "key": "diesel_vehicle_litre", "label": "Diesel Vehicle", "unit": "kg CO₂e / litre" },
        { "key": "walking_km", "label": "Walking", "unit": "kg CO₂e / km" },
        { "key": "cycling_km", "label": "Cycling", "unit": "kg CO₂e / km" }
      ]
    },
    "waste": {
      "label": "Waste",
      "icon": "🗑️",
      "color": "#E57373",
      "bg": "#FFF0F0",
      "items": [
        { "key": "open_plastic_burning_kg", "label": "Open-Air Plastic Burning", "unit": "kg CO₂e / kg" },
        { "key": "anaerobic_pit_burial_kg", "label": "Unmanaged Anaerobic Pit Burial", "unit": "kg CO₂e / kg" },
        { "key": "municipal_mixed_kg", "label": "Municipal Single Collection", "unit": "kg CO₂e / kg" },
        { "key": "municipal_separated_kg", "label": "Municipal Separated Collection", "unit": "kg CO₂e / kg" }
      ]
    },
    "water": {
      "label": "Water",
      "icon": "💧",
      "color": "#64B5F6",
      "bg": "#EBF5FF",
      "items": [
        { "key": "groundwater_pump_m3", "label": "Groundwater (Borehole Pump)", "unit": "kg CO₂e / m³" },
        { "key": "municipal_piped_m3", "label": "Municipal Piped Water Supply", "unit": "kg CO₂e / m³" },
        { "key": "water_tanker_m3", "label": "Water Tanker Supply", "unit": "kg CO₂e / m³" },
        { "key": "rainwater_harvest_m3", "label": "Rainwater Harvesting", "unit": "kg CO₂e / m³" }
      ]
    },
    "paper": {
      "label": "Paper",
      "icon": "📄",
      "color": "#C8A400",
      "bg": "#FFFBEB",
      "items": [
        { "key": "virgin_paper_kg", "label": "Textbooks & Ledger Paper (Virgin)", "unit": "kg CO₂e / kg" },
        { "key": "recycled_paper_kg", "label": "Textbooks & Ledger Paper (Recycled)", "unit": "kg CO₂e / kg" }
      ]
    }
  }
}
;