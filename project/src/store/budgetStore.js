// Budget Store - Manages budget-related state using Zustand
// Part of SAMS™ Milestone 3: Budget Management System

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  getBudgets, 
  getFilteredBudgets, 
  getBudgetStatistics, 
  getBudgetById,
  addBudget,
  updateBudget,
  deleteBudget,
  addBudgetTransaction,
  generateBudgetForecast,
  exportBudgetToCsv,
  exportAllBudgetsToCsv,
  getDepartmentsList,
  getPeriodsList
} from '../services/budgetService';

export const useBudgetStore = create(
  persist(
    (set, get) => ({
      budgets: [],
      filteredBudgets: [],
      budgetStatistics: null,
      selectedBudget: null,
      budgetForecast: null,
      exportedData: null,
      departmentsList: [],
      periodsList: [],
      budgetFilters: {
        department: null,
        period: null,
        status: null,
        startDate: null,
        endDate: null,
      },

      // Fetch all budgets
      fetchBudgets: () => {
        const budgets = getBudgets();
        const departmentsList = getDepartmentsList();
        const periodsList = getPeriodsList();
        
        set({ 
          budgets,
          filteredBudgets: budgets,
          budgetStatistics: getBudgetStatistics(),
          departmentsList,
          periodsList
        });
        return budgets;
      },

      // Update budget filters
      updateBudgetFilters: (filters) => {
        const newFilters = { ...get().budgetFilters, ...filters };
        const filteredBudgets = getFilteredBudgets(newFilters);
        set({ 
          budgetFilters: newFilters,
          filteredBudgets: filteredBudgets
        });
        return filteredBudgets;
      },

      // Reset budget filters
      resetBudgetFilters: () => {
        const allBudgets = getBudgets();
        set({
          budgetFilters: {
            department: null,
            period: null,
            status: null,
            startDate: null,
            endDate: null,
          },
          filteredBudgets: allBudgets
        });
        return allBudgets;
      },
      
      // Select a budget by ID
      selectBudget: (id) => {
        const budget = getBudgetById(id);
        set({ selectedBudget: budget });
        return budget;
      },
      
      // Create a new budget
      createBudget: (budgetData) => {
        const newBudget = addBudget(budgetData);
        const updatedBudgets = getBudgets();
        const updatedStats = getBudgetStatistics();
        
        set({ 
          budgets: updatedBudgets,
          filteredBudgets: getFilteredBudgets(get().budgetFilters),
          budgetStatistics: updatedStats
        });
        
        return newBudget;
      },
      
      // Update a budget
      updateExistingBudget: (id, updates) => {
        const updatedBudget = updateBudget(id, updates);
        
        if (updatedBudget) {
          const updatedBudgets = getBudgets();
          const updatedStats = getBudgetStatistics();
          
          set({ 
            budgets: updatedBudgets,
            filteredBudgets: getFilteredBudgets(get().budgetFilters),
            budgetStatistics: updatedStats,
            selectedBudget: get().selectedBudget?.id === id ? updatedBudget : get().selectedBudget
          });
        }
        
        return updatedBudget;
      },
      
      // Delete a budget
      removeBudget: (id) => {
        const deletedBudget = deleteBudget(id);
        
        if (deletedBudget) {
          const updatedBudgets = getBudgets();
          const updatedStats = getBudgetStatistics();
          
          set({ 
            budgets: updatedBudgets,
            filteredBudgets: getFilteredBudgets(get().budgetFilters),
            budgetStatistics: updatedStats,
            selectedBudget: get().selectedBudget?.id === id ? null : get().selectedBudget
          });
        }
        
        return deletedBudget;
      },
      
      // Add a transaction to a budget
      addTransaction: (budgetId, transaction) => {
        const updatedBudget = addBudgetTransaction(budgetId, transaction);
        
        if (updatedBudget) {
          const updatedBudgets = getBudgets();
          const updatedStats = getBudgetStatistics();
          
          set({ 
            budgets: updatedBudgets,
            filteredBudgets: getFilteredBudgets(get().budgetFilters),
            budgetStatistics: updatedStats,
            selectedBudget: get().selectedBudget?.id === budgetId ? updatedBudget : get().selectedBudget
          });
        }
        
        return updatedBudget;
      },
      
      // Generate budget forecast
      generateForecast: (budgetId, months = 3) => {
        const forecast = generateBudgetForecast(budgetId, months);
        set({ budgetForecast: forecast });
        return forecast;
      },
      
      // Export budget to CSV
      exportBudget: (budgetId) => {
        const csvData = exportBudgetToCsv(budgetId);
        set({ exportedData: csvData });
        return csvData;
      },
      
      // Export all budgets to CSV
      exportAllBudgets: () => {
        const csvData = exportAllBudgetsToCsv();
        set({ exportedData: csvData });
        return csvData;
      },

      // Initialize store with data
      initialize: () => {
        const budgets = getBudgets();
        const departmentsList = getDepartmentsList();
        const periodsList = getPeriodsList();
        
        set({ 
          budgets,
          filteredBudgets: budgets,
          budgetStatistics: getBudgetStatistics(),
          departmentsList,
          periodsList
        });
      }
    }),
    {      name: 'sams-budget-storage',
      partialize: (state) => ({
        budgetFilters: state.budgetFilters,
      }),
    }
  )
);

export default useBudgetStore;
