import { useState } from 'react';
import './extractor.css';

const API_URL = 'http://127.0.0.1:8000';

function Extractor({ token }) {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleExtract() {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${API_URL}/extract`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });

      if (res.status === 401) {
        setResult({ error: 'Session expired. Please log in again.' });
        return;
      }
      if (!res.ok) {
        setResult({ error: 'Server error ' + res.status });
        return;
      }

      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: 'Extraction failed' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="extractor-container">
      <h2>Lead Extractor</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste text here..."
      />
      <button onClick={handleExtract} disabled={loading}>
        {loading ? 'Extracting...' : 'Extract'}
      </button>

      {result && (
        <div className="result-box">
          {result.error ? (
            <p style={{ color: '#ff6b6b' }}>{result.error}</p>
          ) : (
            <>
              <p>Name: {result.result?.name || 'Not found'}</p>
              <p>Email: {result.result?.email || 'Not found'}</p>
              <p>Phone: {result.result?.phone || 'Not found'}</p>
              <p>Company: {result.result?.company || 'Not found'}</p>
              <p style={{ color: '#8b949c', fontSize: '12px' }}>
                attempt {result.attempt} · ~{result.est_tokens} tokens · est. cost ${result.est_cost}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Extractor;