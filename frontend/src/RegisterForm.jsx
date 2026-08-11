import { useState } from 'react';

const API_URL = 'https://smart-extractor-backend.onrender.com';

function RegisterForm({ onRegisterSuccess }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();

      if (data.error) {
        setMessage(data.error);
      } else {
        setMessage('Registered! You can log in now.');
        onRegisterSuccess?.();
      }
    } catch {
      setMessage('Connection failed. Is the server running?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ color: '#e7ecef' }}>Register</h2>
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" disabled={loading} />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" disabled={loading} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" disabled={loading} />
      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
      {message && <p style={{ color: '#8b949c', fontSize: '13px' }}>{message}</p>}
    </form>
  );
}

export default RegisterForm;