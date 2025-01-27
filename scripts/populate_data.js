const axios = require('axios');
const moment = require('moment');

const features = [
  'account',
  'charges',
  'payments',
  'refunds',
  'disputes'
];

// Generate random test data
const generateTestData = (date) => {
  return {
    datetime: date,
    features: features.map(feature => ({
      type: feature,
      test_cases_count: Math.floor(Math.random() * 50 + 10).toString(),
      status: Math.random() > 0.2 ? 'passed' : 'failed' // 80% pass rate
    }))
  };
};

// Helper function to delay execution
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Find available backend port
const findBackendPort = async () => {
  const ports = [3000, 3001, 3002, 3003];
  
  for (const port of ports) {
    try {
      await axios.get(`http://localhost:${port}/api/results`);
      return port;
    } catch (error) {
      if (error.code !== 'ECONNREFUSED') {
        continue;
      }
    }
  }
  throw new Error('No backend server found on any port');
};

// Populate data for the last 14 days
async function populateData() {
  console.log('🔍 Looking for backend server...');
  
  let backendPort;
  try {
    backendPort = await findBackendPort();
    console.log(`✅ Found backend server on port ${backendPort}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Make sure the backend server is running');
    process.exit(1);
  }

  const backendUrl = `http://localhost:${backendPort}`;
  const today = moment();
  const twoWeeksAgo = moment().subtract(13, 'days');
  
  let currentDate = twoWeeksAgo.clone();
  let successCount = 0;
  let errorCount = 0;
  
  while (currentDate <= today) {
    const dateStr = currentDate.format('DD/MM/YYYY');
    const testData = generateTestData(dateStr);
    
    try {
      const response = await axios.post(`${backendUrl}/api/results`, testData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(`✅ Data sent successfully for ${dateStr} (${response.data.featuresCount} features)`);
      successCount++;
      
      // Add a small delay between requests
      await delay(100);
    } catch (error) {
      console.error(`❌ Error sending data for ${dateStr}:`, error.response?.data?.error || error.message);
      errorCount++;
    }
    
    currentDate.add(1, 'day');
  }
  
  console.log('\n📊 Summary:');
  console.log(`✅ Successfully populated: ${successCount} days`);
  console.log(`❌ Failed to populate: ${errorCount} days`);
  console.log('🎉 Data population completed!');
}

// Make sure the server is running before executing this script
console.log('🚀 Starting data population...\n');
populateData(); 