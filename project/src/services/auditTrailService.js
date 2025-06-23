// Audit Trail Service - Records and manages audit logs for all system activities
// Part of SAMS™ Milestone 2: Core Compliance Engine

import { generateId } from '../utils/helpers';

// Stores all audit trail entries
let auditTrail = [];

// Event types for audit trail
const EVENT_TYPES = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  DOWNLOAD: 'DOWNLOAD',
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
  VIEW: 'VIEW',
  COMPLIANCE_ISSUE: 'COMPLIANCE_ISSUE',
  ALERT_GENERATED: 'ALERT_GENERATED',
  SYSTEM: 'SYSTEM'
};

// Initialize with demo data
const initializeDemo = () => {
  const demoAuditTrail = [
    {
      id: generateId(),
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      userId: 'admin123',
      userName: 'System Administrator',
      eventType: EVENT_TYPES.LOGIN,
      resourceType: 'auth',
      resourceId: null,
      details: 'User login successful',
      ipAddress: '192.168.1.10'
    },
    {
      id: generateId(),
      timestamp: new Date(Date.now() - 85400000).toISOString(),
      userId: 'admin123',
      userName: 'System Administrator',
      eventType: EVENT_TYPES.CREATE,
      resourceType: 'user',
      resourceId: 'user456',
      details: 'Created new user: Finance Manager',
      ipAddress: '192.168.1.10'
    },
    {
      id: generateId(),
      timestamp: new Date(Date.now() - 76400000).toISOString(),
      userId: 'admin123',
      userName: 'System Administrator',
      eventType: EVENT_TYPES.LOGOUT,
      resourceType: 'auth',
      resourceId: null,
      details: 'User logged out',
      ipAddress: '192.168.1.10'
    },
    {
      id: generateId(),
      timestamp: new Date(Date.now() - 65400000).toISOString(),
      userId: 'auditor123',
      userName: 'Chief Auditor',
      eventType: EVENT_TYPES.LOGIN,
      resourceType: 'auth',
      resourceId: null,
      details: 'User login successful',
      ipAddress: '192.168.1.15'
    },
    {
      id: generateId(),
      timestamp: new Date(Date.now() - 64400000).toISOString(),
      userId: 'auditor123',
      userName: 'Chief Auditor',
      eventType: EVENT_TYPES.VIEW,
      resourceType: 'transaction',
      resourceId: 'TRX-002',
      details: 'Viewed transaction details',
      ipAddress: '192.168.1.15'
    },
    {
      id: generateId(),
      timestamp: new Date(Date.now() - 63400000).toISOString(),
      userId: 'auditor123',
      userName: 'Chief Auditor',
      eventType: EVENT_TYPES.COMPLIANCE_ISSUE,
      resourceType: 'transaction',
      resourceId: 'TRX-002',
      details: 'Flagged potential irregular expenditure',
      ipAddress: '192.168.1.15'
    },
    {
      id: generateId(),
      timestamp: new Date(Date.now() - 43400000).toISOString(),
      userId: 'manager123',
      userName: 'Finance Manager',
      eventType: EVENT_TYPES.LOGIN,
      resourceType: 'auth',
      resourceId: null,
      details: 'User login successful',
      ipAddress: '192.168.1.20'
    },
    {
      id: generateId(),
      timestamp: new Date(Date.now() - 42400000).toISOString(),
      userId: 'manager123',
      userName: 'Finance Manager',
      eventType: EVENT_TYPES.APPROVE,
      resourceType: 'transaction',
      resourceId: 'TRX-001',
      details: 'Approved IT equipment purchase',
      ipAddress: '192.168.1.20'
    },
    {
      id: generateId(),
      timestamp: new Date(Date.now() - 22400000).toISOString(),
      userId: 'clerk123',
      userName: 'Finance Clerk',
      eventType: EVENT_TYPES.LOGIN,
      resourceType: 'auth',
      resourceId: null,
      details: 'User login successful',
      ipAddress: '192.168.1.25'
    },
    {
      id: generateId(),
      timestamp: new Date(Date.now() - 21400000).toISOString(),
      userId: 'clerk123',
      userName: 'Finance Clerk',
      eventType: EVENT_TYPES.CREATE,
      resourceType: 'transaction',
      resourceId: 'TRX-004',
      details: 'Created new procurement transaction',
      ipAddress: '192.168.1.25'
    },
    {
      id: generateId(),
      timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
      userId: 'system',
      userName: 'SAMS System',
      eventType: EVENT_TYPES.ALERT_GENERATED,
      resourceType: 'compliance',
      resourceId: 'ALERT-001',
      details: 'Generated critical compliance alert: Procurement above R200,000 without competitive bidding',
      ipAddress: 'localhost'
    }
  ];
  
  auditTrail = demoAuditTrail;
};

