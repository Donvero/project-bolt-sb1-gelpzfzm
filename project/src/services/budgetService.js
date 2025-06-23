// Budget Service - Manages budget data, tracking, and analysis
// Part of SAMS™ Milestone 3: Budget Management System

import { generateId } from '../utils/helpers';
import { addAlert, ALERT_TYPES, ALERT_PRIORITIES } from './alertService';

// Mock budget data for development/testing
const mockBudgets = [
  {
    id: 'BUD-IT-2025Q3',
    department: 'Information Technology',
    period: '2025 Q3',
    allocated: 500000,
    spent: 420000,
    startDate: '2025-07-01',
    endDate: '2025-09-30',
    status: 'active',
    history: [
      { date: '2025-07-10', amount: 120000, description: 'Server upgrades' },
      { date: '2025-08-05', amount: 150000, description: 'Software licenses' },
      { date: '2025-09-01', amount: 150000, description: 'Cloud services' }
    ],
    notes: 'Priority projects: Security infrastructure, Cloud migration'
  },
  {
    id: 'BUD-FIN-2025Q3',
    department: 'Finance',
    period: '2025 Q3',
    allocated: 750000,
    spent: 680000,
    startDate: '2025-07-01',
    endDate: '2025-09-30',
    status: 'active',
    history: [
      { date: '2025-07-15', amount: 250000, description: 'Consulting services' },
      { date: '2025-08-10', amount: 230000, description: 'ERP System update' },
      { date: '2025-09-05', amount: 200000, description: 'Financial audit' }
    ],
    notes: 'Annual audit preparation in progress'
  },
  {
    id: 'BUD-PW-2025Q3',
    department: 'Public Works',
    period: '2025 Q3',
    allocated: 1200000,
    spent: 950000,
    startDate: '2025-07-01',
    endDate: '2025-09-30',
    status: 'active',
    history: [
      { date: '2025-07-05', amount: 350000, description: 'Road maintenance' },
      { date: '2025-08-15', amount: 400000, description: 'Bridge repairs' },
      { date: '2025-09-10', amount: 200000, description: 'Equipment purchase' }
    ],
    notes: 'Seasonal maintenance projects underway'
  },
  {
    id: 'BUD-ADM-2025Q3',
    department: 'Administration',
    period: '2025 Q3',
    allocated: 300000,
    spent: 280000,
    startDate: '2025-07-01',
    endDate: '2025-09-30',
    status: 'active',
    history: [
      { date: '2025-07-20', amount: 100000, description: 'Office supplies' },
      { date: '2025-08-20', amount: 90000, description: 'Staff training' },
      { date: '2025-09-15', amount: 90000, description: 'Facility maintenance' }
    ],
    notes: 'New staff onboarding program in progress'
  },
  {
    id: 'BUD-HR-2025Q3',
    department: 'Human Resources',
    period: '2025 Q3',
    allocated: 400000,
    spent: 350000,
    startDate: '2025-07-01',
    endDate: '2025-09-30',
    status: 'active',
    history: [
      { date: '2025-07-25', amount: 150000, description: 'Recruitment campaign' },
      { date: '2025-08-25', amount: 120000, description: 'Benefits administration' },
      { date: '2025-09-20', amount: 80000, description: 'HR software subscription' }
    ],
    notes: 'Focusing on talent acquisition for IT department'
  },
  {
    id: 'BUD-IT-2025Q2',
    department: 'Information Technology',
    period: '2025 Q2',
    allocated: 500000,
    spent: 510000,
    startDate: '2025-04-01',
    endDate: '2025-06-30',
    status: 'closed',
    history: [
      { date: '2025-04-10', amount: 180000, description: 'Hardware purchases' },
      { date: '2025-05-15', amount: 200000, description: 'Software development' },
      { date: '2025-06-20', amount: 130000, description: 'Cybersecurity audit' }
    ],
    notes: 'Overspent due to emergency security patching'
  }
];

// Store for budgets
let budgets = [...mockBudgets];

// Get all budgets
const getBudgets = () => {
  return budgets;
};

// Get filtered budgets
const getFilteredBudgets = (filters) => {
  let filteredBudgets = [...budgets];

  if (filters) {
    if (filters.department) {
      filteredBudgets = filteredBudgets.filter(budget =>
        budget.department === filters.department
      );
    }

    if (filters.period) {
      filteredBudgets = filteredBudgets.filter(budget =>
        budget.period === filters.period
      );
    }

    if (filters.status) {
      filteredBudgets = filteredBudgets.filter(budget =>
        budget.status === filters.status
      );
    }

    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      filteredBudgets = filteredBudgets.filter(budget =>
        new Date(budget.startDate) >= startDate
      );
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      filteredBudgets = filteredBudgets.filter(budget =>
        new Date(budget.endDate) <= endDate
      );
    }
  }

  return filteredBudgets;
};

// Get budget by ID
const getBudgetById = (id) => {
  return budgets.find(budget => budget.id === id);
};

