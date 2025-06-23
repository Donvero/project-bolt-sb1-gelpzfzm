// SAMS™ Budget Intelligence Service
// Advanced analytics and forecasting for municipal budget management
// Based on the SAMS™ Technical Blueprint

import { 
  forecastBudgetARIMA, 
  calculateEurekaRiskScore, 
  detectMultivariateAnomalies,
  evaluateComplianceRisk,
  analyzeBudgetBurnRate,
  generateDynamicThresholds,
  verifyDataIntegrity,
  parseComplianceRequirement
} from '../utils/helpers';

class BudgetIntelligenceService {
  constructor() {
    this.historicalData = {};
    this.forecastCache = {};
    this.riskScoreCache = {};
    this.latestTransactionHash = '';
  }

  // Generate comprehensive budget forecasts using advanced time series analysis
  async generateBudgetForecast(budgetId, historicalData, periods = 3) {
    // Store historical data for this budget
    this.historicalData[budgetId] = historicalData;
    
    // Generate ARIMA-inspired forecast
    const forecast = forecastBudgetARIMA(historicalData, periods);
    
    // Cache the forecast result
    this.forecastCache[budgetId] = {
      timestamp: new Date(),
      forecast,
      periods
    };
    
    return forecast;
  }

  // Calculate comprehensive risk score for a department's budget
  calculateDepartmentRiskScore(departmentId, indicators) {
    const riskScore = calculateEurekaRiskScore(indicators);
    
    // Cache risk score
    this.riskScoreCache[departmentId] = {
      timestamp: new Date(),
      score: riskScore
    };
    
    return riskScore;
  }

  // Detect anomalies in multidimensional budget data
  detectBudgetAnomalies(transactions, dimensions, threshold = 3.0) {
    // Extract relevant dimensions from transactions
    const dataPoints = transactions.map(t => {
      const point = {};
      dimensions.forEach(dim => {
        if (t[dim] !== undefined) {
          point[dim] = t[dim];
        }
      });
      return point;
    });
    
    return detectMultivariateAnomalies(dataPoints, threshold);
  }

  // Evaluate transaction compliance against regulatory frameworks
  evaluateTransactionCompliance(transaction, framework = 'MFMA') {
    return evaluateComplianceRisk(transaction, framework);
  }

  // Analyze budget spending velocity and project depletion
  analyzeBudgetVelocity(budget, transactions) {
    return analyzeBudgetBurnRate(budget, transactions);
  }

  // Generate adaptive compliance thresholds based on historical patterns
  generateAdaptiveThresholds(metricName, historicalData, baseThreshold) {
    return generateDynamicThresholds(historicalData, baseThreshold);
  }

  // Verify transaction integrity using blockchain-inspired approach
  verifyTransactionIntegrity(transactions) {
    const result = verifyDataIntegrity(transactions, this.latestTransactionHash);
    
    // Update latest hash for future verifications
    if (result.latestHash) {
      this.latestTransactionHash = result.latestHash;
    }
    
    return result;
  }

  // Parse and structure compliance requirements
  parseComplianceText(requirementText) {
    return parseComplianceRequirement(requirementText);
  }

  // Generate executive summary of budget health
  generateBudgetHealthSummary(budget, transactions, departments) {
    // Analyze overall burn rate
    const burnRateAnalysis = this.analyzeBudgetVelocity(budget, transactions);
    
    // Identify departments with highest risk scores
    const departmentRisks = departments.map(dept => ({
      department: dept.name,
      riskScore: this.riskScoreCache[dept.id]?.score || 0
    })).sort((a, b) => b.riskScore - a.riskScore);
    
    // Identify anomalies
    const anomalyDetection = this.detectBudgetAnomalies(
      transactions, 
      ['amount', 'timeSinceLastTransaction', 'cumulativeTotal']
    );
    
    // Calculate overall health score (0-100)
    const healthFactors = {
      burnRate: burnRateAnalysis.burnRatePercentPerMonth <= 33 ? 100 : 
                burnRateAnalysis.burnRatePercentPerMonth <= 50 ? 70 : 30,
      
      depletion: burnRateAnalysis.daysUntilDepletion === null ? 100 :
                burnRateAnalysis.daysUntilDepletion >= 90 ? 100 :
                burnRateAnalysis.daysUntilDepletion >= 30 ? 70 : 30,
      
      anomalies: anomalyDetection.anomalies.length === 0 ? 100 :
                anomalyDetection.anomalies.length <= 2 ? 70 : 30,
      
      departmentRisk: departmentRisks[0]?.riskScore <= 30 ? 100 :
                    departmentRisks[0]?.riskScore <= 60 ? 70 : 30
    };
    
    const overallHealth = Object.values(healthFactors).reduce((sum, score) => sum + score, 0) / 
                        Object.values(healthFactors).length;
    
    // Generate key insights
    const insights = [];
    
    if (burnRateAnalysis.burnRatePercentPerMonth > 33) {
      insights.push(`Monthly burn rate of ${burnRateAnalysis.burnRatePercentPerMonth.toFixed(1)}% exceeds recommended 33%`);
    }
    
    if (burnRateAnalysis.daysUntilDepletion !== null && burnRateAnalysis.daysUntilDepletion < 90) {
      insights.push(`Budget will be depleted in ${burnRateAnalysis.daysUntilDepletion} days at current spending rate`);
    }
    
    if (anomalyDetection.anomalies.length > 0) {
      insights.push(`${anomalyDetection.anomalies.length} spending anomalies detected requiring investigation`);
    }
    
    if (departmentRisks[0]?.riskScore > 50) {
      insights.push(`${departmentRisks[0].department} department shows elevated risk score of ${departmentRisks[0].riskScore.toFixed(1)}`);
    }
    
    // Determine overall status
    let status;
    if (overallHealth >= 85) status = 'Healthy';
    else if (overallHealth >= 70) status = 'Stable';
    else if (overallHealth >= 50) status = 'Caution';
    else status = 'Critical';
    
    return {
      overallHealth: Math.round(overallHealth),
      status,
      burnRate: {
        monthly: burnRateAnalysis.burnRatePerMonth,
        percentOfBudget: burnRateAnalysis.burnRatePercentPerMonth,
        acceleration: burnRateAnalysis.acceleration
      },
      projectedDepletion: burnRateAnalysis.depletionDate,
      daysRemaining: burnRateAnalysis.daysUntilDepletion,
      anomalyCount: anomalyDetection.anomalies.length,
      highRiskDepartments: departmentRisks.slice(0, 3),
      keyInsights: insights,
      recommendedActions: burnRateAnalysis.recommendations
    };
  }
  
