// SAMS™ Real-Time Analytics Engine
// Advanced streaming analytics for municipal audit management
// Inspired by the SAMS™ Technical Blueprint vision

import { 
  formatCurrency, 
  formatPercentageChange,
  calculateEurekaRiskScore,
  detectMultivariateAnomalies 
} from '../utils/helpers';

class RealTimeAnalytics {
  constructor() {
    this.subscribers = new Map();
    this.analyticsCache = new Map();
    this.streamingData = new Map();
    this.updateInterval = null;
    this.isStreaming = false;
    this.metricsHistory = [];
  }

  /**
   * Start real-time analytics streaming
   * @param {number} interval Update interval in milliseconds (default: 5000)
   */
  startStreaming(interval = 5000) {
    if (this.isStreaming) return;
    
    this.isStreaming = true;
    this.updateInterval = setInterval(() => {
      this._generateRealTimeMetrics();
      this._notifySubscribers();
    }, interval);
    
    console.log(`🔄 SAMS™ Real-Time Analytics started (${interval}ms interval)`);
  }

  /**
   * Stop real-time analytics streaming
   */
  stopStreaming() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    this.isStreaming = false;
    console.log('⏹️ SAMS™ Real-Time Analytics stopped');
  }

  /**
   * Subscribe to real-time analytics updates
   * @param {string} id Subscriber ID
   * @param {function} callback Callback function to receive updates
   */
  subscribe(id, callback) {
    this.subscribers.set(id, callback);
    
    // Send initial data if available
    if (this.analyticsCache.size > 0) {
      callback(this._getCurrentAnalytics());
    }
  }

  /**
   * Unsubscribe from real-time analytics updates
   * @param {string} id Subscriber ID
   */
  unsubscribe(id) {
    this.subscribers.delete(id);
  }

  /**
   * Get current real-time analytics snapshot
   * @returns {Object} Current analytics data
   */
  getCurrentSnapshot() {
    return this._getCurrentAnalytics();
  }

  /**
   * Generate real-time metrics with simulated municipal data
   * @private
   */
  _generateRealTimeMetrics() {
    const timestamp = new Date().toISOString();
    
    // Simulate real-time municipal financial data
    const baseMetrics = this._getBaseMetrics();
    const transactionFlow = this._simulateTransactionFlow();
    const complianceStatus = this._simulateComplianceStatus();
    const budgetMetrics = this._simulateBudgetMetrics();
    const riskMetrics = this._simulateRiskMetrics();
    
    const realTimeData = {
      timestamp,
      transactionFlow,
      complianceStatus,
      budgetMetrics,
      riskMetrics,
      systemHealth: this._calculateSystemHealth(),
      alerts: this._generateRealTimeAlerts(),
      insights: this._generateRealTimeInsights(baseMetrics),
      performance: {
        processingSpeed: Math.round(50 + Math.random() * 50), // ms
        dataAccuracy: Math.round(95 + Math.random() * 5), // %
        systemLoad: Math.round(20 + Math.random() * 30) // %
      }
    };
    
    // Cache the data
    this.analyticsCache.set('current', realTimeData);
    this.metricsHistory.push(realTimeData);
    
    // Keep only last 100 records
    if (this.metricsHistory.length > 100) {
      this.metricsHistory.shift();
    }
  }

  /**
   * Get base metrics for calculations
   * @private
   */
  _getBaseMetrics() {
    return {
      totalBudget: 150000000, // R150M
      departments: 8,
      activeUsers: 25,
      monthlyTransactions: 1500
    };
  }

  /**
   * Simulate real-time transaction flow
   * @private
   */
  _simulateTransactionFlow() {
    const now = new Date();
    const hour = now.getHours();
    
    // Simulate business hours activity
    let baseActivity = 10;
    if (hour >= 8 && hour <= 17) {
      baseActivity = 80 + Math.random() * 40;
    } else if (hour >= 18 && hour <= 22) {
      baseActivity = 30 + Math.random() * 20;
    }
    
    return {
      currentRate: Math.round(baseActivity),
      todayTotal: Math.round(450 + Math.random() * 200),
      averageValue: Math.round(45000 + Math.random() * 30000),
      peakHour: '14:00',
      trend: Math.random() > 0.5 ? 'increasing' : 'stable'
    };
  }

  /**
   * Simulate compliance status metrics
   * @private
   */
  _simulateComplianceStatus() {
    const complianceScore = 85 + Math.random() * 10;
    const violations = Math.floor(Math.random() * 3);
    const warnings = Math.floor(Math.random() * 8);
    
    return {
      overallScore: Math.round(complianceScore),
      status: complianceScore > 90 ? 'Excellent' : complianceScore > 80 ? 'Good' : 'Needs Attention',
      violations,
      warnings,
      resolved: Math.floor(Math.random() * 15) + 20,
      trend: complianceScore > 87 ? 'improving' : 'stable'
    };
  }

  /**
   * Simulate budget metrics
   * @private
   */
  _simulateBudgetMetrics() {
    const utilizationRate = 65 + Math.random() * 25;
    const remaining = 150000000 * (1 - utilizationRate / 100);
    
    return {
      utilizationRate: Math.round(utilizationRate * 10) / 10,
      totalSpent: Math.round(150000000 * utilizationRate / 100),
      remaining: Math.round(remaining),
      burnRate: Math.round(850000 + Math.random() * 200000),
      projectedOverrun: Math.random() > 0.7 ? Math.round(Math.random() * 5000000) : 0,
      departmentAlerts: Math.floor(Math.random() * 3)
    };
  }

  /**
   * Simulate risk metrics using EUREKA algorithm
   * @private
   */
  _simulateRiskMetrics() {
    const riskData = {
      complianceRating: 85 + Math.random() * 10,
      budgetVariance: Math.random() * 15,
      auditFindings: Math.floor(Math.random() * 5),
      spendingVolatility: Math.random() * 20,
      documentCompliance: 90 + Math.random() * 10,
      historicalPerformance: 80 + Math.random() * 15
    };
    
    const riskScore = calculateEurekaRiskScore(riskData);
    
    return {
      overallRisk: riskScore.score,
      category: riskScore.category,
      highRiskDepartments: Math.floor(Math.random() * 2),
      criticalAlerts: Math.floor(Math.random() * 2),
      trend: Math.random() > 0.6 ? 'decreasing' : 'stable'
    };
  }

  /**
   * Calculate system health metrics
   * @private
   */
  _calculateSystemHealth() {
    const uptime = 99.5 + Math.random() * 0.5;
    const responseTime = Math.round(120 + Math.random() * 80);
    const errorRate = Math.random() * 0.5;
    
    return {
      uptime: Math.round(uptime * 100) / 100,
      responseTime,
      errorRate: Math.round(errorRate * 100) / 100,
      status: uptime > 99 && responseTime < 200 && errorRate < 0.3 ? 'Optimal' : 'Good',
      lastUpdate: new Date().toISOString()
    };
  }

  /**
   * Generate real-time alerts
   * @private
   */
  _generateRealTimeAlerts() {
    const alertTypes = [
      'Budget threshold exceeded',
      'Compliance violation detected',
      'Unusual spending pattern',
      'System performance alert',
      'Document approval required'
    ];
    
    const alerts = [];
    const alertCount = Math.floor(Math.random() * 3);
    
    for (let i = 0; i < alertCount; i++) {
      alerts.push({
        id: `alert-${Date.now()}-${i}`,
        type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
        severity: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
        timestamp: new Date().toISOString(),
        department: `Department ${Math.floor(Math.random() * 8) + 1}`
      });
    }
    
    return alerts;
  }

  /**
   * Generate real-time insights
   * @private
   */
  _generateRealTimeInsights(baseMetrics) {
    const insights = [];
    
    // Budget insight
    const budgetUtilization = 65 + Math.random() * 25;
    if (budgetUtilization > 85) {
      insights.push({
        type: 'budget',
        message: `Budget utilization at ${budgetUtilization.toFixed(1)}% - monitor closely`,
        priority: budgetUtilization > 90 ? 'high' : 'medium'
      });
    }
    
    // Transaction insight
    const transactionVolume = Math.random();
    if (transactionVolume > 0.8) {
      insights.push({
        type: 'transaction',
        message: 'High transaction volume detected - system performing well',
        priority: 'info'
      });
    }
    
    // Compliance insight
    if (Math.random() > 0.7) {
      insights.push({
        type: 'compliance',
        message: 'Compliance scores trending upward across departments',
        priority: 'positive'
      });
    }
    
    return insights;
  }

  /**
   * Get current analytics data
   * @private
   */
  _getCurrentAnalytics() {
    return this.analyticsCache.get('current') || null;
  }

  /**
   * Notify all subscribers of new data
   * @private
   */
  _notifySubscribers() {
    const currentData = this._getCurrentAnalytics();
    if (currentData) {
      this.subscribers.forEach((callback, id) => {
        try {
          callback(currentData);
        } catch (error) {
          console.error(`Error notifying subscriber ${id}:`, error);
        }
      });
    }
  }

  /**
   * Get historical metrics for trend analysis
   * @param {number} limit Number of records to return
   * @returns {Array} Historical metrics
   */
  getHistoricalMetrics(limit = 20) {
    return this.metricsHistory.slice(-limit);
  }

  /**
   * Get analytics summary for dashboard
   * @returns {Object} Summary analytics
   */
  getSummaryAnalytics() {
    const current = this._getCurrentAnalytics();
    if (!current) return null;

    return {
      summary: {
        totalTransactions: current.transactionFlow.todayTotal,
        budgetUtilization: current.budgetMetrics.utilizationRate,
        complianceScore: current.complianceStatus.overallScore,
        riskLevel: current.riskMetrics.category,
        systemHealth: current.systemHealth.status
      },
      trends: {
        transactions: current.transactionFlow.trend,
        compliance: current.complianceStatus.trend,
        risk: current.riskMetrics.trend
      },
      alerts: current.alerts.length,
      insights: current.insights.length
    };
  }
}

// Export singleton instance
export const realTimeAnalytics = new RealTimeAnalytics();
export default realTimeAnalytics;
