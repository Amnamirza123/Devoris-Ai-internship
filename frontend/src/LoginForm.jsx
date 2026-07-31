import { useState } from 'react';

const API_URL = 'https://smart-extractor-backend.onrender.com';

function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        onLoginSuccess(data.token);
      }
    } catch {
      setError('Connection failed. Is the server running?');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ color: '#e7ecef' }}>Log In</h2>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Log In</button>
      {error && <p style={{ color: '#ff6b6b', fontSize: '13px' }}>{error}</p>}
    </form>
  );
}

export default LoginForm;