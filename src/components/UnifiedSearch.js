import React, { useState } from 'react';

const UnifiedSearch = ({ onResponse }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPaper, setSelectedPaper] = useState(null);

  // Mock academic papers data
  const mockPapers = [
    {
      id: 1,
      title: "Machine Learning Applications in Educational Technology",
      authors: "Smith, J., Johnson, A., Williams, B.",
      journal: "Journal of Educational Technology",
      year: 2024,
      abstract: "This paper explores the integration of machine learning algorithms in educational platforms to enhance student learning outcomes...",
      doi: "10.1234/jet.2024.001",
      citations: 45
    },
    {
      id: 2,
      title: "The Impact of Digital Libraries on Academic Research",
      authors: "Brown, C., Davis, E., Miller, F.",
      journal: "Information Science Quarterly",
      year: 2023,
      abstract: "A comprehensive study of how digital libraries have transformed the way students and researchers access academic resources...",
      doi: "10.1234/isq.2023.002",
      citations: 32
    },
    {
      id: 3,
      title: "Open Access Publishing: Trends and Challenges",
      authors: "Garcia, H., Rodriguez, I., Martinez, J.",
      journal: "Academic Publishing Review",
      year: 2024,
      abstract: "Analysis of the growing trend towards open access publishing and its implications for academic institutions...",
      doi: "10.1234/apr.2024.003",
      citations: 28
    },
    {
      id: 4,
      title: "Citation Analysis in Modern Academic Research",
      authors: "Taylor, K., Anderson, L., Wilson, M.",
      journal: "Research Methodology Today",
      year: 2023,
      abstract: "Examination of citation patterns and their impact on research visibility and academic reputation...",
      doi: "10.1234/rmt.2023.004",
      citations: 67
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError('');
    setAiResponse('');
    setSearchResults([]);
    setSelectedPaper(null);

    // Use AI to search and analyze academic papers
    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Search for academic papers and research related to: ${searchQuery.trim()}. Provide a comprehensive analysis of the topic, including key research areas, recent developments, and potential papers that might be relevant.`,
          maxTokens: 300
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAiResponse(data.response);
        if (onResponse) {
          onResponse(data.response);
        }
        
        // Also show some mock papers related to the search
        setTimeout(() => {
          const filteredPapers = mockPapers.filter(paper =>
            paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            paper.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
            paper.abstract.toLowerCase().includes(searchQuery.toLowerCase())
          );
          
          setSearchResults(filteredPapers);
        }, 500);
      } else {
        setError(data.error || 'Failed to get AI response');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Network error. Please try again.');
    }

    setIsLoading(false);
  };

  const handlePaperSelect = (paper) => {
    setSelectedPaper(paper);
    if (onResponse) {
      onResponse(`Selected paper: "${paper.title}" by ${paper.authors} (${paper.year}). This paper has ${paper.citations} citations and is published in ${paper.journal}.`);
    }
  };

  const clearResults = () => {
    setSearchQuery('');
    setSearchResults([]);
    setAiResponse('');
    setError('');
    setSelectedPaper(null);
  };

  const getPlaceholderText = () => {
    return "Ask AI to search for academic papers and research... (e.g., 'machine learning applications', 'climate change research', 'recent developments in AI')";
  };

  return (
    <div className="unified-search-container">
      <div className="search-header">
        <h3>🔍 AI-Powered Academic Search</h3>
        <p>Ask AI to find and analyze academic papers and research</p>
      </div>

      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-group">
          <textarea
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={getPlaceholderText()}
            className="search-input"
            rows="3"
            disabled={isLoading}
          />
        </div>
        <div className="button-group">
          <button 
            type="submit" 
            disabled={isLoading || !searchQuery.trim()}
            className="submit-button"
          >
            {isLoading ? '🔍 Searching...' : '🤖 Ask AI'}
          </button>
          {aiResponse && (
            <button 
              type="button" 
              onClick={() => {
                if (window.koah && typeof window.koah.process === 'function') {
                  try {
                    const result = window.koah.process(searchQuery, aiResponse, 'prefix');
                    console.log('Koha process called with:', { searchQuery, aiResponse });
                    console.log('Koha process result:', result);
                    
                    // Show alert with the result
                    if (result) {
                      alert(`Koha Process Result:\n\n${JSON.stringify(result, null, 2)}`);
                    } else {
                      alert('Koha process completed successfully!');
                    }
                  } catch (error) {
                    console.error('Error calling Koha process:', error);
                    alert(`Error calling Koha process: ${error.message}`);
                  }
                } else {
                  console.warn('Koha not available or process function not found');
                  alert('Koha AI is not available. Please check if the script is loaded.');
                }
              }}
              className="koha-button"
              disabled={!aiResponse}
            >
              📚 Process with Koha
            </button>
          )}
          {(aiResponse || searchResults.length > 0 || error) && (
            <button 
              type="button" 
              onClick={clearResults}
              className="clear-button"
            >
              Clear
            </button>
          )}
        </div>
      </form>
      
      <div className="c1-ad1"></div>

      {isLoading && (
        <div className="loading-message">
          <div className="spinner"></div>
          <p>AI is analyzing your query and searching academic databases...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {aiResponse && (
        <div className="ai-response">
          <div className="response-header">
            <strong>🎯 AI Response:</strong>
          </div>
          <div className="response-content">
            {aiResponse}
          </div>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="search-results">
          <h4>📖 Search Results ({searchResults.length} papers found)</h4>
          <div className="papers-list">
            {searchResults.map((paper) => (
              <div 
                key={paper.id} 
                className={`paper-item ${selectedPaper?.id === paper.id ? 'selected' : ''}`}
                onClick={() => handlePaperSelect(paper)}
              >
                <div className="paper-header">
                  <h5 className="paper-title">{paper.title}</h5>
                  <span className="paper-year">{paper.year}</span>
                </div>
                <p className="paper-authors">{paper.authors}</p>
                <p className="paper-journal">{paper.journal}</p>
                <p className="paper-abstract">{paper.abstract.substring(0, 150)}...</p>
                <div className="paper-meta">
                  <span className="paper-doi">DOI: {paper.doi}</span>
                  <span className="paper-citations">📊 {paper.citations} citations</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {searchQuery && !isLoading && searchResults.length === 0 && (
        <div className="no-results">
          <p>No papers found for "{searchQuery}". Try different keywords or check your spelling.</p>
        </div>
      )}

      {selectedPaper && (
        <div className="selected-paper">
          <h4>📋 Selected Paper Details</h4>
          <div className="paper-details">
            <h5>{selectedPaper.title}</h5>
            <p><strong>Authors:</strong> {selectedPaper.authors}</p>
            <p><strong>Journal:</strong> {selectedPaper.journal}</p>
            <p><strong>Year:</strong> {selectedPaper.year}</p>
            <p><strong>DOI:</strong> {selectedPaper.doi}</p>
            <p><strong>Citations:</strong> {selectedPaper.citations}</p>
            <p><strong>Abstract:</strong> {selectedPaper.abstract}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedSearch; 