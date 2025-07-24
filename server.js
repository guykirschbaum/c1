const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Standalone Ad Server endpoints
app.post('/api/ads', (req, res) => {
  console.log('[/api/ads] endpoint called with body:', req.body);
  try {
    const { adUnitCode, sizes, targeting } = req.body;
    if (adUnitCode === 'top-banner') {
      // Simulate waterfall: always return direct ad for demo
      return res.json({
        success: true,
        adUnitCode,
        adHtml: `<div style="background:#3949ab;color:#fff;padding:20px;text-align:center;font-size:1.5rem;">My Direct SSP Ad - $2.50 CPM</div>`,
        cpm: 2.50,
        currency: 'USD'
      });
    }
    
    console.log('Ad request received:', { adUnitCode, sizes, targeting });
    
    // Simulate ad server response
    const adResponse = {
      success: true,
      adUnitCode: adUnitCode,
      adHtml: `
        <div style="
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 8px;
          font-family: Arial, sans-serif;
          width: ${sizes[0][0] - 40}px;
          height: ${sizes[0][1] - 40}px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin: 0 auto;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        ">
          <h3 style="margin: 0 0 10px 0; font-size: 18px;">🎯 Server-Side Ad</h3>
          <p style="margin: 0 0 15px 0; font-size: 14px; opacity: 0.9;">
            Served by Express.js Ad Server
          </p>
          <div style="
            background: rgba(255,255,255,0.2);
            padding: 8px;
            border-radius: 4px;
            font-size: 12px;
          ">
            Ad Unit: ${adUnitCode}
          </div>
        </div>
      `,
      adType: 'banner',
      sizes: sizes,
      timestamp: Date.now(),
      cpm: (Math.random() * 5 + 1).toFixed(2),
      currency: 'USD'
    };
    
    // Simulate network delay
    setTimeout(() => {
      res.json(adResponse);
    }, Math.random() * 500 + 200);
    
  } catch (error) {
    console.error('Ad server error:', error);
    res.status(500).json({ 
      error: 'Ad server request failed',
      details: error.message 
    });
  }
});

app.get('/api/ads/config', (req, res) => {
  res.json({
    success: true,
    adServerUrl: process.env.AD_SERVER_URL || 'http://localhost:3000/api/ads',
    publisherId: process.env.PUBLISHER_ID || 'demo-publisher',
    availableAdUnits: [
      {
        code: 'standalone-ad-1',
        sizes: [[300, 250], [320, 50]],
        title: 'Banner Ad',
        type: 'banner'
      },
      {
        code: 'standalone-ad-2',
        sizes: [[728, 90], [320, 50]],
        title: 'Leaderboard Ad',
        type: 'banner'
      }
    ]
  });
});

// OpenAI API endpoint
app.post('/api/openai', async (req, res) => {
  try {
    const { OpenAI } = require('openai');
    
    console.log('OpenAI API request received:', req.body);
    
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not configured');
      return res.status(400).json({ 
        error: 'OpenAI API key not configured. Please set OPENAI_API_KEY in your .env file.' 
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { prompt, maxTokens = 150 } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log('Sending request to OpenAI with prompt:', prompt);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that provides concise and informative responses about advertising, technology, and general topics."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;

    console.log('OpenAI response received:', response);

    res.json({ 
      success: true, 
      response,
      usage: completion.usage 
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ 
      error: 'Failed to process OpenAI request',
      details: error.message 
    });
  }
});

// SSP Demo endpoint for direct ad
app.get('/ssp-demo', (req, res) => {
  res.json({
    ad: '<div style="background:#3949ab;color:#fff;padding:20px;text-align:center;font-size:1.5rem;">Your Direct Demo Ad Here!</div>',
    cpm: 100,
    width: 728,
    height: 90,
    creativeId: 'demo-creative-1',
    currency: 'USD',
    requestId: req.query.requestId || 'demo-request'
  });
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Prebid React App with OpenAI integration is ready!');
  console.log('OpenAI API Key configured:', process.env.OPENAI_API_KEY ? 'Yes' : 'No');
});