// Add a new budget
const addBudget = (budget) => {
  if (!budget.department || !budget.period || typeof budget.allocated === 'undefined') {
    throw new Error('Missing required budget fields: department, period, and allocated amount are mandatory.');
  }

  if (typeof budget.allocated !== 'number' || budget.allocated < 0) {
    throw new Error('Allocated amount must be a non-negative number.');
  }

  const newBudget = {
    status: 'active',
    history: [],
    notes: '',
    ...budget, // Spread incoming budget first
    id: budget.id || `BUD-${generateId().substring(0, 6)}`, // Then apply or override ID
  };

  budgets.unshift(newBudget);
  checkBudgetAlerts(newBudget); // Check alerts for the newly added budget
  return newBudget;
};

// Update a budget
const updateBudget = (id, updates) => {
  const index = budgets.findIndex(budget => budget.id === id);
  if (index >= 0) {
    const updatedBudget = {
      ...budgets[index],
      ...updates
    };
    budgets[index] = updatedBudget;
    // Re-check for alerts after update
    checkBudgetAlerts(budgets[index]);
    return budgets[index];
  }
  return null;
};

// Delete a budget
const deleteBudget = (id) => {
  const index = budgets.findIndex(budget => budget.id === id);
  if (index >= 0) {
    const deletedBudget = budgets[index];
    budgets = budgets.filter(budget => budget.id !== id);
    return deletedBudget;
  }
  return null;
};

// Add a transaction to budget history
const addBudgetTransaction = (budgetId, transaction) => {
  const budget = getBudgetById(budgetId);
  if (!budget) {
    throw new Error(`Budget with ID ${budgetId} not found.`);
  }

  if (typeof transaction.amount !== 'number' || transaction.amount <= 0) {
    throw new Error('Transaction amount must be a positive number.');
  }
  if (!transaction.description) {
    throw new Error('Transaction description is required.');
  }

  const newTransaction = {
    date: transaction.date || new Date().toISOString().split('T')[0],
    amount: transaction.amount,
    description: transaction.description
  };

  const updatedBudget = {
    ...budget,
    spent: budget.spent + transaction.amount,
    history: [...(budget.history || []), newTransaction]
  };

  return updateBudget(budgetId, updatedBudget);
};

// Generate budget forecast
const generateBudgetForecast = (budgetId, months = 3) => {
  const budget = getBudgetById(budgetId);
  if (!budget || !budget.history) return null; // History might be empty, but budget should exist

  // Calculate monthly average spending based on history
  const totalSpent = budget.spent;
  const startDate = new Date(budget.startDate);
  const endDate = new Date(budget.endDate);

  // Calculate duration in months (inclusive of start and end month)
  const budgetDurationMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
                                (endDate.getMonth() - startDate.getMonth()) + 1;

  const monthlyAverage = budgetDurationMonths > 0 ? totalSpent / budgetDurationMonths : 0;

  // Calculate burn rate (percentage of allocated budget spent per month)
  const burnRatePerMonth = budget.allocated > 0 ? (monthlyAverage / budget.allocated) * 100 : 0;

  // Project spending for future months
  const forecast = [];
  const now = new Date();
  
  for (let i = 0; i < months; i++) {
    const projectedDate = new Date(now.getFullYear(), now.getMonth() + i, 15); // Project from current month
    const projectedSpending = monthlyAverage;
    
    forecast.push({
      period: `${projectedDate.toLocaleString('default', { month: 'short' })} ${projectedDate.getFullYear()}`,
      projectedSpending,
      cumulativeSpending: budget.spent + (projectedSpending * (i + 1))
    });
  }
  
  let monthsToDepletion = 0;
  if (budget.spent < budget.allocated && monthlyAverage > 0) {
    monthsToDepletion = ((budget.allocated - budget.spent) / monthlyAverage).toFixed(1);
  } else if (budget.spent >= budget.allocated) {
    monthsToDepletion = 0; // Already overspent or exactly spent
  } else if (monthlyAverage === 0) {
    monthsToDepletion = Infinity; // No spending, so it will never deplete (theoretically)
  }

  return {
    budgetId,
    department: budget.department,
    currentPeriod: budget.period,
    allocated: budget.allocated,
    spent: budget.spent,
    remaining: budget.allocated - budget.spent,
    burnRatePerMonth,
    monthsToDepletion,
    forecast
  };
};

// Export budget data to CSV format
const exportBudgetToCsv = (budgetId) => {
  const budget = getBudgetById(budgetId);
  if (!budget) return null;

  // Build header
  let csv = 'Department,Period,Allocated,Spent,Remaining,Status,Start Date,End Date\n'

  // Add budget row
  const remaining = budget.allocated - budget.spent;
  csv += `${budget.department},${budget.period},${budget.allocated},${budget.spent},${remaining},${budget.status},${budget.startDate},${budget.endDate}\n\n`;

  // Add transactions section
  if (budget.history && budget.history.length > 0) {
    csv += 'Transaction History\n';
    csv += 'Date,Amount,Description\n';

    budget.history.forEach(transaction => {
      // Ensure description is quoted to handle commas within the text
      csv += `${transaction.date},${transaction.amount},"${transaction.description}"\n`;
    });
  }

  return csv;
};

