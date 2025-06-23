import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getAlerts, markAlertAsRead } from '../services/alertService';
import { getUnreadAlertsCount } from '../services/complianceService';
import { getComplianceIssues, getFilteredComplianceIssues } from '../services/complianceService';
import { getAnomalies, getFilteredAnomalies } from '../services/anomalyDetectionService';
import { getTransactions, getFilteredTransactions } from '../services/transactionService';

// Compliance monitoring store for the application
export const useComplianceStore = create(
  persist(
    (set, get) => ({
      // Alerts
      alerts: [],
      unreadAlertsCount: 0,
      
      // Compliance issues
      complianceIssues: [],
      filteredComplianceIssues: [],
      complianceFilters: {
        severity: null,
        department: null,
        status: null,
        dateFrom: null,
        dateTo: null
      },
      
      // Anomalies
      anomalies: [],
      filteredAnomalies: [],
      anomalyFilters: {
        department: null,
        category: null,
        status: null,
        minScore: null,
        dateFrom: null,
        dateTo: null
      },
      
      // Transactions
      transactions: [],
      filteredTransactions: [],
      transactionFilters: {
        department: null,
        category: null,
        status: null,
        minAmount: null,
        maxAmount: null,
        dateFrom: null,
        dateTo: null,
        searchTerm: null,
        sortBy: 'date',
        sortDir: 'desc'
      },
      
      // Fetch all alerts
      fetchAlerts: () => {
        const alerts = getAlerts();
        const unreadCount = alerts.filter(alert => !alert.read).length;
        set({ 
          alerts, 
          unreadAlertsCount: unreadCount 
        });
        return alerts;
      },
      
      // Mark alert as read
      markAlertAsRead: (alertId) => {
        const success = markAlertAsRead(alertId);
        if (success) {
          set(state => ({ 
            alerts: state.alerts.map(alert => 
              alert.id === alertId 
                ? { ...alert, read: true } 
                : alert
            ),
            unreadAlertsCount: state.unreadAlertsCount - 1
          }));
        }
        return success;
      },
      
      // Fetch compliance issues
      fetchComplianceIssues: () => {
        const complianceIssues = getComplianceIssues();
        set({ 
          complianceIssues,
          filteredComplianceIssues: complianceIssues
        });
        return complianceIssues;
      },
      
      // Update compliance issue filters
      updateComplianceFilters: (filters) => {
        const newFilters = { ...get().complianceFilters, ...filters };
        const filteredIssues = getFilteredComplianceIssues(newFilters);
        set({ 
          complianceFilters: newFilters,
          filteredComplianceIssues: filteredIssues
        });
        return filteredIssues;
      },
      
      // Reset compliance filters
      resetComplianceFilters: () => {
        const allIssues = getComplianceIssues();
        set({
          complianceFilters: {
            severity: null,
            department: null,
            status: null,
            dateFrom: null,
            dateTo: null
          },
          filteredComplianceIssues: allIssues
        });
        return allIssues;
      },
      
      // Fetch anomalies
      fetchAnomalies: () => {
        const anomalies = getAnomalies();
        set({ 
          anomalies,
          filteredAnomalies: anomalies
        });
        return anomalies;
      },
      
      // Update anomaly filters
      updateAnomalyFilters: (filters) => {
        const newFilters = { ...get().anomalyFilters, ...filters };
        const filteredAnomalies = getFilteredAnomalies(newFilters);
        set({ 
          anomalyFilters: newFilters,
          filteredAnomalies: filteredAnomalies
        });
        return filteredAnomalies;
      },
      
      // Reset anomaly filters
      resetAnomalyFilters: () => {
        const allAnomalies = getAnomalies();
        set({
          anomalyFilters: {
            department: null,
            category: null,
            status: null,
            minScore: null,
            dateFrom: null,
            dateTo: null
          },
          filteredAnomalies: allAnomalies
        });
        return allAnomalies;
      },
      
      // Fetch transactions
      fetchTransactions: () => {
        const transactions = getTransactions();
        set({ 
          transactions,
          filteredTransactions: transactions
        });
        return transactions;
      },
      
      // Update transaction filters
      updateTransactionFilters: (filters) => {
        const newFilters = { ...get().transactionFilters, ...filters };
        const filteredTransactions = getFilteredTransactions(newFilters);
        set({ 
          transactionFilters: newFilters,
          filteredTransactions: filteredTransactions
        });
        return filteredTransactions;
      },
      
      // Reset transaction filters
      resetTransactionFilters: () => {
        const allTransactions = getTransactions();
        set({
          transactionFilters: {
            department: null,
            category: null,
            status: null,
            minAmount: null,
            maxAmount: null,
            dateFrom: null,
            dateTo: null,
            searchTerm: null,
            sortBy: 'date',
            sortDir: 'desc'
          },
          filteredTransactions: allTransactions
        });
        return allTransactions;
      },
      
      // Initialize store with data
      initialize: () => {
        const alerts = getAlerts();
        const unreadCount = alerts.filter(alert => !alert.read).length;
        const complianceIssues = getComplianceIssues();
        const anomalies = getAnomalies();
        const transactions = getTransactions();
        
        set({ 
          alerts, 
          unreadAlertsCount: unreadCount,
          complianceIssues,
          filteredComplianceIssues: complianceIssues,
          anomalies,
          filteredAnomalies: anomalies,
          transactions,
          filteredTransactions: transactions
        });
      }
    }),
    {
      name: 'sams-compliance-storage',
      partialize: (state) => ({
        complianceFilters: state.complianceFilters,
        anomalyFilters: state.anomalyFilters,
        transactionFilters: state.transactionFilters
      }),
    }
  )
);
