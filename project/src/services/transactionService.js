// Transaction Service - Provides transaction data and monitoring functionality
// Part of SAMS™ Milestone 2: Core Compliance Engine

import { generateId } from '../utils/helpers';

// Mock transaction data for development/testing
const mockTransactions = [
  {
    id: 'TRX-001',
    date: '2025-06-10',
    amount: 150000,
    description: 'IT Equipment Purchase',
    department: 'Information Technology',
    category: 'Equipment',
    reference: 'PO-IT-2025-042',
    approvedBy: 'John Smith',
    status: 'completed',
    paymentMethod: 'Bank Transfer',
    attachments: 2,
    notes: 'Annual hardware refresh',
    vendorName: 'TechSupplies Ltd',
    vendorId: 'VEN-1204'
  },
  {
    id: 'TRX-002',
    date: '2025-06-12',
    amount: 250000,
    description: 'Consulting Services',
    department: 'Finance',
    category: 'Professional Services',
    reference: 'PO-FIN-2025-018',
    approvedBy: 'Sarah Johnson',
    status: 'completed',
    paymentMethod: 'Bank Transfer',
    attachments: 3,
    notes: 'Financial system audit consulting',
    vendorName: 'FinAudit Consulting',
    vendorId: 'VEN-0875'
  },
  {
    id: 'TRX-003',
    date: '2025-06-15',
    amount: 50000,
    description: 'Office Supplies',
    department: 'Administration',
    category: 'Supplies',
    reference: 'PO-ADM-2025-103',
    approvedBy: 'Robert Brown',
    status: 'completed',
    paymentMethod: 'Corporate Card',
    attachments: 1,
    notes: 'Quarterly office supply order',
    vendorName: 'Office Depot',
    vendorId: 'VEN-2356'
  },
  {
    id: 'TRX-004',
    date: '2025-06-16',
    amount: 350000,
    description: 'Municipal Vehicle Purchase',
    department: 'Public Works',
    category: 'Vehicles',
    reference: 'PO-PW-2025-032',
    approvedBy: 'Thomas Williams',
    status: 'pending',
    paymentMethod: 'Bank Transfer',
    attachments: 5,
    notes: 'Purchase of two service vehicles',
    vendorName: 'AutoFleet Solutions',
    vendorId: 'VEN-1987'
  },
  {
    id: 'TRX-005',
    date: '2025-06-17',
    amount: 75000,
    description: 'Training Program',
    department: 'Human Resources',
    category: 'Training',
    reference: 'PO-HR-2025-056',
    approvedBy: 'Jennifer Lee',
    status: 'completed',
    paymentMethod: 'Bank Transfer',
    attachments: 2,
    notes: 'Staff development training program',
    vendorName: 'Pro Training Services',
    vendorId: 'VEN-2104'
  },
  {
    id: 'TRX-006',
    date: '2025-06-17',
    amount: 120000,
    description: 'Software Licenses',
    department: 'Information Technology',
    category: 'Software',
    reference: 'PO-IT-2025-043',
    approvedBy: 'John Smith',
    status: 'pending',
    paymentMethod: 'Bank Transfer',
    attachments: 3,
    notes: 'Annual software license renewal',
    vendorName: 'SoftSolutions Inc',
    vendorId: 'VEN-0654'
  },
  {
    id: 'TRX-007',
    date: '2025-06-18',
    amount: 420000,
    description: 'Road Maintenance',
    department: 'Public Works',
    category: 'Maintenance',
    reference: 'PO-PW-2025-033',
    approvedBy: 'Thomas Williams',
    status: 'pending',
    paymentMethod: 'Bank Transfer',
    attachments: 4,
    notes: 'Emergency road repairs after flooding',
    vendorName: 'RoadWorks Construction',
    vendorId: 'VEN-1276'
  }
];

// Store transactions
let transactions = [...mockTransactions];

// Get all transactions
const getTransactions = () => {
  return transactions;
};

