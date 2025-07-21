import React, { useState } from 'react';

const OpenAIPrompt = ({ onResponse, placeholder, label }) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          maxTokens: 150
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResponse(data.response);
        if (onResponse) {
          onResponse(data.response);
        }
      } else {
        setError(data.error || 'Failed to get response');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearResponse = () => {
    setResponse('');
    setError('');
    setPrompt('');
  };

  return (
    <div className="openai-prompt-container academic-search-box">
      {label && <label className="search-label">{label}</label>}
      <form onSubmit={handleSubmit} className="prompt-form">
        <div className="input-group">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={placeholder || 'Search for articles, papers, authors, or topics…'}
            className="prompt-input academic-input"
            disabled={loading}
          />
          <div className="button-group">
            <button 
              type="submit" 
              disabled={loading || !prompt.trim()}
              className="submit-button academic-search-btn"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
            {(response || error) && (
              <button 
                type="button" 
                onClick={clearResponse}
                className="clear-button"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </form>
      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default OpenAIPrompt;