// Add a new audit trail entry
const addAuditEntry = (entry) => {
  const newEntry = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    ipAddress: entry.ipAddress || 'unknown',
    ...entry
  };
  
  auditTrail.unshift(newEntry); // Add to the beginning of the array
  return newEntry;
};

// Get audit trail entries with optional filtering
const getAuditTrail = (filters = {}) => {
  let filteredTrail = [...auditTrail];
  
  if (filters.userId) {
    filteredTrail = filteredTrail.filter(entry => entry.userId === filters.userId);
  }
  
  if (filters.eventType) {
    filteredTrail = filteredTrail.filter(entry => entry.eventType === filters.eventType);
  }
  
  if (filters.resourceType) {
    filteredTrail = filteredTrail.filter(entry => entry.resourceType === filters.resourceType);
  }
  
  if (filters.resourceId) {
    filteredTrail = filteredTrail.filter(entry => entry.resourceId === filters.resourceId);
  }
  
  if (filters.startDate) {
    const startDate = new Date(filters.startDate);
    filteredTrail = filteredTrail.filter(entry => new Date(entry.timestamp) >= startDate);
  }
  
  if (filters.endDate) {
    const endDate = new Date(filters.endDate);
    filteredTrail = filteredTrail.filter(entry => new Date(entry.timestamp) <= endDate);
  }
  
  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    filteredTrail = filteredTrail.filter(entry => 
      entry.details.toLowerCase().includes(term) || 
      entry.userName.toLowerCase().includes(term) ||
      (entry.resourceId && entry.resourceId.toLowerCase().includes(term))
    );
  }
  
  // Apply pagination
  if (filters.page && filters.limit) {
    const startIndex = (filters.page - 1) * filters.limit;
    return {
      total: filteredTrail.length,
      entries: filteredTrail.slice(startIndex, startIndex + filters.limit)
    };
  }
  
  return {
    total: filteredTrail.length,
    entries: filteredTrail
  };
};

// Get audit trail for a specific resource
const getResourceAuditTrail = (resourceType, resourceId) => {
  return auditTrail.filter(entry => 
    entry.resourceType === resourceType && entry.resourceId === resourceId
  );
};

// Get audit summary statistics
const getAuditSummary = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayEntries = auditTrail.filter(entry => 
    new Date(entry.timestamp) >= today
  );
  
  const lastWeekDate = new Date(today);
  lastWeekDate.setDate(lastWeekDate.getDate() - 7);
  
  const lastWeekEntries = auditTrail.filter(entry => 
    new Date(entry.timestamp) >= lastWeekDate
  );
  
  const eventTypeBreakdown = {};
  Object.values(EVENT_TYPES).forEach(type => {
    eventTypeBreakdown[type] = auditTrail.filter(entry => entry.eventType === type).length;
  });
  
  const userActivityBreakdown = {};
  auditTrail.forEach(entry => {
    if (!userActivityBreakdown[entry.userId]) {
      userActivityBreakdown[entry.userId] = {
        userId: entry.userId,
        userName: entry.userName,
        count: 0
      };
    }
    userActivityBreakdown[entry.userId].count++;
  });
  
  return {
    totalEntries: auditTrail.length,
    todayEntries: todayEntries.length,
    lastWeekEntries: lastWeekEntries.length,
    eventTypeBreakdown,
    userActivityBreakdown: Object.values(userActivityBreakdown)
  };
};

// Export event types constant
const getEventTypes = () => EVENT_TYPES;

// Initialize demo data
initializeDemo();

export {
  addAuditEntry,
  getAuditTrail,
  getResourceAuditTrail,
  getAuditSummary,
  getEventTypes
};
