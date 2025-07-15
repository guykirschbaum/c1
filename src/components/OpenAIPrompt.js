import React, { useState } from 'react';

const OpenAIPrompt = ({ onResponse }) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  console.log('OpenAIPrompt component rendered'); // Debug log

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
      console.error('Error:', err);
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
    <div className="openai-prompt-container">
      <div className="prompt-header">
        <h3>🤖 AI Assistant</h3>
        <p>Ask any question and get an AI-powered response!</p>
      </div>

      <form onSubmit={handleSubmit} className="prompt-form">
        <div className="input-group">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask me anything... (e.g., 'Explain header bidding', 'What is programmatic advertising?')"
            className="prompt-input"
            rows="3"
            disabled={loading}
          />
          <div className="button-group">
            <button 
              type="submit" 
              disabled={loading || !prompt.trim()}
              className="submit-button"
            >
              {loading ? '🤔 Thinking...' : '✨ Ask AI'}
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

      {response && (
        <div className="ai-response">
          <div className="response-header">
            <strong>🎯 AI Response:</strong>
          </div>
          <div className="response-content">
            {response}
          </div>
        </div>
      )}
    </div>
  );
};

export default OpenAIPrompt;
