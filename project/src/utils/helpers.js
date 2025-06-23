// Helper functions for SAMS™ application

// *** BASIC UTILITIES ***

// Generate a unique ID
export const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + 
    Math.random().toString(36).substring(2, 15);
};

// Format currency for South African Rand
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR'
  }).format(amount);
};

// Format date to local string
export const formatDate = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('en-ZA', options);
};

// Format date and time
export const formatDateTime = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleString('en-ZA', options);
};

// Calculate percentage
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

// Calculate time elapsed since a date
export const timeElapsed = (dateString) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now - past;
  
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) {
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
  } else if (diffHours > 0) {
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  } else if (diffMins > 0) {
    return diffMins === 1 ? '1 minute ago' : `${diffMins} minutes ago`;
  } else {
    return 'Just now';
  }
};

// Get color based on severity
export const getSeverityColor = (severity) => {
  switch (severity.toLowerCase()) {
    case 'critical':
      return '#d32f2f'; // Red
    case 'high':
      return '#f57c00'; // Orange
    case 'medium':
      return '#ffc107'; // Amber
    case 'low':
      return '#4caf50'; // Green
    default:
      return '#757575'; // Grey
  }
};

// Get color based on status
export const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'approved':
    case 'resolved':
      return '#4caf50'; // Green
    case 'pending':
    case 'in progress':
      return '#2196f3'; // Blue
    case 'rejected':
    case 'failed':
      return '#d32f2f'; // Red
    case 'warning':
      return '#ff9800'; // Orange
    default:
      return '#757575'; // Grey
  }
};

// Basic anomaly detection for financial data
export const detectAnomalies = (dataPoints, threshold = 2) => {
  // Calculate mean
  const sum = dataPoints.reduce((acc, val) => acc + val, 0);
  const mean = sum / dataPoints.length;
  
  // Calculate standard deviation
  const squareDiffs = dataPoints.map(value => {
    const diff = value - mean;
    return diff * diff;
  });
  const avgSquareDiff = squareDiffs.reduce((acc, val) => acc + val, 0) / squareDiffs.length;
  const stdDev = Math.sqrt(avgSquareDiff);
  
  // Find anomalies (values that deviate from the mean by more than the threshold * stdDev)
  const anomalies = dataPoints.map((value, index) => {
    const zScore = Math.abs(value - mean) / stdDev;
    return {
      value,
      index,
      isAnomaly: zScore > threshold
    };
  }).filter(item => item.isAnomaly);
  
  return {
    mean,
    stdDev,
    anomalies
  };
};

// Calculate spending trend (increasing/decreasing)
export const calculateTrend = (currentValue, previousValue) => {
  if (previousValue === 0) return { direction: 'neutral', percentage: 0 };
  
  const difference = currentValue - previousValue;
  const percentage = (difference / previousValue) * 100;
  
  return {
    direction: difference > 0 ? 'increasing' : difference < 0 ? 'decreasing' : 'neutral',
    percentage: Math.abs(percentage)
  };
};

// Get budget status color based on percentage spent
export const getBudgetStatusColor = (allocated, spent) => {
  if (allocated === 0) return '#757575'; // Grey for zero allocation
  
  const percentage = (spent / allocated) * 100;
  
  if (percentage > 100) return '#d32f2f'; // Red for overspent
  if (percentage > 90) return '#ff9800'; // Orange for near limit
  if (percentage > 75) return '#ffc107'; // Amber for approaching limit
  return '#4caf50'; // Green for healthy
};

// Get budget status label
export const getBudgetStatusLabel = (allocated, spent) => {
  if (allocated === 0) return 'No Allocation';
  
  const percentage = (spent / allocated) * 100;
  
  if (percentage > 100) return 'Overspent';
  if (percentage > 90) return 'At Risk';
  if (percentage > 75) return 'Caution';
  return 'Healthy';
};

// Format percentage with + or - sign
export const formatPercentageChange = (value) => {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
};

// Download data as CSV file
export const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  // Create downloadable link
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  // Add to DOM, trigger download and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Format quarter from date
export const getQuarterFromDate = (date) => {
  const d = new Date(date);
  const month = d.getMonth();
  const year = d.getFullYear();
  
  let quarter;
  if (month < 3) quarter = 'Q1';
  else if (month < 6) quarter = 'Q2';
  else if (month < 9) quarter = 'Q3';
  else quarter = 'Q4';
  
  return `${year} ${quarter}`;
};

