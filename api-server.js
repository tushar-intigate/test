/**
 * Example Express.js Backend API for WhatsApp Chatbox
 * 
 * To run this server:
 * 1. Install dependencies: npm install express cors
 * 2. Run: node api-server.js
 * 3. Server will run on http://localhost:3000
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Mock database - in production, this would come from a real database
const chatData = {
  options: [
    {
      id: 'product-info',
      number: '1️⃣',
      label: 'Product Info',
      title: 'Product Info',
      content: 'Discover our comprehensive product suite designed to meet your business needs. Learn about features, integrations, and more.',
    },
    {
      id: 'pricing',
      number: '2️⃣',
      label: 'Pricing',
      title: 'Pricing Plans',
      content: 'Choose from flexible pricing options tailored to businesses of all sizes. Compare plans and find what works best for you.',
    },
    {
      id: 'expert',
      number: '3️⃣',
      label: 'Talk to Expert',
      title: 'Talk to Expert',
      content: 'Our team of experts is ready to help. Schedule a consultation to discuss your specific requirements and find the perfect solution.',
    },
  ],
  followUpActions: [
    {
      id: 'schedule',
      label: 'Schedule Call',
      type: 'primary',
    },
    {
      id: 'email',
      label: 'Send Email',
      type: 'secondary',
    },
  ],
  companyInfo: {
    name: 'Your Company Name',
    status: 'typically replies instantly',
    avatar: '👋',
  },
};

/**
 * GET /api/chat-data
 * Returns all chat configuration and options
 */
app.get('/api/chat-data', (req, res) => {
  res.json(chatData);
});

/**
 * GET /api/chat-options
 * Returns only the chat options
 */
app.get('/api/chat-options', (req, res) => {
  res.json(chatData.options);
});

/**
 * GET /api/chat-options/:id
 * Returns a specific option by ID
 */
app.get('/api/chat-options/:id', (req, res) => {
  const option = chatData.options.find(opt => opt.id === req.params.id);
  if (!option) {
    return res.status(404).json({ error: 'Option not found' });
  }
  res.json(option);
});

/**
 * GET /api/company-info
 * Returns company information
 */
app.get('/api/company-info', (req, res) => {
  res.json(chatData.companyInfo);
});

/**
 * GET /api/follow-up-actions
 * Returns follow-up actions
 */
app.get('/api/follow-up-actions', (req, res) => {
  res.json(chatData.followUpActions);
});

/**
 * POST /api/contact
 * Handle contact form submissions
 */
app.post('/api/contact', (req, res) => {
  const { name, email, message, optionId } = req.body;

  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // In production, save to database and send email
  console.log('Contact submission:', { name, email, message, optionId, timestamp: new Date() });

  res.json({ success: true, message: 'Contact submission received' });
});

/**
 * POST /api/schedule-call
 * Handle call scheduling
 */
app.post('/api/schedule-call', (req, res) => {
  const { name, email, preferredTime } = req.body;

  // Validate input
  if (!name || !email || !preferredTime) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // In production, integrate with calendar service
  console.log('Call scheduled:', { name, email, preferredTime, timestamp: new Date() });

  res.json({ success: true, message: 'Call scheduled successfully' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
  console.log(`WhatsApp Chatbox API Server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET  /api/chat-data');
  console.log('  GET  /api/chat-options');
  console.log('  GET  /api/chat-options/:id');
  console.log('  GET  /api/company-info');
  console.log('  GET  /api/follow-up-actions');
  console.log('  POST /api/contact');
  console.log('  POST /api/schedule-call');
  console.log('  GET  /health');
});

module.exports = app;