// Get filtered transactions
const getFilteredTransactions = (filters) => {
  let filteredTransactions = [...transactions];
  
  if (filters) {
    if (filters.department) {
      filteredTransactions = filteredTransactions.filter(transaction => 
        transaction.department === filters.department
      );
    }
    
    if (filters.category) {
      filteredTransactions = filteredTransactions.filter(transaction => 
        transaction.category === filters.category
      );
    }
    
    if (filters.status) {
      filteredTransactions = filteredTransactions.filter(transaction => 
        transaction.status === filters.status
      );
    }
    
    if (filters.minAmount) {
      filteredTransactions = filteredTransactions.filter(transaction => 
        transaction.amount >= filters.minAmount
      );
    }
    
    if (filters.maxAmount) {
      filteredTransactions = filteredTransactions.filter(transaction => 
        transaction.amount <= filters.maxAmount
      );
    }
    
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filteredTransactions = filteredTransactions.filter(transaction => 
        new Date(transaction.date) >= fromDate
      );
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      filteredTransactions = filteredTransactions.filter(transaction => 
        new Date(transaction.date) <= toDate
      );
    }
    
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filteredTransactions = filteredTransactions.filter(transaction => 
        transaction.description.toLowerCase().includes(term) || 
        transaction.reference.toLowerCase().includes(term) ||
        transaction.vendorName.toLowerCase().includes(term)
      );
    }
  }
  
  // Apply sorting
  if (filters && filters.sortBy) {
    filteredTransactions.sort((a, b) => {
      const aValue = a[filters.sortBy];
      const bValue = b[filters.sortBy];
      
      // Handle string vs number sorting
      if (typeof aValue === 'string') {
        return filters.sortDir === 'desc' 
          ? bValue.localeCompare(aValue) 
          : aValue.localeCompare(bValue);
      } else {
        return filters.sortDir === 'desc' 
          ? bValue - aValue 
          : aValue - bValue;
      }
    });
  } else {
    // Default sort by date (newest first)
    filteredTransactions.sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
  }
  
  return filteredTransactions;
};

// Get transaction by ID
const getTransactionById = (id) => {
  return transactions.find(transaction => transaction.id === id);
};

// Add a new transaction
const addTransaction = (transaction) => {
  const newTransaction = {
    id: transaction.id || `TRX-${generateId().substring(0, 6)}`,
    date: transaction.date || new Date().toISOString().split('T')[0],
    status: transaction.status || 'pending',
    ...transaction
  };
  
  transactions.unshift(newTransaction);
  return newTransaction;
};

// Update a transaction
const updateTransaction = (id, updates) => {
  const index = transactions.findIndex(transaction => transaction.id === id);
  if (index >= 0) {
    transactions[index] = {
      ...transactions[index],
      ...updates
    };
    return transactions[index];
  }
  return null;
};

// Delete a transaction
const deleteTransaction = (id) => {
  const index = transactions.findIndex(transaction => transaction.id === id);
  if (index >= 0) {
    const deletedTransaction = transactions[index];
    transactions = transactions.filter(transaction => transaction.id !== id);
    return deletedTransaction;
  }
  return null;
};

// Get transaction statistics
const getTransactionStatistics = () => {
  const totalAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const completedAmount = transactions
    .filter(transaction => transaction.status === 'completed')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const pendingAmount = transactions
    .filter(transaction => transaction.status === 'pending')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  
  // Transactions by department
  const departmentStats = {};
  transactions.forEach(transaction => {
    if (!departmentStats[transaction.department]) {
      departmentStats[transaction.department] = {
        count: 0,
        amount: 0
      };
    }
    departmentStats[transaction.department].count++;
    departmentStats[transaction.department].amount += transaction.amount;
  });
  
  // Transactions by category
  const categoryStats = {};
  transactions.forEach(transaction => {
    if (!categoryStats[transaction.category]) {
      categoryStats[transaction.category] = {
        count: 0,
        amount: 0
      };
    }
    categoryStats[transaction.category].count++;
    categoryStats[transaction.category].amount += transaction.amount;
  });
  
  // Transactions over time (last 7 days)
  const today = new Date();
  const last7Days = Array(7).fill().map((_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();
  
  const dailyTotals = last7Days.map(date => {
    const dayTransactions = transactions.filter(t => t.date === date);
    return {
      date,
      count: dayTransactions.length,
      amount: dayTransactions.reduce((sum, t) => sum + t.amount, 0)
    };
  });
  
  return {
    totalTransactions: transactions.length,
    completedTransactions: transactions.filter(t => t.status === 'completed').length,
    pendingTransactions: transactions.filter(t => t.status === 'pending').length,
    totalAmount,
    completedAmount,
    pendingAmount,
    byDepartment: Object.entries(departmentStats).map(([dept, stats]) => ({ 
      department: dept, 
      ...stats 
    })),
    byCategory: Object.entries(categoryStats).map(([category, stats]) => ({ 
      category, 
      ...stats 
    })),
    dailyTotals
  };
};

export {
  getTransactions,
  getFilteredTransactions,
  getTransactionById,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionStatistics
};
