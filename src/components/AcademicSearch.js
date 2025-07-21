import React, { useState } from 'react';

const AcademicSearch = ({ onResponse }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const filteredPapers = mockPapers.filter(paper =>
        paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.abstract.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setSearchResults(filteredPapers);
      setIsLoading(false);
    }, 1000);
  };

  const handlePaperSelect = (paper) => {
    setSelectedPaper(paper);
    if (onResponse) {
      onResponse(`Selected paper: "${paper.title}" by ${paper.authors} (${paper.year}). This paper has ${paper.citations} citations and is published in ${paper.journal}.`);
    }
  };

  return (
    <div className="academic-search-container">
      <div className="search-header">
        <h3>📚 Academic Paper Search</h3>
        <p>Find relevant research papers for your studies</p>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for papers, authors, or topics..."
            className="search-input"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={isLoading || !searchQuery.trim()}
            className="search-button"
          >
            {isLoading ? '🔍 Searching...' : '🔍 Search Papers'}
          </button>
        </div>
      </form>

      {isLoading && (
        <div className="loading-message">
          <div className="spinner"></div>
          <p>Searching academic databases...</p>
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

export default AcademicSearch; 