  // Generate budget optimization recommendations
  generateOptimizationRecommendations(budget, transactions, departments) {
    const insights = [];
    const opportunities = [];
    
    // Analyze spending patterns by category
    const categoriesMap = {};
    transactions.forEach(t => {
      if (!categoriesMap[t.category]) {
        categoriesMap[t.category] = {
          total: 0,
          count: 0,
          transactions: []
        };
      }
      
      categoriesMap[t.category].total += t.amount;
      categoriesMap[t.category].count += 1;
      categoriesMap[t.category].transactions.push(t);
    });
    
    // Convert to array and calculate percentages
    const categories = Object.entries(categoriesMap).map(([name, data]) => ({
      name,
      total: data.total,
      count: data.count,
      averageTransaction: data.total / data.count,
      percentOfBudget: (data.total / budget.allocated) * 100,
      transactions: data.transactions
    })).sort((a, b) => b.total - a.total);
    
    // Find categories with highest spending
    const highSpendCategories = categories
      .filter(c => c.percentOfBudget > 15)
      .slice(0, 3);
    
    if (highSpendCategories.length > 0) {
      insights.push({
        type: 'highSpendCategories',
        title: 'High Spend Categories',
        description: `${highSpendCategories.length} categories represent ${
          highSpendCategories.reduce((sum, c) => sum + c.percentOfBudget, 0).toFixed(1)
        }% of total budget`,
        items: highSpendCategories
      });
      
      // Generate optimization opportunities for high-spend categories
      highSpendCategories.forEach(category => {
        opportunities.push({
          title: `Optimize ${category.name} Spending`,
          potentialSavings: category.total * 0.1, // Assume 10% potential savings
          difficulty: 'Medium',
          description: `Review ${category.name} expenditures for potential consolidation or renegotiation`
        });
      });
    }
    
    // Identify potential duplicate payments
    const potentialDuplicates = [];
    for (let i = 0; i < transactions.length; i++) {
      for (let j = i + 1; j < transactions.length; j++) {
        const t1 = transactions[i];
        const t2 = transactions[j];
        
        // Check for similar amount, payee, and close dates
        if (
          Math.abs(t1.amount - t2.amount) < 1 && // Exact or very close amount
          t1.payee === t2.payee && // Same payee
          Math.abs(new Date(t1.date) - new Date(t2.date)) < 7 * 24 * 60 * 60 * 1000 // Within 7 days
        ) {
          potentialDuplicates.push({ t1, t2 });
        }
      }
    }
    
    if (potentialDuplicates.length > 0) {
      insights.push({
        type: 'potentialDuplicates',
        title: 'Potential Duplicate Payments',
        description: `${potentialDuplicates.length} potentially duplicate payments identified`,
        items: potentialDuplicates
      });
      
      opportunities.push({
        title: 'Review Duplicate Payments',
        potentialSavings: potentialDuplicates.reduce((sum, pair) => sum + pair.t2.amount, 0),
        difficulty: 'Low',
        description: 'Review and recover potentially duplicate payments'
      });
    }
    
    // Identify spending anomalies
    const anomalies = this.detectBudgetAnomalies(
      transactions, 
      ['amount', 'timeSinceLastTransaction']
    ).anomalies;
    
    if (anomalies.length > 0) {
      insights.push({
        type: 'spendingAnomalies',
        title: 'Spending Anomalies',
        description: `${anomalies.length} unusual spending patterns detected`,
        items: anomalies
      });
      
      opportunities.push({
        title: 'Investigate Spending Anomalies',
        potentialSavings: anomalies.reduce((sum, a) => sum + a.point.amount, 0) * 0.5, // Assume 50% recoverable
        difficulty: 'Medium',
        description: 'Investigate unusual spending patterns for potential irregularities'
      });
    }
    
    // Identify seasonal patterns
    // More sophisticated implementation would use time series analysis
    
    return {
      insights,
      opportunities: opportunities.sort((a, b) => b.potentialSavings - a.potentialSavings),
      totalPotentialSavings: opportunities.reduce((sum, o) => sum + o.potentialSavings, 0),
      categories
    };
  }
}

export const budgetIntelligenceService = new BudgetIntelligenceService();
export default budgetIntelligenceService;
