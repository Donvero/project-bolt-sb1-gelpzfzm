// SAMS™ Budget Insights Generator
// AI-driven budget analysis and recommendations
// Based on the SAMS™ Technical Blueprint vision

import { 
  calculateEurekaRiskScore, 
  parseComplianceStatus, 
  detectMultivariateAnomalies,
  forecastARIMA,
  generateBudgetOptimizations,
  getQuarterFromDate,
  formatCurrency,
  formatPercentageChange
} from '../utils/helpers';

class BudgetInsights {
  constructor() {
    this.insightCache = new Map();
    this.cachedRulesets = new Map();
  }

  /**
   * Generate comprehensive budget insights with explanations and suggestions
   * @param {Object} budgetData Complete budget data
   * @returns {Object} Budget insights and recommendations
   */
  generateBudgetInsights(budgetData) {
    // Check if we have recent cached insights for this budget
    const cacheKey = `${budgetData.id}-${budgetData.lastUpdated}`;
    if (this.insightCache.has(cacheKey)) {
      return this.insightCache.get(cacheKey);
    }

    try {
      // EUREKA Executive Summary
      const executiveSummary = this._generateExecutiveSummary(budgetData);
      
      // Department Performance Analysis
      const departmentAnalysis = this._analyzeDepartmentPerformance(budgetData);
      
      // Compliance Risk Assessment
      const complianceAssessment = this._assessComplianceRisks(budgetData);
      
      // Spending Pattern Analysis
      const spendingPatterns = this._analyzeSpendingPatterns(budgetData);
      
      // Budget Timeline Analysis
      const timelineAnalysis = this._analyzeTimeline(budgetData);
      
      // Strategic Recommendations
      const recommendations = this._generateStrategicRecommendations(
        budgetData,
        departmentAnalysis,
        complianceAssessment,
        spendingPatterns
      );

      // Generate comprehensive set of insights
      const insights = {
        generatedAt: new Date().toISOString(),
        budgetId: budgetData.id,
        fiscalYear: budgetData.fiscalYear,
        executiveSummary,
        departmentAnalysis,
        complianceAssessment,
        spendingPatterns,
        timelineAnalysis,
        recommendations,
        metadata: {
          dataVersion: '1.0',
          insightEngine: 'SAMS™ EUREKA Budget Intelligence',
          confidenceScore: this._calculateConfidenceScore(budgetData)
        }
      };

      // Cache the insights
      this.insightCache.set(cacheKey, insights);
      
      // Prune cache if it gets too large
      if (this.insightCache.size > 100) {
        const oldestKey = this.insightCache.keys().next().value;
        this.insightCache.delete(oldestKey);
      }

      return insights;
    } catch (error) {
      console.error('Error generating budget insights:', error);
      return {
        error: 'Failed to generate budget insights',
        reason: error.message
      };
    }
  }

  /**
   * Generate executive summary with key metrics and strategic overview
   * @param {Object} budgetData Budget data
   * @returns {Object} Executive summary
   */
  _generateExecutiveSummary(budgetData) {
    const { 
      totalBudget, 
      totalSpent, 
      departments = [] 
    } = budgetData;

    // Calculate overall metrics
    const spentPercentage = (totalSpent / totalBudget) * 100;
    const remainingBudget = totalBudget - totalSpent;
    
    // Determine financial health status
    let financialHealth;
    if (spentPercentage > 95) financialHealth = 'Critical';
    else if (spentPercentage > 85) financialHealth = 'Concerning';
    else if (spentPercentage > 75) financialHealth = 'Caution';
    else if (spentPercentage < 40) financialHealth = 'Underspent';
    else financialHealth = 'Healthy';

    // Calculate department performance metrics
    const performingDepts = departments.filter(d => d.performanceScore >= 80).length;
    const strugglingDepts = departments.filter(d => d.performanceScore < 60).length;
    
    // Identify top performing department
    let topDepartment = null;
    if (departments.length > 0) {
      topDepartment = [...departments].sort((a, b) => 
        b.performanceScore - a.performanceScore
      )[0];
    }

    // Generate key narrative insights
    const narrativeInsights = [
      `Overall budget utilization is at ${spentPercentage.toFixed(1)}% with ${formatCurrency(remainingBudget)} remaining.`,
      `Financial health status is currently '${financialHealth}'.`
    ];

    if (performingDepts > 0) {
      narrativeInsights.push(
        `${performingDepts} of ${departments.length} departments are performing well above targets.`
      );
    }

    if (strugglingDepts > 0) {
      narrativeInsights.push(
        `${strugglingDepts} departments require attention and potential intervention.`
      );
    }

    if (topDepartment) {
      narrativeInsights.push(
        `${topDepartment.name} is the highest performing department at ${topDepartment.performanceScore}% efficiency.`
      );
    }

    return {
      overallStatus: financialHealth,
      budgetUtilization: {
        percentage: parseFloat(spentPercentage.toFixed(1)),
        allocated: totalBudget,
        spent: totalSpent,
        remaining: remainingBudget
      },
      departmentPerformance: {
        total: departments.length,
        performing: performingDepts,
        struggling: strugglingDepts,
        topPerformer: topDepartment ? {
          name: topDepartment.name,
          score: topDepartment.performanceScore
        } : null
      },
      narrativeInsights
    };
  }

