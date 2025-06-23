// Alert Service - Manages system alerts and notifications
// Part of SAMS™ Milestone 2: Core Compliance Engine

import { generateId } from '../utils/helpers';

// Alert types
const ALERT_TYPES = {
  COMPLIANCE: 'compliance',
  ANOMALY: 'anomaly',
  BUDGET: 'budget',
  SECURITY: 'security',
  SYSTEM: 'system'
};

// Alert priorities
const ALERT_PRIORITIES = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

// Store for alerts
let alerts = [];

// Initialize with demo data
const initializeDemo = () => {
  const demoAlerts = [
    {
      id: generateId(),
      type: ALERT_TYPES.COMPLIANCE,
      priority: ALERT_PRIORITIES.CRITICAL,
      title: 'Procurement Compliance Violation',
      message: 'Procurement above R200,000 without competitive bidding process',
      details: 'Transaction TRX-002 for R250,000 failed to follow required competitive bidding process.',
      timestamp: new Date(Date.now() - 5400000).toISOString(), // 1.5 hours ago
      read: false,
      resourceId: 'TRX-002',
      resourceType: 'transaction',
      actionRequired: true,
      actionPath: '/compliance/issues/MFMA-R45'
    },
    {
      id: generateId(),
      type: ALERT_TYPES.COMPLIANCE,
      priority: ALERT_PRIORITIES.HIGH,
      title: 'Potential Irregular Expenditure',
      message: 'Transaction detected with deviation without proper approval',
      details: 'Transaction TRX-002 shows evidence of process deviation without documented approval.',
      timestamp: new Date(Date.now() - 5000000).toISOString(),
      read: false,
      resourceId: 'TRX-002',
      resourceType: 'transaction',
      actionRequired: true,
      actionPath: '/compliance/issues/MFMA-R32'
    },
    {
      id: generateId(),
      type: ALERT_TYPES.ANOMALY,
      priority: ALERT_PRIORITIES.HIGH,
      title: 'Spending Anomaly Detected',
      message: 'Unusually high transaction amount for Public Works department',
      details: 'Transaction TRX-007 amount (R420,000) is significantly higher than typical for maintenance category.',
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      read: false,
      resourceId: 'TRX-007',
      resourceType: 'transaction',
      actionRequired: true,
      actionPath: '/anomalies/details/TRX-007'
    },
    {
      id: generateId(),
      type: ALERT_TYPES.COMPLIANCE,
      priority: ALERT_PRIORITIES.HIGH,
      title: 'Undisclosed Conflict of Interest',
      message: 'Potential conflict of interest detected in procurement process',
      details: 'Transaction TRX-004 shows potential conflict of interest that was not properly disclosed.',
      timestamp: new Date(Date.now() - 2400000).toISOString(), // 40 minutes ago
      read: false,
      resourceId: 'TRX-004',
      resourceType: 'transaction',
      actionRequired: true,
      actionPath: '/compliance/issues/PFMA-R44'
    },
    {
      id: generateId(),
      type: ALERT_TYPES.BUDGET,
      priority: ALERT_PRIORITIES.MEDIUM,
      title: 'Budget Threshold Warning',
      message: 'Public Works department approaching budget limit',
      details: 'Public Works department has used 85% of quarterly budget allocation. Review required.',
      timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
      read: true,
      resourceId: 'DEPT-PW',
      resourceType: 'department',
      actionRequired: false,
      actionPath: '/budget/departments/public-works'
    },
    {
      id: generateId(),
      type: ALERT_TYPES.SYSTEM,
      priority: ALERT_PRIORITIES.LOW,
      title: 'Database Maintenance Complete',
      message: 'Scheduled database optimization finished successfully',
      details: 'Routine database maintenance completed at 02:00. Performance improved by 15%.',
      timestamp: new Date(Date.now() - 50400000).toISOString(), // 14 hours ago
      read: true,
      resourceId: null,
      resourceType: 'system',
      actionRequired: false,
      actionPath: null
    }
  ];
  
  alerts = demoAlerts;
};

// Get all alerts
const getAlerts = () => {
  return alerts;
};

