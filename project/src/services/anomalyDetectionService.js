// Anomaly Detection Service - Provides basic statistical anomaly detection for financial transactions
// Part of SAMS™ Milestone 2: Core Compliance Engine

import { detectAnomalies } from '../utils/helpers';

// Sample transaction data for development/testing
const mockTransactionHistory = [
  { id: 'H001', date: '2025-01-15', department: 'Information Technology', amount: 25000, category: 'Equipment' },
  { id: 'H002', date: '2025-01-28', department: 'Information Technology', amount: 22000, category: 'Equipment' },
  { id: 'H003', date: '2025-02-12', department: 'Information Technology', amount: 27500, category: 'Equipment' },
  { id: 'H004', date: '2025-02-25', department: 'Information Technology', amount: 24500, category: 'Equipment' },
  { id: 'H005', date: '2025-03-10', department: 'Information Technology', amount: 26000, category: 'Equipment' },
  { id: 'H006', date: '2025-03-27', department: 'Information Technology', amount: 78000, category: 'Equipment' }, // Anomaly
  { id: 'H007', date: '2025-04-15', department: 'Information Technology', amount: 23500, category: 'Equipment' },
  { id: 'H008', date: '2025-04-29', department: 'Information Technology', amount: 24000, category: 'Equipment' },
  { id: 'H009', date: '2025-05-14', department: 'Information Technology', amount: 25500, category: 'Equipment' },
  { id: 'H010', date: '2025-05-30', department: 'Information Technology', amount: 26500, category: 'Equipment' },
  { id: 'H011', date: '2025-06-10', department: 'Information Technology', amount: 23000, category: 'Equipment' },
  
  { id: 'H012', date: '2025-01-10', department: 'Finance', amount: 12000, category: 'Consulting' },
  { id: 'H013', date: '2025-01-25', department: 'Finance', amount: 15000, category: 'Consulting' },
  { id: 'H014', date: '2025-02-15', department: 'Finance', amount: 14000, category: 'Consulting' },
  { id: 'H015', date: '2025-02-28', department: 'Finance', amount: 13500, category: 'Consulting' },
  { id: 'H016', date: '2025-03-18', department: 'Finance', amount: 16000, category: 'Consulting' },
  { id: 'H017', date: '2025-03-30', department: 'Finance', amount: 14500, category: 'Consulting' },
  { id: 'H018', date: '2025-04-12', department: 'Finance', amount: 12500, category: 'Consulting' },
  { id: 'H019', date: '2025-04-25', department: 'Finance', amount: 13000, category: 'Consulting' },
  { id: 'H020', date: '2025-05-10', department: 'Finance', amount: 6000, category: 'Consulting' }, // Anomaly (lower)
  { id: 'H021', date: '2025-05-27', department: 'Finance', amount: 14000, category: 'Consulting' },
  { id: 'H022', date: '2025-06-15', department: 'Finance', amount: 14500, category: 'Consulting' },
  
  { id: 'H023', date: '2025-01-05', department: 'Public Works', amount: 120000, category: 'Construction' },
  { id: 'H024', date: '2025-01-20', department: 'Public Works', amount: 115000, category: 'Construction' },
  { id: 'H025', date: '2025-02-08', department: 'Public Works', amount: 125000, category: 'Construction' },
  { id: 'H026', date: '2025-02-22', department: 'Public Works', amount: 118000, category: 'Construction' },
  { id: 'H027', date: '2025-03-12', department: 'Public Works', amount: 130000, category: 'Construction' },
  { id: 'H028', date: '2025-03-28', department: 'Public Works', amount: 122000, category: 'Construction' },
  { id: 'H029', date: '2025-04-15', department: 'Public Works', amount: 220000, category: 'Construction' }, // Anomaly
  { id: 'H030', date: '2025-04-30', department: 'Public Works', amount: 126000, category: 'Construction' },
  { id: 'H031', date: '2025-05-17', department: 'Public Works', amount: 124000, category: 'Construction' },
  { id: 'H032', date: '2025-05-29', department: 'Public Works', amount: 119000, category: 'Construction' },
  { id: 'H033', date: '2025-06-14', department: 'Public Works', amount: 121000, category: 'Construction' }
];

// Stores detected anomalies
let detectedAnomalies = [];

// Initialize detection with demo data
const initializeDemo = () => {
  // Group transactions by department and category
  const groupedTransactions = {};
  
  mockTransactionHistory.forEach(transaction => {
    const key = `${transaction.department}_${transaction.category}`;
    if (!groupedTransactions[key]) {
      groupedTransactions[key] = [];
    }
    groupedTransactions[key].push(transaction);
  });
  
  // Analyze each group for anomalies
  Object.values(groupedTransactions).forEach(transactions => {
    const amounts = transactions.map(t => t.amount);
    const result = detectAnomalies(amounts, 2.0); // Use 2 standard deviations as threshold
    
    result.anomalies.forEach(anomaly => {
      const transaction = transactions[anomaly.index];
      detectedAnomalies.push({
        id: transaction.id,
        transactionData: transaction,
        anomalyScore: Math.abs((anomaly.value - result.mean) / result.stdDev).toFixed(2),
        expectedValue: Math.round(result.mean),
        deviation: Math.round(anomaly.value - result.mean),
        deviationPercentage: Math.round(((anomaly.value - result.mean) / result.mean) * 100),
        detectedAt: new Date().toISOString(),
        status: 'unreviewed'
      });
    });
  });
};

