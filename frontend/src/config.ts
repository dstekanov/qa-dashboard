// Backend configuration
const config = {
  development: {
    backendUrl: 'http://localhost:3000'
  },
  production: {
    // In production, use relative URL since everything is served from the same origin
    backendUrl: '/api'
  }
};

// Get the backend URL based on environment
export const getBackendUrl = async () => {
  const baseUrl = import.meta.env.DEV ? config.development.backendUrl : config.production.backendUrl;
  
  try {
    // Test the connection
    await fetch(`${baseUrl}/results`);
    return baseUrl;
  } catch (error) {
    console.error('Backend not available:', error);
    throw new Error(`Backend server is not available at ${baseUrl}`);
  }
}; 