// Get filtered alerts
const getFilteredAlerts = (filters) => {
  let filteredAlerts = [...alerts];
  
  if (filters) {
    if (filters.type) {
      filteredAlerts = filteredAlerts.filter(alert => alert.type === filters.type);
    }
    
    if (filters.priority) {
      filteredAlerts = filteredAlerts.filter(alert => alert.priority === filters.priority);
    }
    
    if (filters.read !== undefined) {
      filteredAlerts = filteredAlerts.filter(alert => alert.read === filters.read);
    }
    
    if (filters.actionRequired !== undefined) {
      filteredAlerts = filteredAlerts.filter(alert => alert.actionRequired === filters.actionRequired);
    }
    
    if (filters.resourceType) {
      filteredAlerts = filteredAlerts.filter(alert => alert.resourceType === filters.resourceType);
    }
    
    if (filters.resourceId) {
      filteredAlerts = filteredAlerts.filter(alert => alert.resourceId === filters.resourceId);
    }
    
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filteredAlerts = filteredAlerts.filter(alert => new Date(alert.timestamp) >= fromDate);
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      filteredAlerts = filteredAlerts.filter(alert => new Date(alert.timestamp) <= toDate);
    }
    
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filteredAlerts = filteredAlerts.filter(alert => 
        alert.title.toLowerCase().includes(term) || 
        alert.message.toLowerCase().includes(term) ||
        alert.details.toLowerCase().includes(term)
      );
    }
  }
  
  // Default sort by timestamp (newest first)
  filteredAlerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  return filteredAlerts;
};

// Get alert by ID
const getAlertById = (id) => {
  return alerts.find(alert => alert.id === id);
};

// Add a new alert
const addAlert = (alert) => {
  const newAlert = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    read: false,
    ...alert
  };
  
  alerts.unshift(newAlert);
  return newAlert;
};

// Mark alert as read
const markAlertAsRead = (id) => {
  const alertIndex = alerts.findIndex(alert => alert.id === id);
  if (alertIndex >= 0) {
    alerts[alertIndex] = {
      ...alerts[alertIndex],
      read: true
    };
    return true;
  }
  return false;
};

// Mark all alerts as read
const markAllAlertsAsRead = () => {
  alerts = alerts.map(alert => ({
    ...alert,
    read: true
  }));
  return true;
};

// Delete alert
const deleteAlert = (id) => {
  const alertIndex = alerts.findIndex(alert => alert.id === id);
  if (alertIndex >= 0) {
    const deletedAlert = alerts[alertIndex];
    alerts = alerts.filter(alert => alert.id !== id);
    return deletedAlert;
  }
  return null;
};

// Get alert statistics
const getAlertStatistics = () => {
  const totalAlerts = alerts.length;
  const unreadAlerts = alerts.filter(alert => !alert.read).length;
  const actionRequired = alerts.filter(alert => alert.actionRequired).length;
  
  // Alerts by type
  const typeStats = {};
  Object.values(ALERT_TYPES).forEach(type => {
    typeStats[type] = alerts.filter(alert => alert.type === type).length;
  });
  
  // Alerts by priority
  const priorityStats = {};
  Object.values(ALERT_PRIORITIES).forEach(priority => {
    priorityStats[priority] = alerts.filter(alert => alert.priority === priority).length;
  });
  
  // Recent trend (last 7 days)
  const today = new Date();
  const last7Days = Array(7).fill().map((_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();
  
  const dailyCounts = last7Days.map(date => {
    const dayAlerts = alerts.filter(alert => 
      alert.timestamp.split('T')[0] === date
    );
    return {
      date,
      count: dayAlerts.length
    };
  });
  
  return {
    totalAlerts,
    unreadAlerts,
    actionRequired,
    byType: Object.entries(typeStats).map(([type, count]) => ({ type, count })),
    byPriority: Object.entries(priorityStats).map(([priority, count]) => ({ priority, count })),
    dailyCounts
  };
};

// Initialize demo data
initializeDemo();

export {
  getAlerts,
  getFilteredAlerts,
  getAlertById,
  addAlert,
  markAlertAsRead,
  markAllAlertsAsRead,
  deleteAlert,
  getAlertStatistics
};