// Calculate budget remaining days
export const calculateRemainingDays = (endDate) => {
  const end = new Date(endDate);
  const today = new Date();
  
  // Set both dates to midnight for accurate day calculation
  end.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const diffTime = end - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// *** ADVANCED ANALYTICS SUITE - SAMS™ PREMIUM FEATURES ***

// Calculate EUREKA risk score (Enhanced Unified Risk Evaluation and Key Assessment)
export const calculateEurekaRiskScore = (data) => {
  const {
    complianceRating = 100, // 0-100 scale
    budgetVariance = 0, // % difference between planned and actual
    auditFindings = 0, // number of findings
    spendingVolatility = 0, // 0-100 scale
    documentCompliance = 100, // 0-100 scale
    historicalPerformance = 100 // 0-100 scale
  } = data;
  
  // Weightings (must sum to 1)
  const weights = {
    complianceRating: 0.25,
    budgetVariance: 0.20,
    auditFindings: 0.20,
    spendingVolatility: 0.15,
    documentCompliance: 0.10,
    historicalPerformance: 0.10
  };
  
  // Normalize audit findings (0-10 scale)
  const normalizedAuditFindings = Math.min(auditFindings, 10) / 10 * 100;
  
  // Calculate inverted metrics (higher is better in original scale, but we need higher=worse for risk)
  const invertedCompliance = 100 - complianceRating;
  const invertedDocCompliance = 100 - documentCompliance;
  const invertedHistorical = 100 - historicalPerformance;
  
  // Calculate absolute budget variance
  const absBudgetVariance = Math.abs(budgetVariance);
  
  // Calculate components with appropriate scaling
  const complianceComponent = invertedCompliance * weights.complianceRating;
  const budgetComponent = Math.min(absBudgetVariance, 100) * weights.budgetVariance;
  const findingsComponent = normalizedAuditFindings * weights.auditFindings;
  const volatilityComponent = spendingVolatility * weights.spendingVolatility;
  const documentComponent = invertedDocCompliance * weights.documentCompliance;
  const historicalComponent = invertedHistorical * weights.historicalPerformance;
  
  // Combine for final score (0-100, higher is riskier)
  const riskScore = complianceComponent + 
                   budgetComponent + 
                   findingsComponent + 
                   volatilityComponent + 
                   documentComponent + 
                   historicalComponent;
  
  // Risk category determination
  let riskCategory;
  if (riskScore < 20) riskCategory = 'Low';
  else if (riskScore < 40) riskCategory = 'Moderate';
  else if (riskScore < 60) riskCategory = 'Elevated';
  else if (riskScore < 80) riskCategory = 'High';
  else riskCategory = 'Critical';
  
  return {
    score: parseFloat(riskScore.toFixed(2)),
    category: riskCategory,
    components: {
      compliance: parseFloat(complianceComponent.toFixed(2)),
      budget: parseFloat(budgetComponent.toFixed(2)),
      findings: parseFloat(findingsComponent.toFixed(2)),
      volatility: parseFloat(volatilityComponent.toFixed(2)),
      documentation: parseFloat(documentComponent.toFixed(2)),
      historical: parseFloat(historicalComponent.toFixed(2))
    }
  };
};

// ARIMA-inspired time series forecasting
export const forecastARIMA = (timeSeriesData, periodsAhead = 3) => {
  // Requires historical data as [{period: '2023-Q1', value: 1000}, ...]
  if (!timeSeriesData || timeSeriesData.length < 4) {
    return { forecast: [], error: 'Insufficient data for forecasting' };
  }
  
  // Extract just the values for calculation
  const values = timeSeriesData.map(point => point.value);
  const periods = timeSeriesData.map(point => point.period);
  
  // Calculate differenced series (simple first-order differencing)
  const diffSeries = [];
  for (let i = 1; i < values.length; i++) {
    diffSeries.push(values[i] - values[i-1]);
  }
  
  // Calculate mean of differenced series (for AR(1) model)
  const diffMean = diffSeries.reduce((sum, val) => sum + val, 0) / diffSeries.length;
  
  // Calculate a simple AR coefficient
  let sumNumerator = 0;
  let sumDenominator = 0;
  for (let i = 1; i < diffSeries.length; i++) {
    sumNumerator += (diffSeries[i] - diffMean) * (diffSeries[i-1] - diffMean);
    sumDenominator += Math.pow(diffSeries[i-1] - diffMean, 2);
  }
  const arCoefficient = sumDenominator !== 0 ? sumNumerator / sumDenominator : 0;
  
  // Constrain coefficient for stability
  const constrainedCoef = Math.max(Math.min(arCoefficient, 0.9), -0.9);
  
  // Generate forecasts
  const forecasts = [];
  let lastValue = values[values.length - 1];
  let lastDiff = diffSeries[diffSeries.length - 1];
  
  // Generate period labels (assumes quarterly data)
  const lastPeriodParts = periods[periods.length - 1].split(' ');
  let currentYear = parseInt(lastPeriodParts[0]);
  let currentQuarter = parseInt(lastPeriodParts[1].replace('Q', ''));
  
  for (let i = 0; i < periodsAhead; i++) {
    // Forecast next difference using AR(1) model
    const nextDiff = diffMean + constrainedCoef * (lastDiff - diffMean);
    
    // Add difference to last value to get next value
    const nextValue = lastValue + nextDiff;
    
    // Update quarter for next period
    currentQuarter++;
    if (currentQuarter > 4) {
      currentQuarter = 1;
      currentYear++;
    }
    
    // Format the next period
    const nextPeriod = `${currentYear} Q${currentQuarter}`;
    
    // Store forecast
    forecasts.push({
      period: nextPeriod,
      value: Math.max(0, Math.round(nextValue)), // Ensure non-negative
      lower: Math.max(0, Math.round(nextValue * 0.9)), // Simple confidence bounds
      upper: Math.round(nextValue * 1.1)
    });
    
    // Update for next iteration
    lastValue = nextValue;
    lastDiff = nextDiff;
  }
  
  return {
    forecast: forecasts,
    modelInfo: {
      arCoefficient: parseFloat(constrainedCoef.toFixed(4)),
      diffMean: parseFloat(diffMean.toFixed(2)),
      dataPoints: values.length
    }
  };
};

// Multivariate anomaly detection (Mahalanobis distance inspired)
export const detectMultivariateAnomalies = (dataPoints, threshold = 3.5) => {
  // Requires data in format: [{metric1: val, metric2: val, ...}, ...]
  if (!dataPoints || dataPoints.length < 5) {
    return { anomalies: [], error: 'Insufficient data points' };
  }
  
  // Extract metrics
  const metrics = Object.keys(dataPoints[0]);
  
  // Calculate means for each metric
  const means = {};
  metrics.forEach(metric => {
    const sum = dataPoints.reduce((acc, point) => acc + point[metric], 0);
    means[metric] = sum / dataPoints.length;
  });
  
  // Calculate variances and covariances (simplified)
  const variances = {};
  metrics.forEach(metric => {
    const squaredDiffs = dataPoints.map(point => 
      Math.pow(point[metric] - means[metric], 2)
    );
    variances[metric] = squaredDiffs.reduce((acc, val) => acc + val, 0) / dataPoints.length;
  });
  
  // Calculate anomaly scores (simplified Mahalanobis-inspired distance)
  const anomalyScores = dataPoints.map((point, index) => {
    // Calculate normalized squared deviations
    const normalizedDeviations = metrics.map(metric => {
      if (variances[metric] === 0) return 0;
      const deviation = point[metric] - means[metric];
      return Math.pow(deviation, 2) / variances[metric];
    });
    
    // Sum them for a final score
    const score = Math.sqrt(normalizedDeviations.reduce((acc, val) => acc + val, 0));
    
    return {
      index,
      point,
      score,
      isAnomaly: score > threshold
    };
  });
  
  // Filter to just anomalies
  const anomalies = anomalyScores.filter(item => item.isAnomaly);
  
  return {
    anomalies,
    meanValues: means,
    threshold,
    totalItems: dataPoints.length,
    anomalyCount: anomalies.length
  };
};

// Budget optimization recommendation generator
export const generateBudgetOptimizations = (budgetData) => {
  const {
    departments = [],  // [{name, allocated, spent, performance}]
    totalBudget = 0,
    fiscalYearRemaining = 1.0,  // percentage of year remaining (0.0-1.0)
    priorities = [],  // [{name, weight}]
    constraints = []  // [{name, rule}]
  } = budgetData;
  
  const recommendations = [];
  
  // Check for overspending departments
  const overspentDepts = departments.filter(
    dept => dept.spent > dept.allocated
  );
  
  if (overspentDepts.length > 0) {
    recommendations.push({
      type: 'critical',
      title: 'Address Overspending',
      description: `${overspentDepts.length} department(s) have exceeded their allocated budget.`,
      details: overspentDepts.map(dept => ({
        department: dept.name,
        overspentAmount: dept.spent - dept.allocated,
        percentage: ((dept.spent / dept.allocated) * 100).toFixed(1) + '%'
      })),
      impact: 'High',
      action: 'Immediate budget review and reallocation required'
    });
  }
  
  // Check for underspending (risk of losing funds)
  const underspentDepts = departments.filter(dept => {
    const spentPercentage = dept.spent / dept.allocated;
    const expectedPercentage = 1 - fiscalYearRemaining;
    return spentPercentage < expectedPercentage * 0.7; // 30% below expected
  });
  
  if (underspentDepts.length > 0) {
    recommendations.push({
      type: 'warning',
      title: 'Accelerate Planned Spending',
      description: `${underspentDepts.length} department(s) are significantly underspending relative to the fiscal year progress.`,
      details: underspentDepts.map(dept => ({
        department: dept.name,
        currentSpent: ((dept.spent / dept.allocated) * 100).toFixed(1) + '%',
        expectedSpent: ((1 - fiscalYearRemaining) * 100).toFixed(1) + '%'
      })),
      impact: 'Medium',
      action: 'Review implementation timelines and procurement schedules'
    });
  }
  
  // High-performing departments that could benefit from additional funding
  const highPerformers = departments.filter(
    dept => dept.performance > 85 && (dept.spent / dept.allocated) > 0.8
  );
  
  if (highPerformers.length > 0) {
    recommendations.push({
      type: 'opportunity',
      title: 'Invest in High-Performing Areas',
      description: `${highPerformers.length} department(s) are showing excellent performance metrics and efficient budget utilization.`,
      details: highPerformers.map(dept => ({
        department: dept.name,
        performance: dept.performance + '%',
        utilizationRate: ((dept.spent / dept.allocated) * 100).toFixed(1) + '%'
      })),
      impact: 'Positive',
      action: 'Consider allocating additional resources from underutilized areas'
    });
  }
  
  // Generate strategic alignment recommendations if priorities are provided
  if (priorities.length > 0) {
    const misalignedDepts = departments.filter(dept => {
      // Simple check - in a real implementation, this would be more sophisticated
      const relevantPriority = priorities.find(p => 
        dept.name.toLowerCase().includes(p.name.toLowerCase())
      );
      
      return relevantPriority && 
             relevantPriority.weight > 0.7 && 
             (dept.allocated / totalBudget) < 0.1;
    });
    
    if (misalignedDepts.length > 0) {
      recommendations.push({
        type: 'strategic',
        title: 'Align Budget with Strategic Priorities',
        description: 'Some high-priority areas may be underfunded relative to their strategic importance.',
        details: misalignedDepts.map(dept => ({
          department: dept.name,
          currentAllocation: ((dept.allocated / totalBudget) * 100).toFixed(1) + '%',
          recommendation: 'Review allocation in next budget cycle'
        })),
        impact: 'Strategic',
        action: 'Consider rebalancing in mid-year budget adjustments'
      });
    }
  }
  
  // Add blockchain-inspired hashing for audit trail (simulated)
  const timestamp = new Date().toISOString();
  const inputHash = btoa(JSON.stringify(budgetData)).substring(0, 20); // Simple encoding for demo
  
  return {
    recommendations,
    metadata: {
      generatedAt: timestamp,
      dataHash: inputHash,
      recommendationCount: recommendations.length
    }
  };
};

// MFMA/PFMA compliance parser
export const parseComplianceStatus = (transaction, rules) => {
  // Requires transaction object and rules array
  // Returns compliance status with verification hashes
  
  const results = [];
  let overallCompliant = true;
  
  // Check each rule
  rules.forEach(rule => {
    const {
      id,
      description,
      test,
      category,
      severity,
      remediation,
      section
    } = rule;
    
    // Execute the rule test (in production this would be more sophisticated)
    let compliant = true;
    let ruleValue = null;
    
    try {
      // Simple example of rule evaluation
      if (test.type === 'threshold' && transaction[test.field] !== undefined) {
        ruleValue = transaction[test.field];
        compliant = test.operator === '>' ? ruleValue > test.value : 
                   test.operator === '<' ? ruleValue < test.value :
                   test.operator === '=' ? ruleValue === test.value :
                   test.operator === '>=' ? ruleValue >= test.value :
                   test.operator === '<=' ? ruleValue <= test.value : false;
      } else if (test.type === 'existence' && transaction[test.field] !== undefined) {
        ruleValue = transaction[test.field] ? 'Present' : 'Missing';
        compliant = test.required === true ? !!transaction[test.field] : true;
      }
    } catch (error) {
      compliant = false;
      ruleValue = 'Error';
    }
    
    // Update overall compliance
    if (!compliant) {
      overallCompliant = false;
    }
    
    // Generate verification hash (simplified for demonstration)
    const verificationData = `${id}-${transaction.id}-${compliant}-${Date.now()}`;
    const verificationHash = btoa(verificationData).substring(0, 16);
    
    results.push({
      ruleId: id,
      description,
      category,
      section,
      severity,
      compliant,
      value: ruleValue,
      remediation: compliant ? null : remediation,
      verificationHash
    });
  });
  
  return {
    transactionId: transaction.id,
    timestamp: new Date().toISOString(),
    compliant: overallCompliant,
    ruleResults: results,
    verificationSummary: {
      rulesChecked: rules.length,
      passedRules: results.filter(r => r.compliant).length,
      failedRules: results.filter(r => !r.compliant).length,
      highestSeverity: results.filter(r => !r.compliant)
                           .sort((a, b) => {
                             const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
                             return severityOrder[b.severity] - severityOrder[a.severity];
                           })[0]?.severity || 'none'
    }
  };
};

// Generate realistic test data for demonstrations
export const generateDemoData = (options = {}) => {
  const {
    departmentCount = 5,
    monthsOfHistory = 12,
    baseDate = new Date(),
    randomSeed = 123
  } = options;
  
  // Simple seeded random function
  let seed = randomSeed;
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  
  const departments = [
    'Finance', 'Infrastructure', 'Community Services', 
    'Public Safety', 'Administration', 'Water & Sanitation',
    'Electricity', 'Housing', 'Economic Development', 
    'Environmental Affairs'
  ];
  
  // Select departments based on count
  const selectedDepartments = departments.slice(0, departmentCount);
  
  // Generate budget data
  const budgetData = selectedDepartments.map(dept => {
    // Base allocation (in millions of Rand)
    const baseAllocation = 10 + random() * 90; // 10M to 100M
    
    // Generate monthly data
    const monthlyData = [];
    let cumulativeSpent = 0;
    
    for (let i = 0; i < monthsOfHistory; i++) {
      const date = new Date(baseDate);
      date.setMonth(date.getMonth() - (monthsOfHistory - i - 1));
      
      // Monthly allocation (1/12 of annual with some variation)
      const monthlyAllocation = baseAllocation / 12 * (0.9 + random() * 0.2);
      
      // Monthly spending (with realistic patterns)
      let monthlySpending;
      if (i < 3) {
        // First quarter: underspending common
        monthlySpending = monthlyAllocation * (0.5 + random() * 0.3);
      } else if (i > monthsOfHistory - 3) {
        // Last quarter: often overspending to use budget
        monthlySpending = monthlyAllocation * (0.9 + random() * 0.4);
      } else {
        // Middle periods: more normal spending
        monthlySpending = monthlyAllocation * (0.7 + random() * 0.6);
      }
      
      cumulativeSpent += monthlySpending;
      
      monthlyData.push({
        date: date.toISOString().split('T')[0],
        allocated: parseFloat(monthlyAllocation.toFixed(2)),
        spent: parseFloat(monthlySpending.toFixed(2)),
        balance: parseFloat((monthlyAllocation - monthlySpending).toFixed(2)),
        transactions: Math.floor(20 + random() * 80) // 20-100 transactions
      });
    }
    
    // Calculate performance score (simplified)
    const performanceMetrics = [
      70 + random() * 30, // service delivery score
      70 + random() * 30, // financial management score
      70 + random() * 30  // compliance score
    ];
    
    const performanceScore = performanceMetrics.reduce((a, b) => a + b) / performanceMetrics.length;
    
    return {
      name: dept,
      annualBudget: parseFloat(baseAllocation.toFixed(2)),
      spent: parseFloat(cumulativeSpent.toFixed(2)),
      remaining: parseFloat((baseAllocation - cumulativeSpent).toFixed(2)),
      performanceScore: parseFloat(performanceScore.toFixed(1)),
      monthlyData,
      metrics: {
        serviceDelivery: parseFloat(performanceMetrics[0].toFixed(1)),
        financialManagement: parseFloat(performanceMetrics[1].toFixed(1)),
        compliance: parseFloat(performanceMetrics[2].toFixed(1))
      }
    };
  });
  
  return {
    departments: budgetData,
    fiscalYear: baseDate.getFullYear(),
    totalBudget: parseFloat(budgetData.reduce((sum, dept) => sum + dept.annualBudget, 0).toFixed(2)),
    totalSpent: parseFloat(budgetData.reduce((sum, dept) => sum + dept.spent, 0).toFixed(2)),
    generateDate: baseDate.toISOString(),
    metadata: {
      dataVersion: '1.0',
      generationType: 'demo',
      departmentCount,
      historyMonths: monthsOfHistory
    }
  };
};
