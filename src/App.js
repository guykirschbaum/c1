import React, { useEffect, useState } from 'react';
import AdUnit from './components/AdUnit';
import PrebidManager from './components/PrebidManager';
import './App.css';

function App() {
  const [prebidReady, setPrebidReady] = useState(false);

  useEffect(() => {
    // Initialize Prebid when component mounts
    PrebidManager.init(() => {
      setPrebidReady(true);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 Prebid React App</h1>
        <p>A demonstration of Prebid.js integration with React</p>
      </header>
      
      <main className="App-main">
        <section className="content-section">
          <h2>Welcome to our Ad-Enabled Website!</h2>
          <p>
            This is a sample React application that demonstrates how to integrate 
            Prebid.js for header bidding. The ads below are configured with test 
            bidders to show how the integration works.
          </p>
        </section>

        <section className="ad-section">
          <h3>Advertisement</h3>
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

        <section className="content-section">
          <h2>More Content</h2>
          <p>
            This section shows how ads can be integrated naturally within your content.
            Prebid.js helps maximize ad revenue by allowing multiple demand sources 
            to compete for your ad inventory in real-time.
          </p>
        </section>

        <section className="ad-section">
          <h3>Sidebar Advertisement</h3>
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

        <section className="content-section">
          <h2>Features</h2>
          <ul>
            <li>✅ Prebid.js integration for header bidding</li>
            <li>✅ React components for ad management</li>
            <li>✅ Responsive ad units</li>
            <li>✅ Test bidder configuration</li>
            <li>✅ Clean, modern UI</li>
          </ul>
        </section>
      </main>

      <footer className="App-footer">
        <p>© 2024 Prebid React Demo App</p>
      </footer>
    </div>
  );
}

export default App;