  /**
   * Analyze department performance and efficiency
   * @param {Object} budgetData Budget data
   * @returns {Object} Department performance analysis
   */
  _analyzeDepartmentPerformance(budgetData) {
    const { departments = [] } = budgetData;
    
    if (departments.length === 0) {
      return {
        status: 'No department data available',
        departments: []
      };
    }

    // Analyze each department
    const departmentAnalysis = departments.map(dept => {
      // Calculate spending efficiency
      const spendingEfficiency = this._calculateSpendingEfficiency(
        dept.spent, 
        dept.annualBudget, 
        dept.performanceScore
      );

      // Analyze monthly trends if available
      let trends = null;
      if (dept.monthlyData && dept.monthlyData.length > 2) {
        const recentMonths = dept.monthlyData.slice(-3);
        
        const spendingTrend = this._calculateTrend(
          recentMonths.map(m => m.spent)
        );
        
        const efficiencyTrend = this._calculateTrend(
          recentMonths.map(m => m.spent / m.allocated * 100)
        );
        
        trends = {
          spending: spendingTrend,
          efficiency: efficiencyTrend
        };
      }

      return {
        department: dept.name,
        allocated: dept.annualBudget,
        spent: dept.spent,
        remaining: dept.annualBudget - dept.spent,
        utilizationRate: parseFloat(((dept.spent / dept.annualBudget) * 100).toFixed(1)),
        performanceScore: dept.performanceScore,
        spendingEfficiency,
        trends,
        status: this._getDepartmentStatus(dept)
      };
    });

    // Sort by performance score descending
    departmentAnalysis.sort((a, b) => b.performanceScore - a.performanceScore);

    // Identify performance clusters
    const highPerformers = departmentAnalysis.filter(d => d.performanceScore >= 80);
    const midPerformers = departmentAnalysis.filter(d => d.performanceScore >= 60 && d.performanceScore < 80);
    const lowPerformers = departmentAnalysis.filter(d => d.performanceScore < 60);

    return {
      departments: departmentAnalysis,
      performanceClusters: {
        high: highPerformers.length,
        mid: midPerformers.length,
        low: lowPerformers.length
      },
      averagePerformance: parseFloat(
        (departmentAnalysis.reduce((sum, d) => sum + d.performanceScore, 0) / 
        departmentAnalysis.length).toFixed(1)
      )
    };
  }

  /**
   * Assess compliance risks across the budget
   * @param {Object} budgetData Budget data
   * @returns {Object} Compliance risk assessment
   */
  _assessComplianceRisks(budgetData) {
    // In a real implementation, this would integrate with compliance rules
    // For now, we'll use a simplified approach
    
    const { departments = [] } = budgetData;
    
    // Generate compliance risk metrics for each department
    const departmentRisks = departments.map(dept => {
      // Calculate compliance risk score using EUREKA
      const riskIndicators = {
        complianceRating: dept.metrics?.compliance || 75 + Math.random() * 25,
        budgetVariance: Math.abs(((dept.spent / dept.annualBudget) - 0.75) * 100),
        auditFindings: Math.floor(Math.random() * 3), // Simulated
        spendingVolatility: this._calculateVolatility(dept.monthlyData?.map(m => m.spent) || []),
        documentCompliance: 85 + Math.random() * 15, // Simulated
        historicalPerformance: dept.performanceScore
      };
      
      const riskScore = calculateEurekaRiskScore(riskIndicators);
      
      // Generate key risk factors
      const keyRiskFactors = Object.entries(riskScore.components)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([key, value]) => ({
          factor: key,
          contribution: value,
          percentage: parseFloat(((value / riskScore.score) * 100).toFixed(1))
        }));
      
      return {
        department: dept.name,
        riskScore: riskScore.score,
        riskCategory: riskScore.category,
        keyRiskFactors,
        recommendations: this._generateComplianceRecommendations(riskScore)
      };
    });
    
