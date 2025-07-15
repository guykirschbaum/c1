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

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Prebid React App with OpenAI integration is ready!');
  console.log('OpenAI API Key configured:', process.env.OPENAI_API_KEY ? 'Yes' : 'No');
});
