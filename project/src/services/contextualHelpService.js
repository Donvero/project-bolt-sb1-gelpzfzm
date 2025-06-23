// Contextual Help Service for SAMS™ Platform
// Provides context-sensitive help and guidance to users

class ContextualHelpService {
  constructor() {
    this.helpTopics = new Map();
    this.userContext = {};
    this.currentRoute = '';
    this.recentActions = [];
    this.maxRecentActions = 10;
    this.initialized = false;
  }

  // Initialize the help system with default topics
  initialize() {
    // Load default help topics
    this.registerDefaultHelpTopics();
    
    // Set up route listener
    this.setupRouteListener();
    
    // Set up user action tracking
    this.setupActionTracking();
    
    this.initialized = true;
    return true;
  }

  // Set up route change listener to update context
  setupRouteListener() {
    if (typeof window !== 'undefined') {
      const pushState = history.pushState;
      history.pushState = (...args) => {
        pushState.apply(history, args);
        this.handleRouteChange(window.location.pathname);
      };

      window.addEventListener('popstate', () => {
        this.handleRouteChange(window.location.pathname);
      });

      // Set initial route
      this.handleRouteChange(window.location.pathname);
    }
  }

  // Handle route changes
  handleRouteChange(path) {
    this.currentRoute = path;
    console.log('Context help: route changed to', path);
    // Trigger any route-specific help
    this.checkForContextualHelp();
  }

  // Set up tracking for user actions
  setupActionTracking() {
    if (typeof window !== 'undefined') {
      // Track clicks on important elements
      document.addEventListener('click', (event) => {
        const element = event.target.closest('[data-action]');
        if (element) {
          const action = element.getAttribute('data-action');
          this.trackUserAction({
            type: 'click',
            action,
            element: element.tagName,
            timestamp: new Date()
          });
        }
      });

      // Track form submissions
      document.addEventListener('submit', (event) => {
        if (event.target.id) {
          this.trackUserAction({
            type: 'form_submit',
            formId: event.target.id,
            timestamp: new Date()
          });
        }
      });
    }
  }

  // Track a user action for context
  trackUserAction(action) {
    this.recentActions.unshift(action);
    
    // Keep only the most recent actions
    if (this.recentActions.length > this.maxRecentActions) {
      this.recentActions.pop();
    }
    
    // Check if this action should trigger contextual help
    this.checkForContextualHelp();
  }

  // Register a new help topic
  registerHelpTopic(topicId, options) {
    if (!topicId || !options.title) {
      console.error('Invalid help topic registration');
      return false;
    }

    this.helpTopics.set(topicId, {
      id: topicId,
      title: options.title,
      content: options.content || '',
      route: options.route || null,
      element: options.element || null,
      action: options.action || null,
      category: options.category || 'general',
      priority: options.priority || 1,
      links: options.links || [],
      videos: options.videos || []
    });

    return true;
  }

  // Get help for the current context
  getContextualHelp() {
    const currentRoute = this.currentRoute;
    const recentActions = this.recentActions;
    
    // Find relevant help topics based on current context
    const relevantTopics = Array.from(this.helpTopics.values())
      .filter(topic => {
        // Match by route
        if (topic.route) {
          if (typeof topic.route === 'string') {
            if (currentRoute === topic.route) return true;
          } else if (topic.route instanceof RegExp) {
            if (topic.route.test(currentRoute)) return true;
          }
        }
        
        // Match by recent actions
        if (topic.action && recentActions.length > 0) {
          if (recentActions.some(action => action.action === topic.action)) {
            return true;
          }
        }
        
        return false;
      })
      .sort((a, b) => b.priority - a.priority);
    
    return relevantTopics;
  }

  // Get a specific help topic by ID
  getHelpTopic(topicId) {
    return this.helpTopics.get(topicId);
  }

  // Get all help topics for a specific category
  getHelpTopicsByCategory(category) {
    return Array.from(this.helpTopics.values())
      .filter(topic => topic.category === category)
      .sort((a, b) => b.priority - a.priority);
  }

  // Search for help topics
  searchHelpTopics(query) {
    if (!query) return [];
    
    const searchTerms = query.toLowerCase().split(' ');
    
    return Array.from(this.helpTopics.values())
      .filter(topic => {
        const topicText = `${topic.title} ${topic.content}`.toLowerCase();
        return searchTerms.some(term => topicText.includes(term));
      })
      .sort((a, b) => {
        // Sort by relevance (number of matching terms)
        const aMatches = searchTerms.filter(term => 
          `${a.title} ${a.content}`.toLowerCase().includes(term)
        ).length;
        
        const bMatches = searchTerms.filter(term => 
          `${b.title} ${b.content}`.toLowerCase().includes(term)
        ).length;
        
        return bMatches - aMatches;
      });
  }

  // Update user context with additional information
  updateUserContext(context) {
    this.userContext = {
      ...this.userContext,
      ...context
    };
    
    // Check if the context change should trigger help
    this.checkForContextualHelp();
    
    return this.userContext;
  }

