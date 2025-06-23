import axios from 'axios';

const AI_API_BASE = '/api/ai';

/**
 * Sends budget data to AI endpoint to get optimization suggestions.
 * @param {Object} budgetData - Historical spending records and current budgets.
 * @returns {Promise<Object>} Optimized budget recommendations.
 */
export async function optimizeBudget(budgetData) {
  try {
    const response = await axios.post(`${AI_API_BASE}/budget-optimization`, budgetData);
    return response.data;
  } catch (error) {
    console.error('Budget Optimization API error:', error);
    throw error;
  }
}  

export default { optimizeBudget };
