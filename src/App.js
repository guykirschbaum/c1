import React, { useEffect, useState } from 'react';
import AdUnit from './components/AdUnit';
import StandaloneAdUnit from './components/StandaloneAdUnit';
import PrebidManager from './components/PrebidManager';
import AdServerManager from './components/AdServerManager';
import OpenAIPrompt from './components/OpenAIPrompt';
import './App.css';

function App() {
  const [prebidReady, setPrebidReady] = useState(false);
  const [adServerReady, setAdServerReady] = useState(false);
  const [aiResponse, setAiResponse] = useState('');

  useEffect(() => {
    // Initialize both Prebid and standalone ad server
    PrebidManager.init(() => {
      setPrebidReady(true);
    });
    
    AdServerManager.init(() => {
      setAdServerReady(true);
    });
  }, []);

  // This function handles AI responses
  const handleAIResponse = (response) => {
    setAiResponse(response);
    console.log('AI Response received:', response);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 Prebid React App with AI Integration</h1>
        <p>A demonstration of Prebid.js integration with OpenAI</p>
      </header>
      
      <main className="App-main">
        <section className="content-section">
          <h2>Welcome to our AI-Enhanced Ad Platform!</h2>
          <p>
            This is a sample React application that demonstrates how to integrate 
            Prebid.js for header bidding with AI capabilities. Ask the AI assistant 
            questions about advertising and technology.
          </p>
        </section>

        <section className="ai-section">
          <OpenAIPrompt onResponse={handleAIResponse} />
        </section>

        <section className="ad-section">
          <h3>Prebid.js Advertisement</h3>
          {prebidReady ? (
            <AdUnit 
              adUnitCode="div-gpt-ad-1234567890-0"
              sizes={[[300, 250], [320, 50]]}
              title="Banner Ad"
            />
          ) : (
            <div className="ad-placeholder">Loading advertisement...</div>
          )}
        </section>

        <section className="ad-section">
          <h3>Standalone Ad Server Advertisement</h3>
          {adServerReady ? (
            <StandaloneAdUnit 
              adUnitCode="standalone-ad-1"
              sizes={[[300, 250], [320, 50]]}
              title="Banner Ad"
            />
          ) : (
            <div className="ad-placeholder">Loading advertisement...</div>
          )}
        </section>

        <section className="content-section">
          <h2>More Content</h2>
          <p>
            This section shows how ads can be integrated naturally within your content.
            Prebid.js helps maximize ad revenue by allowing multiple demand sources 
            to compete for your ad inventory in real-time.
          </p>
        </section>

        <section className="ad-section">
          <h3>Prebid.js Leaderboard Advertisement</h3>
          {prebidReady ? (
            <AdUnit 
              adUnitCode="div-gpt-ad-1234567890-1"
              sizes={[[728, 90], [320, 50]]}
              title="Leaderboard Ad"
            />
          ) : (
            <div className="ad-placeholder">Loading advertisement...</div>
          )}
        </section>

        <section className="ad-section">
          <h3>Standalone Ad Server Leaderboard</h3>
          {adServerReady ? (
            <StandaloneAdUnit 
              adUnitCode="standalone-ad-2"
              sizes={[[728, 90], [320, 50]]}
              title="Leaderboard Ad"
            />
          ) : (
            <div className="ad-placeholder">Loading advertisement...</div>
          )}
        </section>

        <section className="content-section">
          <h2>Features</h2>
          <ul>
            <li>✅ Prebid.js integration for header bidding</li>
            <li>✅ Standalone ad server integration</li>
            <li>✅ OpenAI-powered AI assistant</li>
            <li>✅ React components for ad management</li>
            <li>✅ Responsive ad units</li>
            <li>✅ Test bidder configuration</li>
            <li>✅ Clean, modern UI</li>
          </ul>
        </section>
      </main>

      <footer className="App-footer">
        <p>© 2024 Prebid React Demo App with AI Integration</p>
      </footer>
    </div>
  );
}

export default App;
