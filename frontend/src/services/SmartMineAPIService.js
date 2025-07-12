import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

class SmartMineAPIService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for logging
    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('❌ API Response Error:', error.response?.status, error.message);
        return Promise.reject(error);
      }
    );
  }

  // System status endpoints
  async getSystemStatus() {
    try {
      const response = await this.client.get('/status');
      return response.data;
    } catch (error) {
      console.error('Failed to get system status:', error);
      throw error;
    }
  }

  async getStreamingStatus() {
    try {
      const response = await this.client.get('/streaming-status');
      return response.data;
    } catch (error) {
      console.error('Failed to get streaming status:', error);
      throw error;
    }
  }

  // Data endpoints
  async getCurrentData() {
    try {
      const response = await this.client.get('/current-data');
      return response.data;
    } catch (error) {
      console.error('Failed to get current data:', error);
      throw error;
    }
  }

  async getHistoricalData(params = {}) {
    try {
      const response = await this.client.get('/historical-data', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to get historical data:', error);
      throw error;
    }
  }

  // ML predictions
  async getPredictions(data = null) {
    try {
      const response = await this.client.post('/predictions', data);
      return response.data;
    } catch (error) {
      console.error('Failed to get predictions:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.client.get('/status');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  // Test connection
  async testConnection() {
    try {
      const status = await this.getSystemStatus();
      const streaming = await this.getStreamingStatus();
      
      return {
        connected: true,
        status,
        streaming,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        connected: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

// Create a singleton instance
const apiService = new SmartMineAPIService();

export default apiService;
