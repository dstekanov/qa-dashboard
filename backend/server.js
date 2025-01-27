const express = require('express');
const cors = require('cors');
const moment = require('moment');
const DateWindow = require('./DateWindow');

const app = express();
const port = process.env.PORT || 3000;

// Configure CORS to allow requests from any origin during development
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Parse JSON request bodies
app.use(express.json());

// Initialize DateWindow with 14-day window
const testResults = new DateWindow(14);

app.post('/api/results', (req, res) => {
  const { datetime, features } = req.body;
  
  if (!datetime || !features || !Array.isArray(features)) {
    return res.status(400).json({ error: 'Invalid data format' });
  }

  // Add new data and get removed date (if any)
  const removedDate = testResults.add(datetime, features);

  res.json({ 
    message: 'Data saved successfully', 
    datetime, 
    featuresCount: features.length,
    removedDate: removedDate // Include the removed date in response
  });
});

app.get('/api/results', (req, res) => {
  // Return all data in the window
  res.json(testResults.getAllData());
});

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Function to find an available port
const findAvailablePort = async (startPort) => {
  const net = require('net');
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(startPort, () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(findAvailablePort(startPort + 1));
      } else {
        reject(err);
      }
    });
  });
};

// Start the server with port fallback
const startServer = async () => {
  try {
    const availablePort = await findAvailablePort(port);
    app.listen(availablePort, () => {
      console.log(`Server is running on port ${availablePort}`);
      if (availablePort !== port) {
        console.log(`Note: Original port ${port} was in use, using ${availablePort} instead`);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 