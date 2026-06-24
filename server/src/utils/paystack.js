import axios from 'axios';

const paystackApi = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
});

/**
 * Initialize a Paystack transaction
 * @param {Object} data - Contains email, amount (in kobo), reference
 * @returns {Promise<Object>} Initialization response data
 */
export const initializeTransaction = async (data) => {
  try {
    const response = await paystackApi.post('/transaction/initialize', data);
    return response.data;
  } catch (error) {
    console.error('Paystack Init Error:', error.response?.data || error.message);
    throw new Error('Payment initialization failed');
  }
};

/**
 * Verify a Paystack transaction
 * @param {string} reference - The transaction reference
 * @returns {Promise<Object>} Verification response data
 */
export const verifyTransaction = async (reference) => {
  try {
    const response = await paystackApi.get(`/transaction/verify/${reference}`);
    return response.data;
  } catch (error) {
    console.error('Paystack Verify Error:', error.response?.data || error.message);
    throw new Error('Payment verification failed');
  }
};