// Get all detected anomalies
const getAnomalies = () => {
  return detectedAnomalies;
};

// Get filtered anomalies
const getFilteredAnomalies = (filters) => {
  let filtered = [...detectedAnomalies];
  
  if (filters) {
    if (filters.department) {
      filtered = filtered.filter(anomaly => 
        anomaly.transactionData.department === filters.department
      );
    }
    
    if (filters.category) {
      filtered = filtered.filter(anomaly => 
        anomaly.transactionData.category === filters.category
      );
    }
    
    if (filters.status) {
      filtered = filtered.filter(anomaly => 
        anomaly.status === filters.status
      );
    }
    
    if (filters.minScore) {
      filtered = filtered.filter(anomaly => 
        parseFloat(anomaly.anomalyScore) >= filters.minScore
      );
    }
    
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(anomaly => 
        new Date(anomaly.transactionData.date) >= fromDate
      );
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      filtered = filtered.filter(anomaly => 
        new Date(anomaly.transactionData.date) <= toDate
      );
    }
  }
  
  return filtered;
};

// Update anomaly status
const updateAnomalyStatus = (anomalyId, newStatus, notes = '') => {
  const index = detectedAnomalies.findIndex(anomaly => anomaly.id === anomalyId);
  if (index >= 0) {
    detectedAnomalies[index] = {
      ...detectedAnomalies[index],
      status: newStatus,
      reviewNotes: notes,
      reviewedAt: new Date().toISOString()
    };
    return detectedAnomalies[index];
  }
  return null;
};

// Analyze a new transaction for anomalies
const analyzeTransaction = (transaction, historicalTransactions) => {
  // Get relevant historical transactions (same department and category)
  const relevantHistory = historicalTransactions.filter(t => 
    t.department === transaction.department && 
    t.category === transaction.category
  );
  
  if (relevantHistory.length < 5) {
    // Not enough historical data for reliable detection
    return {
      isAnomaly: false,
      message: 'Insufficient historical data for anomaly detection'
    };
  }
  
  // Extract amounts for analysis
  const amounts = relevantHistory.map(t => t.amount);
  amounts.push(transaction.amount);
  
  const result = detectAnomalies(amounts, 2.0);
  const lastIndex = amounts.length - 1;
  
  // Check if the new transaction is an anomaly
  const anomalyItem = result.anomalies.find(a => a.index === lastIndex);
  
  if (anomalyItem) {
    // New transaction is an anomaly
    const anomalyData = {
      id: transaction.id,
      transactionData: transaction,
      anomalyScore: Math.abs((transaction.amount - result.mean) / result.stdDev).toFixed(2),
      expectedValue: Math.round(result.mean),
      deviation: Math.round(transaction.amount - result.mean),
      deviationPercentage: Math.round(((transaction.amount - result.mean) / result.mean) * 100),
      detectedAt: new Date().toISOString(),
      status: 'unreviewed'
    };
    
    detectedAnomalies.push(anomalyData);
    
    return {
      isAnomaly: true,
      anomalyData,
      message: `Transaction amount deviates by ${anomalyData.deviationPercentage}% from expected value`
    };
  }
  
  return {
    isAnomaly: false,
    message: 'Transaction amount within normal range'
  };
};

// Get anomaly statistics
const getAnomalyStatistics = () => {
  const totalAnomalies = detectedAnomalies.length;
  const unreviewedCount = detectedAnomalies.filter(a => a.status === 'unreviewed').length;
  const flaggedCount = detectedAnomalies.filter(a => a.status === 'flagged').length;
  const clearedCount = detectedAnomalies.filter(a => a.status === 'cleared').length;
  
  // Group by department
  const departmentStats = {};
  detectedAnomalies.forEach(anomaly => {
    const dept = anomaly.transactionData.department;
    if (!departmentStats[dept]) {
      departmentStats[dept] = 0;
    }
    departmentStats[dept]++;
  });
  
  // Group by category
  const categoryStats = {};
  detectedAnomalies.forEach(anomaly => {
    const category = anomaly.transactionData.category;
    if (!categoryStats[category]) {
      categoryStats[category] = 0;
    }
    categoryStats[category]++;
  });
  
  return {
    totalAnomalies,
    unreviewedCount,
    flaggedCount,
    clearedCount,
    byDepartment: Object.entries(departmentStats).map(([dept, count]) => ({ department: dept, count })),
    byCategory: Object.entries(categoryStats).map(([category, count]) => ({ category, count }))
  };
};

// Initialize demo data
initializeDemo();

export {
  getAnomalies,
  getFilteredAnomalies,
  updateAnomalyStatus,
  analyzeTransaction,
  getAnomalyStatistics,
  mockTransactionHistory
};
