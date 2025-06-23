// Compliance Service - Provides compliance rule engine and monitoring functionality
// Part of SAMS™ Milestone 2: Core Compliance Engine

import { generateId } from '../utils/helpers';

// MFMA (Municipal Finance Management Act) and PFMA (Public Finance Management Act) Regulations
const regulations = {
  MFMA: {
    R2_3: {
      id: 'MFMA-R2-3',
      title: 'Supply Chain Management Policy',
      description: 'Municipalities must have and implement a supply chain management policy.',
      severity: 'critical',
      checkFunction: (transaction) => {
        // Check if procurement transaction has reference to SCM policy
        if (transaction.type === 'procurement' && !transaction.scmPolicyReference) {
          return {
            compliant: false,
            message: 'No SCM policy reference found in procurement transaction'
          };
        }
        return { compliant: true };
      }
    },
    R14: {
      id: 'MFMA-R14',
      title: 'Prohibited Expenditure',
      description: 'Municipalities must not incur expenditure that is not authorized in their budget.',
      severity: 'critical',
      checkFunction: (transaction) => {
        // Check if transaction exceeds budget allocation
        if (transaction.amount > transaction.budgetAllocation) {
          return {
            compliant: false,
            message: `Expenditure exceeds budget allocation by R${(transaction.amount - transaction.budgetAllocation).toFixed(2)}`
          };
        }
        return { compliant: true };
      }
    },
    R32: {
      id: 'MFMA-R32',
      title: 'Irregular Expenditure',
      description: 'Expenditure incurred in contravention of or not in accordance with applicable legislation.',
      severity: 'high',
      checkFunction: (transaction) => {
        // Check for potential irregular expenditure markers
        const irregularityMarkers = [
          !transaction.approvalDocuments,
          transaction.singleSourceWithoutJustification,
          transaction.deviationWithoutApproval
        ];
        
        if (irregularityMarkers.some(marker => marker === true)) {
          return {
            compliant: false,
            message: 'Potential irregular expenditure detected'
          };
        }
        return { compliant: true };
      }
    },
    R45: {
      id: 'MFMA-R45',
      title: 'Competitive Bidding',
      description: 'Procurement above R200,000 requires competitive bidding process.',
      severity: 'high',
      checkFunction: (transaction) => {
        if (
          transaction.type === 'procurement' && 
          transaction.amount > 200000 && 
          !transaction.competitiveBiddingCompleted
        ) {
          return {
            compliant: false,
            message: 'Procurement above R200,000 without competitive bidding process'
          };
        }
        return { compliant: true };
      }
    }
  },
  PFMA: {
    R38: {
      id: 'PFMA-R38',
      title: 'General Responsibilities',
      description: 'Accounting officers must ensure effective, efficient and transparent financial management.',
      severity: 'medium',
      checkFunction: (transaction) => {
        // Check for proper documentation and approval
        if (!transaction.approvedBy || !transaction.documentationComplete) {
          return {
            compliant: false,
            message: 'Transaction lacks proper approval or complete documentation'
          };
        }
        return { compliant: true };
      }
    },
    R44: {
      id: 'PFMA-R44',
      title: 'Conflict of Interest',
      description: 'Officials must disclose conflicts of interest in procurement processes.',
      severity: 'critical',
      checkFunction: (transaction) => {
        if (
          transaction.type === 'procurement' && 
          transaction.potentialConflictOfInterest && 
          !transaction.conflictDisclosed
        ) {
          return {
            compliant: false,
            message: 'Undisclosed conflict of interest in procurement process'
          };
        }
        return { compliant: true };
      }
    }
  }
};

// Mock transaction data for development/testing
const mockTransactions = [
  {
    id: 'TRX-001',
    date: '2025-06-10',
    amount: 150000,
    budgetAllocation: 200000,
    description: 'IT Equipment Purchase',
    department: 'Information Technology',
    type: 'procurement',
    approvedBy: 'John Smith',
    documentationComplete: true,
    scmPolicyReference: 'SCM-2025-IT-001',
    competitiveBiddingCompleted: false,
    potentialConflictOfInterest: false,
    status: 'completed'
  },
  {
    id: 'TRX-002',
    date: '2025-06-12',
    amount: 250000,
    budgetAllocation: 200000,
    description: 'Consulting Services',
    department: 'Finance',
    type: 'procurement',
    approvedBy: 'Sarah Johnson',
    documentationComplete: true,
    scmPolicyReference: 'SCM-2025-FIN-002',
    competitiveBiddingCompleted: false,
    potentialConflictOfInterest: false,
    deviationWithoutApproval: true,
    status: 'completed'
  },
  {
    id: 'TRX-003',
    date: '2025-06-15',
    amount: 50000,
    budgetAllocation: 100000,
    description: 'Office Supplies',
    department: 'Administration',
    type: 'procurement',
    approvedBy: 'Robert Brown',
    documentationComplete: false,
    scmPolicyReference: null,
    competitiveBiddingCompleted: false,
    potentialConflictOfInterest: false,
    status: 'completed'
  },
  {
    id: 'TRX-004',
    date: '2025-06-16',
    amount: 350000,
    budgetAllocation: 300000,
    description: 'Municipal Vehicle Purchase',
    department: 'Public Works',
    type: 'procurement',
    approvedBy: 'Thomas Williams',
    documentationComplete: true,
    scmPolicyReference: 'SCM-2025-PW-003',
    competitiveBiddingCompleted: true,
    potentialConflictOfInterest: true,
    conflictDisclosed: false,
    status: 'pending'
  }
];

