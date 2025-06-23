// procurementOptimizationService.js
// Service for AI-driven procurement optimization recommendations

import axios from 'axios';

const AI_API_BASE = '/api/ai';

/**
 * Get optimized procurement suggestions based on vendor performance and cost data.
 * @param {Object} payload - Procurement context, including vendor history and budget constraints.
 * @returns {Promise<Object>} Optimization results with vendor recommendations.
 */
export async function optimizeProcurement(payload) {
  try {
    const response = await axios.post(`${AI_API_BASE}/procurement-optimization`, payload);
    return response.data;
  } catch (error) {
    console.error('Procurement Optimization API error:', error);
    throw error;
  }
}

export default { optimizeProcurement };
