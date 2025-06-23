
import { BehaviorSubject } from 'rxjs';

// --- Mock Data ---
const mockUserPreferences = {
  userId: 'user-123',
  dashboard: {
    layout: [
      { i: 'stats', x: 0, y: 0, w: 12, h: 2 },
      { i: 'alerts', x: 0, y: 2, w: 6, h: 4 },
      { i: 'budget', x: 6, y: 2, w: 6, h: 4 },
    ],
    widgets: ['stats', 'alerts', 'budget', 'compliance'],
  },
  theme: 'dark',
};

// --- Service State ---
const preferences$ = new BehaviorSubject(mockUserPreferences);

// --- Service API ---
const userPreferenceService = {
  /**
   * Subscribes to user preferences.
   * @param {function} subscriber The callback to receive preference updates.
   * @returns {object} The subscription object.
   */
  subscribe: (subscriber) => {
    return preferences$.subscribe(subscriber);
  },

  /**
   * Updates the dashboard layout for the user.
   * @param {Array} layout The new dashboard layout.
   * @returns {Promise<void>}
   */
  updateDashboardLayout: async (layout) => {
    const currentPrefs = preferences$.getValue();
    const newPrefs = {
      ...currentPrefs,
      dashboard: {
        ...currentPrefs.dashboard,
        layout,
      },
    };
    preferences$.next(newPrefs);
    console.log('Dashboard layout updated:', layout);
  },

  /**
   * Updates the visible widgets on the dashboard.
   * @param {Array<string>} widgets The new list of widget IDs.
   * @returns {Promise<void>}
   */
  updateDashboardWidgets: async (widgets) => {
    const currentPrefs = preferences$.getValue();
    const newPrefs = {
      ...currentPrefs,
      dashboard: {
        ...currentPrefs.dashboard,
        widgets,
      },
    };
    preferences$.next(newPrefs);
    console.log('Dashboard widgets updated:', widgets);
  },

  /**
   * Gets the current user preferences.
   * @returns {object} The current preferences.
   */
  getPreferences: () => {
    return preferences$.getValue();
  },
};

export default userPreferenceService;