// Store for compliance issues and alerts
let complianceIssues = [];
let alertsGenerated = [];

// Initialize with some sample data for demo purposes
const initializeDemoData = () => {
  // Analyze mock transactions to generate initial compliance issues
  mockTransactions.forEach(transaction => {
    const issues = analyzeTransaction(transaction);
    if (issues.length > 0) {
      complianceIssues = [...complianceIssues, ...issues];
      
      // Generate alerts for critical and high severity issues
      issues.forEach(issue => {
        if (['critical', 'high'].includes(issue.severity)) {
          generateAlert(issue);
        }
      });
    }
  });
};

// Analyze a transaction for compliance issues
const analyzeTransaction = (transaction) => {
  const issues = [];
  
  // Check against all applicable regulations
  Object.values(regulations).forEach(regulationSet => {
    Object.values(regulationSet).forEach(rule => {
      const result = rule.checkFunction(transaction);
      
      if (!result.compliant) {
        issues.push({
          id: generateId(),
          transactionId: transaction.id,
          date: new Date().toISOString(),
          regulationId: rule.id,
          regulationTitle: rule.title,
          description: rule.description,
          message: result.message,
          severity: rule.severity,
          department: transaction.department,
          amount: transaction.amount,
          status: 'open'
        });
      }
    });
  });
  
  return issues;
};

// Generate an alert for a compliance issue
const generateAlert = (issue) => {
  const alert = {
    id: generateId(),
    issueId: issue.id,
    date: new Date().toISOString(),
    title: `${issue.severity.toUpperCase()} - ${issue.regulationTitle}`,
    message: issue.message,
    transactionId: issue.transactionId,
    severity: issue.severity,
    status: 'unread'
  };
  
  alertsGenerated.push(alert);
  return alert;
};

// Get all compliance issues
const getComplianceIssues = () => {
  return complianceIssues;
};

// Get filtered compliance issues
const getFilteredComplianceIssues = (filters) => {
  let filteredIssues = [...complianceIssues];
  
  if (filters) {
    if (filters.severity) {
      filteredIssues = filteredIssues.filter(issue => 
        issue.severity === filters.severity
      );
    }
    
    if (filters.department) {
      filteredIssues = filteredIssues.filter(issue => 
        issue.department === filters.department
      );
    }
    
    if (filters.status) {
      filteredIssues = filteredIssues.filter(issue => 
        issue.status === filters.status
      );
    }
    
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filteredIssues = filteredIssues.filter(issue => 
        new Date(issue.date) >= fromDate
      );
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      filteredIssues = filteredIssues.filter(issue => 
        new Date(issue.date) <= toDate
      );
    }
  }
  
  return filteredIssues;
};

// Get all alerts
const getAlerts = () => {
  return alertsGenerated;
};

// Get unread alerts count
const getUnreadAlertsCount = () => {
  return alertsGenerated.filter(alert => alert.status === 'unread').length;
};

// Mark alert as read
const markAlertAsRead = (alertId) => {
  const alertIndex = alertsGenerated.findIndex(alert => alert.id === alertId);
  if (alertIndex >= 0) {
    alertsGenerated[alertIndex] = {
      ...alertsGenerated[alertIndex],
      status: 'read'
    };
    return true;
  }
  return false;
};

// Update issue status
const updateIssueStatus = (issueId, newStatus) => {
  const issueIndex = complianceIssues.findIndex(issue => issue.id === issueId);
  if (issueIndex >= 0) {
    complianceIssues[issueIndex] = {
      ...complianceIssues[issueIndex],
      status: newStatus
    };
    return complianceIssues[issueIndex];
  }
  return null;
};

// Add a new transaction and analyze for compliance
const addTransaction = (transaction) => {
  // In a real system, this would be saved to a database
  const newIssues = analyzeTransaction(transaction);
  
  if (newIssues.length > 0) {
    complianceIssues = [...complianceIssues, ...newIssues];
    
    // Generate alerts for critical and high severity issues
    newIssues.forEach(issue => {
      if (['critical', 'high'].includes(issue.severity)) {
        generateAlert(issue);
      }
    });
  }
  
  return {
    transaction,
    complianceIssues: newIssues
  };
};

// Initialize the demo data
initializeDemoData();

export {
  getComplianceIssues,
  getFilteredComplianceIssues,
  getAlerts,
  getUnreadAlertsCount,
  markAlertAsRead,
  updateIssueStatus,
  addTransaction,
  analyzeTransaction,
  mockTransactions
};