// Export all budgets to CSV
const exportAllBudgetsToCsv = () => {
  if (budgets.length === 0) return null;

  // Build header
  let csv = 'Department,Period,Allocated,Spent,Remaining,Status,Start Date,End Date\n'

  // Add budget rows
  budgets.forEach(budget => {
    const remaining = budget.allocated - budget.spent;
    csv += `${budget.department},${budget.period},${budget.allocated},${budget.spent},${remaining},${budget.status},${budget.startDate},${budget.endDate}\n`;
  });

  return csv;
};

// Check for budget alerts (e.g., overspending)
const checkBudgetAlerts = (budget) => {
  if (budget.allocated <= 0) return; // Prevent division by zero if allocated is 0 or negative

  const spentPercentage = (budget.spent / budget.allocated) * 100;

  if (spentPercentage > 100) {
    addAlert({
      type: ALERT_TYPES.BUDGET,
      priority: ALERT_PRIORITIES.CRITICAL,
      title: 'Budget Overspent',
      message: `${budget.department} has overspent their budget for ${budget.period}.`,
      details: `Allocated: ${budget.allocated}, Spent: ${budget.spent}. Overspent by ${budget.spent - budget.allocated}.`,
      resourceId: budget.id,
      resourceType: 'budget',
      actionRequired: true,
      actionPath: `/budget/details/${budget.id}`
    });
  } else if (spentPercentage > 90) {
    addAlert({
      type: ALERT_TYPES.BUDGET,
      priority: ALERT_PRIORITIES.WARNING,
      title: 'Budget Threshold Warning',
      message: `${budget.department} is approaching their budget limit for ${budget.period}.`,
      details: `Allocated: ${budget.allocated}, Spent: ${budget.spent}. ${spentPercentage.toFixed(1)}% spent.`,
      resourceId: budget.id,
      resourceType: 'budget',
      actionRequired: false,
      actionPath: `/budget/details/${budget.id}`
    });
  }
};

// Get budget statistics
const getBudgetStatistics = () => {
  const totalAllocated = budgets.reduce((sum, budget) => sum + budget.allocated, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const overallSpentPercentage = totalAllocated === 0 ? 0 : (totalSpent / totalAllocated) * 100;

  // Budgets by department
  const departmentStats = {};
  budgets.forEach(budget => {
    if (!departmentStats[budget.department]) {
      departmentStats[budget.department] = {
        allocated: 0,
        spent: 0,
        count: 0
      };
    }
    departmentStats[budget.department].allocated += budget.allocated;
    departmentStats[budget.department].spent += budget.spent;
    departmentStats[budget.department].count++;
  });

  // Budgets by period
  const periodStats = {};
  budgets.forEach(budget => {
    if (!periodStats[budget.period]) {
      periodStats[budget.period] = {
        allocated: 0,
        spent: 0,
        count: 0
      };
    }
    periodStats[budget.period].allocated += budget.allocated;
    periodStats[budget.period].spent += budget.spent;
    periodStats[budget.period].count++;
  });

  // Calculate trends
  const previousPeriodSpending = {};
  const currentYearQuarters = ['2025 Q1', '2025 Q2', '2025 Q3', '2025 Q4'];
  
  // Get spending by quarter
  currentYearQuarters.forEach(quarter => {
    const quarterBudgets = budgets.filter(b => b.period === quarter);
    previousPeriodSpending[quarter] = quarterBudgets.reduce((sum, budget) => sum + budget.spent, 0);
  });

  return {
    totalBudgets: budgets.length,
    totalAllocated,
    totalSpent,
    overallSpentPercentage,
    byDepartment: Object.entries(departmentStats).map(([dept, stats]) => ({ department: dept, ...stats })),
    byPeriod: Object.entries(periodStats).map(([period, stats]) => ({ period, ...stats })),
    trends: {
      quarterlySpending: previousPeriodSpending
    }
  };
};

// Get unique departments list
const getDepartmentsList = () => {
  const departments = new Set();
  budgets.forEach(budget => departments.add(budget.department));
  return Array.from(departments);
};

// Get unique periods list
const getPeriodsList = () => {
  const periods = new Set();
  budgets.forEach(budget => periods.add(budget.period));
  return Array.from(periods);
};

export {
  getBudgets,
  getFilteredBudgets,
  getBudgetById,
  addBudget,
  updateBudget,
  deleteBudget,
  getBudgetStatistics,
  checkBudgetAlerts,
  addBudgetTransaction,
  generateBudgetForecast,
  exportBudgetToCsv,
  exportAllBudgetsToCsv,
  getDepartmentsList,
  getPeriodsList
};