    // Sort by risk score descending
    departmentRisks.sort((a, b) => b.riskScore - a.riskScore);
    
    // Calculate overall compliance risk
    const overallRiskScore = parseFloat(
      (departmentRisks.reduce((sum, d) => sum + d.riskScore, 0) / 
      departmentRisks.length).toFixed(1)
    );
    
    let overallRiskCategory;
    if (overallRiskScore < 20) overallRiskCategory = 'Low';
    else if (overallRiskScore < 40) overallRiskCategory = 'Moderate';
    else if (overallRiskScore < 60) overallRiskCategory = 'Elevated';
    else if (overallRiskScore < 80) overallRiskCategory = 'High';
    else overallRiskCategory = 'Critical';
    
    return {
      overall: {
        riskScore: overallRiskScore,
        riskCategory: overallRiskCategory
      },
      departmentRisks,
      highRiskCount: departmentRisks.filter(d => d.riskScore >= 60).length
    };
  }

  /**
   * Analyze spending patterns across the budget
   * @param {Object} budgetData Budget data
   * @returns {Object} Spending pattern analysis
   */
  _analyzeSpendingPatterns(budgetData) {
    const { departments = [] } = budgetData;
    
    // Extract monthly data across all departments
    const allMonthlyData = [];
    departments.forEach(dept => {
      if (dept.monthlyData && dept.monthlyData.length > 0) {
        dept.monthlyData.forEach(month => {
          allMonthlyData.push({
            date: month.date,
            department: dept.name,
            allocated: month.allocated,
            spent: month.spent,
            transactions: month.transactions
          });
        });
      }
    });
    
    // Sort by date
    allMonthlyData.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Group by month
    const monthlyAggregates = {};
    allMonthlyData.forEach(month => {
      const monthYear = month.date.substring(0, 7); // YYYY-MM format
      if (!monthlyAggregates[monthYear]) {
        monthlyAggregates[monthYear] = {
          date: monthYear,
          allocated: 0,
          spent: 0,
          transactions: 0
        };
      }
      
      monthlyAggregates[monthYear].allocated += month.allocated;
      monthlyAggregates[monthYear].spent += month.spent;
      monthlyAggregates[monthYear].transactions += month.transactions;
    });
    
    // Convert to array and calculate percentages
    const monthlyTrends = Object.values(monthlyAggregates).map(month => ({
      ...month,
      utilizationRate: parseFloat(((month.spent / month.allocated) * 100).toFixed(1)),
      averageTransaction: parseFloat((month.spent / month.transactions).toFixed(2))
    }));
    
    // Detect spending anomalies
    let anomalies = [];
    if (monthlyTrends.length > 3) {
      const dataPoints = monthlyTrends.map(m => ({
        spent: m.spent,
        allocated: m.allocated,
        transactions: m.transactions,
        utilizationRate: m.utilizationRate,
        averageTransaction: m.averageTransaction
      }));
      
      const anomalyResults = detectMultivariateAnomalies(dataPoints, 2.5);
      
      // Format anomalies
      anomalies = anomalyResults.anomalies.map(a => ({
        date: monthlyTrends[a.index].date,
        score: parseFloat(a.score.toFixed(2)),
        metrics: {
          spent: monthlyTrends[a.index].spent,
          allocated: monthlyTrends[a.index].allocated,
          utilizationRate: monthlyTrends[a.index].utilizationRate
        },
        significance: a.score > 3 ? 'High' : 'Medium'
      }));
    }
    
    // Generate forecasts if enough data
    let forecast = null;
    if (monthlyTrends.length >= 6) {
      const timeSeriesData = monthlyTrends.map(m => ({
        period: m.date,
        value: m.spent
      }));
      
      forecast = forecastARIMA(timeSeriesData, 3);
    }
    
    // Calculate seasonal patterns if enough data
    let seasonality = null;
    if (monthlyTrends.length >= 12) {
      seasonality = this._detectSeasonality(monthlyTrends);
    }
    
    return {
      monthlyTrends,
      anomalies,
      forecast: forecast ? forecast.forecast : null,
      seasonality,
      insights: this._generateSpendingInsights(monthlyTrends, anomalies, forecast)
    };
  }

  /**
   * Analyze budget timeline and project completion status
   * @param {Object} budgetData Budget data
   * @returns {Object} Timeline analysis
   */
  _analyzeTimeline(budgetData) {
    const { fiscalYear, totalBudget, totalSpent } = budgetData;
    
    // Calculate current date and fiscal year boundaries
    const currentDate = new Date();
    const fiscalYearStart = new Date(fiscalYear, 3, 1); // April 1st for SA fiscal year
    const fiscalYearEnd = new Date(fiscalYear + 1, 2, 31); // March 31st
    
    // Calculate elapsed and remaining time
    const totalDays = (fiscalYearEnd - fiscalYearStart) / (1000 * 60 * 60 * 24);
    const elapsedDays = Math.max(0, (currentDate - fiscalYearStart) / (1000 * 60 * 60 * 24));
    const remainingDays = Math.max(0, (fiscalYearEnd - currentDate) / (1000 * 60 * 60 * 24));
    
    // Calculate percentages
    const percentElapsed = Math.min(100, (elapsedDays / totalDays) * 100);
    const percentRemaining = Math.max(0, 100 - percentElapsed);
    const percentSpent = (totalSpent / totalBudget) * 100;
    
    // Determine if spending is aligned with timeline
    const spendingAlignment = percentSpent - percentElapsed;
    let alignmentStatus;
    
    if (Math.abs(spendingAlignment) <= 5) alignmentStatus = 'Aligned';
    else if (spendingAlignment > 5) alignmentStatus = 'Ahead';
    else alignmentStatus = 'Behind';
    
    // Calculate burn rate
    const dailyBurnRate = totalSpent / elapsedDays;
    const monthlyBurnRate = dailyBurnRate * 30;
    const projectedTotal = dailyBurnRate * totalDays;
    const projectedVariance = projectedTotal - totalBudget;
    
    return {
      fiscalYear: {
        start: fiscalYearStart.toISOString().split('T')[0],
        end: fiscalYearEnd.toISOString().split('T')[0],
        current: currentDate.toISOString().split('T')[0]
      },
      timeProgress: {
        totalDays: Math.round(totalDays),
        elapsedDays: Math.round(elapsedDays),
        remainingDays: Math.round(remainingDays),
        percentElapsed: parseFloat(percentElapsed.toFixed(1)),
        percentRemaining: parseFloat(percentRemaining.toFixed(1)),
        currentQuarter: getQuarterFromDate(currentDate)
      },
      spendingProgress: {
        percentSpent: parseFloat(percentSpent.toFixed(1)),
        alignment: parseFloat(spendingAlignment.toFixed(1)),
        status: alignmentStatus
      },
      burnRate: {
        daily: parseFloat(dailyBurnRate.toFixed(2)),
        monthly: parseFloat(monthlyBurnRate.toFixed(2)),
        projectedTotal: parseFloat(projectedTotal.toFixed(2)),
        projectedVariance: parseFloat(projectedVariance.toFixed(2)),
        willExceedBudget: projectedVariance > 0
      }
    };
  }

  /**
   * Generate strategic recommendations based on all analyses
   * @param {Object} budgetData Complete budget data
   * @param {Object} departmentAnalysis Department analysis results
   * @param {Object} complianceAssessment Compliance assessment results
   * @param {Object} spendingPatterns Spending pattern analysis
   * @returns {Array} Strategic recommendations
   */
  _generateStrategicRecommendations(
    budgetData, 
    departmentAnalysis, 
    complianceAssessment, 
    spendingPatterns
  ) {
    const recommendations = [];
    
    // Setup budget optimization data structure
    const optimizationData = {
      departments: budgetData.departments.map(dept => ({
        name: dept.name,
        allocated: dept.annualBudget,
        spent: dept.spent,
        performance: dept.performanceScore
      })),
      totalBudget: budgetData.totalBudget,
      fiscalYearRemaining: (1 - (departmentAnalysis.timeProgress?.percentElapsed || 50) / 100)
    };
    
    // Generate optimization recommendations
    const optimizationResults = generateBudgetOptimizations(optimizationData);
    
    // Transform and enhance the recommendations
    if (optimizationResults && optimizationResults.recommendations) {
      optimizationResults.recommendations.forEach(rec => {
        recommendations.push({
          id: `rec-${recommendations.length + 1}`,
          category: rec.type,
          title: rec.title,
          description: rec.description,
          impact: rec.impact,
          action: rec.action,
          priority: rec.type === 'critical' ? 'High' : 
                  rec.type === 'warning' ? 'Medium' : 'Normal',
          details: rec.details || []
        });
      });
    }
    
    // Add recommendations based on compliance risks
    if (complianceAssessment.highRiskCount > 0) {
      recommendations.push({
        id: `rec-${recommendations.length + 1}`,
        category: 'compliance',
        title: 'Address Compliance Risks',
        description: `${complianceAssessment.highRiskCount} departments have elevated compliance risk scores requiring attention.`,
        impact: 'High',
        action: 'Conduct internal compliance review and implement enhanced controls',
        priority: 'High'
      });
    }
    
    // Add recommendations based on spending anomalies
    if (spendingPatterns.anomalies && spendingPatterns.anomalies.length > 0) {
      const significantAnomalies = spendingPatterns.anomalies.filter(a => a.significance === 'High');
      
      if (significantAnomalies.length > 0) {
        recommendations.push({
          id: `rec-${recommendations.length + 1}`,
          category: 'anomaly',
          title: 'Investigate Spending Anomalies',
          description: `${significantAnomalies.length} significant spending anomalies detected that require investigation.`,
          impact: 'Medium',
          action: 'Review transactions during anomalous periods for irregularities',
          priority: 'Medium',
          details: significantAnomalies.map(a => ({
            date: a.date,
            score: a.score
          }))
        });
      }
    }
    
    // Add timeline-based recommendations
    const timelineAnalysis = this._analyzeTimeline(budgetData);
    
    if (timelineAnalysis.burnRate.willExceedBudget) {
      recommendations.push({
        id: `rec-${recommendations.length + 1}`,
        category: 'budget',
        title: 'Adjust Spending Rate',
        description: `Current spending rate projects a budget overrun of ${formatCurrency(timelineAnalysis.burnRate.projectedVariance)} by fiscal year end.`,
        impact: 'High',
        action: 'Implement spending controls or secure additional budget allocation',
        priority: 'High'
      });
    }
    
    return recommendations;
  }

  /**
   * Calculate spending efficiency score
   * @param {Number} spent Amount spent
   * @param {Number} allocated Amount allocated
   * @param {Number} performanceScore Performance score
   * @returns {Number} Efficiency score
   */
  _calculateSpendingEfficiency(spent, allocated, performanceScore) {
    const utilizationRate = (spent / allocated) * 100;
    
    // Ideal utilization is considered to be around 95%
    const utilizationFactor = 1 - Math.abs(utilizationRate - 95) / 95;
    
    // Performance factor from 0-1
    const performanceFactor = performanceScore / 100;
    
    // Combine factors (weighted)
    const efficiencyScore = (utilizationFactor * 0.4) + (performanceFactor * 0.6);
    
    return parseFloat((efficiencyScore * 100).toFixed(1));
  }

  /**
   * Calculate trend from array of values
   * @param {Array} values Array of numeric values
   * @returns {Object} Trend information
   */
  _calculateTrend(values) {
    if (!values || values.length < 2) {
      return { direction: 'neutral', percentage: 0 };
    }
    
    const first = values[0];
    const last = values[values.length - 1];
    
    if (first === 0) return { direction: 'neutral', percentage: 0 };
    
    const change = ((last - first) / first) * 100;
    
    return {
      direction: change > 0 ? 'increasing' : change < 0 ? 'decreasing' : 'neutral',
      percentage: parseFloat(Math.abs(change).toFixed(1)),
      raw: parseFloat(change.toFixed(1))
    };
  }

  /**
   * Calculate volatility of a series of values
   * @param {Array} values Array of numeric values
   * @returns {Number} Volatility measure
   */
  _calculateVolatility(values) {
    if (!values || values.length < 2) return 0;
    
    const changes = [];
    for (let i = 1; i < values.length; i++) {
      if (values[i-1] === 0) continue;
      const percentChange = Math.abs((values[i] - values[i-1]) / values[i-1]);
      changes.push(percentChange);
    }
    
    if (changes.length === 0) return 0;
    
    const volatility = (changes.reduce((sum, val) => sum + val, 0) / changes.length) * 100;
    return parseFloat(volatility.toFixed(2));
  }

  /**
   * Get status for a department
   * @param {Object} department Department data
   * @returns {String} Department status
   */
  _getDepartmentStatus(department) {
    const utilizationRate = (department.spent / department.annualBudget) * 100;
    
    if (utilizationRate > 100) return 'Overspent';
    if (utilizationRate > 90) return 'At Risk';
    if (utilizationRate < 50 && department.performanceScore < 70) return 'Underperforming';
    if (department.performanceScore >= 80) return 'Excellent';
    if (department.performanceScore >= 70) return 'Good';
    if (department.performanceScore >= 60) return 'Satisfactory';
    return 'Needs Improvement';
  }

  /**
   * Generate compliance recommendations based on risk score
   * @param {Object} riskScore Risk score object
   * @returns {Array} Compliance recommendations
   */
  _generateComplianceRecommendations(riskScore) {
    const recommendations = [];
    
    // Get top risk factors
    const topFactors = Object.entries(riskScore.components)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2);
    
    topFactors.forEach(([factor, value]) => {
      switch (factor) {
        case 'compliance':
          recommendations.push('Strengthen compliance documentation and controls');
          break;
        case 'budget':
          recommendations.push('Improve budget adherence and variance management');
          break;
        case 'findings':
          recommendations.push('Address and clear outstanding audit findings');
          break;
        case 'volatility':
          recommendations.push('Stabilize spending patterns with better planning');
          break;
        case 'documentation':
          recommendations.push('Enhance record keeping and documentation processes');
          break;
        case 'historical':
          recommendations.push('Develop performance improvement plan');
          break;
      }
    });
    
    return recommendations;
  }

  /**
   * Detect seasonality in spending patterns
   * @param {Array} monthlyData Monthly spending data
   * @returns {Object} Seasonality information
   */
  _detectSeasonality(monthlyData) {
    // Simplified seasonality detection
    // Group by month across years
    const monthGroups = {};
    
    monthlyData.forEach(month => {
      const monthOnly = month.date.split('-')[1]; // Extract month part (MM)
      if (!monthGroups[monthOnly]) {
        monthGroups[monthOnly] = [];
      }
      
      monthGroups[monthOnly].push({
        spent: month.spent,
        allocated: month.allocated,
        utilizationRate: month.utilizationRate
      });
    });
    
    // Calculate average for each month
    const monthlyAverages = {};
    Object.entries(monthGroups).forEach(([month, data]) => {
      if (data.length > 0) {
        monthlyAverages[month] = {
          spent: data.reduce((sum, m) => sum + m.spent, 0) / data.length,
          utilizationRate: data.reduce((sum, m) => sum + m.utilizationRate, 0) / data.length
        };
      }
    });
    
    // Convert to array with month names
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const seasonalPattern = Object.entries(monthlyAverages).map(([monthNum, data]) => ({
      month: monthNames[parseInt(monthNum) - 1],
      avgSpent: parseFloat(data.spent.toFixed(2)),
      avgUtilization: parseFloat(data.utilizationRate.toFixed(1))
    })).sort((a, b) => monthNames.indexOf(a.month) - monthNames.indexOf(b.month));
    
    // Find peak and trough months
    const peakMonth = [...seasonalPattern].sort((a, b) => b.avgSpent - a.avgSpent)[0];
    const troughMonth = [...seasonalPattern].sort((a, b) => a.avgSpent - b.avgSpent)[0];
    
    return {
      seasonalPattern,
      peakMonth: {
        month: peakMonth.month,
        spent: peakMonth.avgSpent
      },
      troughMonth: {
        month: troughMonth.month,
        spent: troughMonth.avgSpent
      },
      seasonalityStrength: this._calculateSeasonalityStrength(seasonalPattern)
    };
  }

  /**
   * Calculate the strength of seasonality
   * @param {Array} seasonalPattern Seasonal pattern data
   * @returns {Object} Seasonality strength measure
   */
  _calculateSeasonalityStrength(seasonalPattern) {
    if (!seasonalPattern || seasonalPattern.length < 2) {
      return { score: 0, description: 'Insufficient data' };
    }
    
    // Calculate coefficient of variation
    const values = seasonalPattern.map(s => s.avgSpent);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    const cv = (stdDev / mean) * 100;
    
    // Interpret strength
    let description;
    if (cv < 10) description = 'Weak seasonality';
    else if (cv < 20) description = 'Moderate seasonality';
    else description = 'Strong seasonality';
    
    return {
      score: parseFloat(cv.toFixed(1)),
      description
    };
  }

  /**
   * Generate insights from spending patterns
   * @param {Array} monthlyTrends Monthly trend data
   * @param {Array} anomalies Detected anomalies
   * @param {Object} forecast Forecast data
   * @returns {Array} Spending insights
   */
  _generateSpendingInsights(monthlyTrends, anomalies, forecast) {
    const insights = [];
    
    // Recent trend insight
    if (monthlyTrends.length >= 3) {
      const recentMonths = monthlyTrends.slice(-3);
      const trend = this._calculateTrend(recentMonths.map(m => m.spent));
      
      insights.push(
        `Spending has been ${trend.direction} by ${trend.percentage}% over the last three months.`
      );
    }
    
    // Anomaly insight
    if (anomalies && anomalies.length > 0) {
      const significantAnomalies = anomalies.filter(a => a.significance === 'High');
      
      if (significantAnomalies.length > 0) {
        insights.push(
          `${significantAnomalies.length} significant spending anomalies detected requiring investigation.`
        );
      }
    }
    
    // Forecast insight
    if (forecast && forecast.forecast && forecast.forecast.length > 0) {
      const currentMonth = monthlyTrends[monthlyTrends.length - 1];
      const nextMonth = forecast.forecast[0];
      
      const changePercent = ((nextMonth.value - currentMonth.spent) / currentMonth.spent) * 100;
      
      insights.push(
        `Forecast projects a ${changePercent > 0 ? 'rise' : 'reduction'} of ${Math.abs(changePercent).toFixed(1)}% in spending next month.`
      );
    }
    
    // Efficiency insight
    if (monthlyTrends.length >= 3) {
      const recentMonths = monthlyTrends.slice(-3);
      const avgEfficiency = recentMonths.reduce((sum, m) => sum + m.utilizationRate, 0) / recentMonths.length;
      
      let efficiencyStatus;
      if (avgEfficiency > 105) efficiencyStatus = 'overspending';
      else if (avgEfficiency > 95) efficiencyStatus = 'optimal';
      else if (avgEfficiency > 80) efficiencyStatus = 'efficient';
      else efficiencyStatus = 'underspending';
      
      insights.push(
        `Recent budget utilization rate of ${avgEfficiency.toFixed(1)}% indicates ${efficiencyStatus} behavior.`
      );
    }
    
    return insights;
  }

  /**
   * Calculate confidence score for insights based on data quality
   * @param {Object} budgetData Budget data
   * @returns {Number} Confidence score (0-100)
   */
  _calculateConfidenceScore(budgetData) {
    let score = 100;
    
    // Check data completeness
    if (!budgetData.departments || budgetData.departments.length === 0) {
      score -= 40;
    } else {
      // Check for monthly data
      const hasMonthlyData = budgetData.departments.some(d => 
        d.monthlyData && d.monthlyData.length > 0
      );
      
      if (!hasMonthlyData) score -= 30;
      
      // Check length of monthly data
      const monthlyDataLength = Math.max(
        ...budgetData.departments.map(d => d.monthlyData?.length || 0)
      );
      
      if (monthlyDataLength < 3) score -= 20;
      else if (monthlyDataLength < 6) score -= 10;
    }
    
    // Ensure minimum score
    return Math.max(30, score);
  }
}

export const budgetInsights = new BudgetInsights();
export default budgetInsights;
