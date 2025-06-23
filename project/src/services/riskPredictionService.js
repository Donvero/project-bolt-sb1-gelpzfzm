import axios from 'axios';

const AI_API_BASE = '/api/ai';

/**
 * Sends transaction data to AI endpoint to get compliance risk predictions.
 * @param {Object} transactionData - Historical and current transaction records.
 * @returns {Promise<Object>} Predicted risk scores and alerts.
 */
export async function predictRisk(transactionData) {
  try {
    const response = await axios.post(`${AI_API_BASE}/risk-prediction`, transactionData);
    return response.data;
  } catch (error) {
    console.error('Risk Prediction API error:', error);
    throw error;
  }
}

export default { predictRisk };
