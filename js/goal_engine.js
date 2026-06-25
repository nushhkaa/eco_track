/**
 * GoalEngine — Eco-Tracks Nepal
 * Manages goals, commitments, and badge awards based on student submission data.
 */

const BADGE_DEFINITIONS = {
  energy_saver: {
    id: 'energy_saver',
    title: 'Energy Saver',
    emoji: '💡',
    description: 'Reduced heating/cooling usage for a full month',
    color: '#FF9800'
  },
  water_warrior: {
    id: 'water_warrior',
    title: 'Water Warrior',
    emoji: '💧',
    description: 'Started grey water reuse practice',
    color: '#2196F3'
  },
  waste_champion: {
    id: 'waste_champion',
    title: 'Waste Champion',
    emoji: '♻️',
    description: 'Implemented waste segregation bins in classroom',
    color: '#4CAF50'
  },
  green_commuter: {
    id: 'green_commuter',
    title: 'Green Commuter',
    emoji: '🚶',
    description: 'Switched majority of commute to walking or cycling',
    color: '#8BC34A'
  },
  leak_fixer: {
    id: 'leak_fixer',
    title: 'Leak Fixer',
    emoji: '🔧',
    description: 'Reported and fixed all leaking taps',
    color: '#00BCD4'
  }
};

const GOAL_TEMPLATES = {
  reduce_heating: {
    id: 'reduce_heating',
    badgeId: 'energy_saver',
    title: 'Reduce Heating/Cooling Usage',
    description: 'Assign a monitor to turn off the heating/cooling system during unused periods. Complete for 1 month to earn the Energy Saver badge.',
    icon: '❄️',
    category: 'energy',
    checkTrigger: (data) => data.energy?.hasHeatingCooling && data.energy?.heatingHoursPerDay > 0,
    checkComplete: (prev, current) =>
      current.energy?.hasHeatingCooling === false ||
      (prev?.energy?.heatingHoursPerDay > 0 && (current.energy?.heatingHoursPerDay || 0) < prev.energy.heatingHoursPerDay * 0.5)
  },
  grey_water: {
    id: 'grey_water',
    badgeId: 'water_warrior',
    title: 'Start Grey Water Reuse',
    description: 'Collect grey water from handwashing stations and use it to water the school garden or fulbari. Earn the Water Warrior badge!',
    icon: '♻️',
    category: 'water',
    checkTrigger: (data) => data.water?.greyWaterUse === false,
    checkComplete: (prev, current) => current.water?.greyWaterUse === true
  },
  fix_leaks: {
    id: 'fix_leaks',
    badgeId: 'leak_fixer',
    title: 'Fix All Leaking Taps',
    description: 'Report leaking taps to school maintenance. Get them all fixed within the month. Every drip counts!',
    icon: '🔧',
    category: 'water',
    checkTrigger: (data) => (data.water?.leakingTaps || 0) > 0,
    checkComplete: (prev, current) => (current.water?.leakingTaps || 0) === 0
  },
  waste_segregation: {
    id: 'waste_segregation',
    badgeId: 'waste_champion',
    title: 'Add Waste Segregation Bins',
    description: 'Set up separate bins for dry waste, wet waste, and hazardous materials in your classroom. Earn the Waste Champion badge!',
    icon: '🗂️',
    category: 'waste',
    checkTrigger: (data) => data.waste?.hasSegregationBins === false,
    checkComplete: (prev, current) => current.waste?.hasSegregationBins === true
  },
  green_commute: {
    id: 'green_commute',
    badgeId: 'green_commuter',
    title: 'Promote Walking & Cycling',
    description: 'Encourage classmates to walk or cycle instead of using motorized transport. Reduce motorbike/car commute by 50% next month.',
    icon: '🚲',
    category: 'commute',
    checkTrigger: (data) => data.commute?.co2 > 5,
    checkComplete: (prev, current) =>
      prev && current.commute?.co2 < prev.commute?.co2 * 0.5
  }
};

const GoalEngine = {

  getSuggestedGoals(grade, submissionData) {
    const active = StorageManager.getGoals(grade).map(g => g.id);
    const earned = StorageManager.getBadges(grade).map(b => b.id);
    const suggested = [];

    for (const [key, tmpl] of Object.entries(GOAL_TEMPLATES)) {
      if (active.includes(tmpl.id)) continue;
      if (earned.includes(tmpl.badgeId)) continue;
      if (tmpl.checkTrigger(submissionData)) {
        suggested.push({ ...tmpl });
      }
    }
    return suggested;
  },

  suggestGoalsFromSubmission(grade, submissionData) {
    const suggestions = this.getSuggestedGoals(grade, submissionData);
    if (suggestions.length > 0) {
      const existing = StorageManager.getGoals(grade);
      const newGoals = suggestions.filter(s => !existing.find(e => e.id === s.id))
        .map(s => ({
          id: s.id,
          title: s.title,
          description: s.description,
          icon: s.icon,
          category: s.category,
          badgeId: s.badgeId,
          status: 'suggested',
          suggestedAt: new Date().toISOString(),
          startedAt: null,
          completedAt: null
        }));
      if (newGoals.length > 0) {
        StorageManager.saveGoals(grade, [...existing, ...newGoals]);
      }
    }
  },

  commitToGoal(grade, goalId) {
    const goals = StorageManager.getGoals(grade);
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      goal.status = 'active';
      goal.startedAt = new Date().toISOString();
      StorageManager.saveGoals(grade, goals);
    }
  },

  checkAndAwardBadges(grade, newData) {
    const history = StorageManager.getHistory().filter(h => h.grade === grade);
    const prevData = history.length >= 2 ? history[history.length - 2].data : null;
    const goals = StorageManager.getGoals(grade);
    const newBadges = [];

    goals.filter(g => g.status === 'active').forEach(goal => {
      const tmpl = GOAL_TEMPLATES[goal.id];
      if (!tmpl) return;
      if (tmpl.checkComplete(prevData, newData)) {
        goal.status = 'completed';
        goal.completedAt = new Date().toISOString();
        const badge = BADGE_DEFINITIONS[goal.badgeId];
        if (badge) {
          const awarded = StorageManager.awardBadge(grade, badge);
          if (awarded) newBadges.push(badge);
        }
      }
    });

    if (goals.some(g => g.status === 'completed')) {
      StorageManager.saveGoals(grade, goals);
    }

    return newBadges;
  },

  getActiveGoals(grade) {
    return StorageManager.getGoals(grade).filter(g => g.status === 'active');
  },

  getSuggestedGoalsList(grade) {
    return StorageManager.getGoals(grade).filter(g => g.status === 'suggested');
  },

  getCompletedGoals(grade) {
    return StorageManager.getGoals(grade).filter(g => g.status === 'completed');
  },

  getAllBadges() {
    return BADGE_DEFINITIONS;
  }
};