  // Check if contextual help should be shown based on current context
  checkForContextualHelp() {
    const relevantTopics = this.getContextualHelp();
    
    if (relevantTopics.length > 0) {
      // In a real implementation, this could show a help indicator
      // or trigger a help popup
      console.log('Contextual help available:', relevantTopics[0].title);
      
      // Dispatch event for components to react to
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('contextual-help-available', {
          detail: { topics: relevantTopics }
        }));
      }
      
      return relevantTopics[0];
    }
    
    return null;
  }

  // Register default help topics for the application
  registerDefaultHelpTopics() {
    // Dashboard help
    this.registerHelpTopic('dashboard-overview', {
      title: 'Dashboard Overview',
      content: 'The dashboard provides an overview of key municipal financial metrics and alerts. Use the charts to monitor budget performance and compliance status at a glance.',
      route: '/dashboard',
      category: 'navigation',
      priority: 5
    });

    // Budget management help
    this.registerHelpTopic('budget-creation', {
      title: 'Creating a New Budget',
      content: 'To create a new budget, use the "Add Budget" button and fill in the required details including department, amount, and period. Budget periods should align with municipal fiscal planning.',
      route: '/budget',
      action: 'create_budget',
      category: 'budget',
      priority: 4
    });

    this.registerHelpTopic('budget-forecasting', {
      title: 'Understanding Budget Forecasts',
      content: 'Budget forecasts use historical spending patterns to predict future expenditures. The AI-powered forecasting engine analyzes past trends and seasonality to provide accurate projections.',
      route: '/budget',
      element: '.forecast-chart',
      category: 'budget',
      priority: 3
    });

    // Compliance help
    this.registerHelpTopic('compliance-rules', {
      title: 'Compliance Rules Explained',
      content: 'Compliance rules are based on the Municipal Finance Management Act (MFMA) and Public Finance Management Act (PFMA). Red indicators show critical violations, while yellow shows warnings.',
      route: '/compliance',
      category: 'compliance',
      priority: 5
    });

    // Workflow help
    this.registerHelpTopic('workflow-approvals', {
      title: 'Managing Approval Workflows',
      content: 'The approval queue shows pending items requiring your attention. You can approve, reject, or request more information for each item. Items are sorted by priority and deadline.',
      route: '/workflow-intelligence',
      category: 'workflow',
      priority: 4
    });

    // Reports help
    this.registerHelpTopic('report-generation', {
      title: 'Generating Custom Reports',
      content: 'Use the custom report builder to create tailored reports. Drag and drop the components you need, select data sources, and customize the layout before generating the final report.',
      route: '/reports',
      category: 'reporting',
      priority: 3
    });

    // Mobile features help
    this.registerHelpTopic('mobile-features', {
      title: 'Mobile-Optimized Features',
      content: 'The mobile interface automatically adapts to your device. Use the touch optimization toggle to increase touch target sizes for easier interaction on mobile devices.',
      route: '/mobile-ux',
      category: 'mobile',
      priority: 4
    });

    // AI Intelligence help
    this.registerHelpTopic('ai-insights', {
      title: 'Understanding AI Insights',
      content: 'AI insights analyze your municipal data to identify patterns, risks, and opportunities. The confidence score indicates the reliability of each insight based on available data.',
      route: '/intelligence',
      category: 'ai',
      priority: 5
    });

    // Settings help
    this.registerHelpTopic('user-preferences', {
      title: 'Customizing User Preferences',
      content: 'User preferences allow you to personalize your SAMS experience. Changes to theme, font size, and layout are saved automatically and will persist across sessions and devices.',
      route: '/settings',
      category: 'settings',
      priority: 3
    });

    // First-time user guide
    this.registerHelpTopic('getting-started', {
      title: 'Getting Started with SAMS',
      content: 'Welcome to SAMS! This platform helps municipal finance teams manage budgets, ensure compliance, and streamline workflows. Start by exploring the dashboard, then set up your first budget.',
      category: 'onboarding',
      priority: 10
    });
  }

  // Get a context-aware "quick tip" for the current page
  getQuickTip() {
    const relevantTopics = this.getContextualHelp();
    if (relevantTopics.length === 0) return null;
    
    // Get a random tip from the top 3 most relevant topics
    const topTopics = relevantTopics.slice(0, Math.min(3, relevantTopics.length));
    const randomTopic = topTopics[Math.floor(Math.random() * topTopics.length)];
    
    return {
      title: 'Quick Tip',
      content: randomTopic.content.split('.')[0] + '.',
      sourceTopicId: randomTopic.id
    };
  }

  // Get all available help categories
  getHelpCategories() {
    const categories = new Set();
    this.helpTopics.forEach(topic => categories.add(topic.category));
    return Array.from(categories);
  }

  // Record that a help topic was viewed (for analytics)
  recordTopicViewed(topicId) {
    const topic = this.helpTopics.get(topicId);
    if (!topic) return false;
    
    // In a real implementation, this could update a viewCount or
    // last viewed timestamp, or send analytics data
    console.log(`Help topic viewed: ${topic.title}`);
    
    // Track this as a user action
    this.trackUserAction({
      type: 'help_viewed',
      topicId,
      timestamp: new Date()
    });
    
    return true;
  }
}

// Create and export singleton instance
export const contextualHelpService = new ContextualHelpService();
export default contextualHelpService;
