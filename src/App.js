import React, { useState, useEffect } from 'react';
import OpenAIPrompt from './components/OpenAIPrompt';
import AdUnit from './components/AdUnit';
import PrebidManager from './components/PrebidManager';
import './App.css';

// Mock academic search results
const mockResults = [
  {
    title: 'Deep Learning for Natural Language Processing',
    authors: 'Jane Smith, John Doe',
    journal: 'Journal of AI Research',
    year: 2022,
    abstract: 'This paper explores the latest advances in deep learning for NLP, including transformer architectures and large language models.'
  },
  {
    title: 'A Survey on Graph Neural Networks',
    authors: 'Alice Johnson, Bob Lee',
    journal: 'IEEE Transactions on Neural Networks',
    year: 2021,
    abstract: 'We provide a comprehensive survey of graph neural networks and their applications in various domains.'
  },
  {
    title: 'Quantum Computing: An Introduction',
    authors: 'Emily Zhang',
    journal: 'Nature Reviews Physics',
    year: 2023,
    abstract: 'An accessible introduction to quantum computing, its principles, and potential impact on cryptography and optimization.'
  }
];

function App() {
  const [results, setResults] = useState([]);
  const [aiArticle, setAiArticle] = useState(null);

  useEffect(() => {
    // Inject Koha AI script if not already present
    const scriptId = 'koha-ai-sdk';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.src = 'https://app.koah.ai/js?token=719dbff7-8ba3-4843-a4e2-c3865b3f294b';
      document.head.appendChild(script);
    }
    PrebidManager.init(() => {});
  }, []);

  // Handle search (AI response)
  const handleSearch = (aiResponse, searchQuery) => {
    setAiArticle({
      title: 'AI-Generated Article',
      authors: 'AI Assistant',
      journal: 'AI Response',
      year: new Date().getFullYear(),
      abstract: aiResponse
    });
    setResults(mockResults);
    if (window.koah && typeof window.koah.process === 'function') {
      window.koah.process(searchQuery, aiResponse, 'prefix');
    }
  };

  return (
    <div className="App">
      {/* Top Banner Ad */}
      <div className="banner-ad top-banner">
        <AdUnit adUnitCode="top-banner" sizes={[[970, 250], [970, 90], [728, 90], [468, 60], [320, 50]]} title="Top Banner Ad" />
      </div>

      <header className="App-header">
        <h1>Academic Articles & Papers Search Engine</h1>
        <p>Find scholarly articles, papers, and research with AI-powered search.</p>
      </header>

      <main className="App-main">
        <section className="search-section">
          <OpenAIPrompt 
            onResponse={handleSearch} 
            placeholder="Search for articles, papers, authors, or topics…"
            label="Search Academic Articles & Papers"
          />
        </section>

        <section className="results-section">
          {(aiArticle || results.length > 0) && (
            <>
              <h2>Search Results</h2>
              <div className="results-list">
                {aiArticle && (
                  <div className="result-card ai-article">
                    <h3>{aiArticle.title}</h3>
                    <div className="result-meta">
                      <span>{aiArticle.authors}</span> | <span>{aiArticle.journal}</span> | <span>{aiArticle.year}</span>
                    </div>
                    <p className="result-abstract">{aiArticle.abstract}</p>
                  </div>
                )}
                {results.map((result, idx) => (
                  <div className="result-card" key={idx}>
                    <h3>{result.title}</h3>
                    <div className="result-meta">
                      <span>{result.authors}</span> | <span>{result.journal}</span> | <span>{result.year}</span>
                    </div>
                    <p className="result-abstract">{result.abstract}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      {/* Bottom Banner Ad */}
      <div className="banner-ad bottom-banner">
        <AdUnit adUnitCode="bottom-banner" sizes={[[970, 250], [970, 90], [728, 90], [468, 60], [320, 50]]} title="Bottom Banner Ad" />
      </div>

      <div className="c1-ad1"></div>

      <footer className="App-footer">
        <p>© 2024 Academic Search Engine. Powered by AI.</p>
      </footer>
    </div>
  );
}

export default App;
