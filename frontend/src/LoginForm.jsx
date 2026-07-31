<<<<<<< HEAD
import { useState } from 'react';

const API_URL = 'http://127.0.0.1:8000';
=======
import { useState } from 'react'; /* useState updates the changes on UI */
>>>>>>> 18f3828ee7fb9884f99719ee0d662a0189589820

function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

<<<<<<< HEAD
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
=======
  async function handleSubmit(e) { /* async cause we will have to wait for backend to authorize and give JWT */
    e.preventDefault(); /* e is event if smth happens on frontend ie login or registeration  e contain information about what changes happend */

    setError('');

    try {
      const response = await fetch('https://tasktrack-v1w1.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ useremail: email, password: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError('Incorrect credentials');
        return;
      }

      onLoginSuccess(data.token);

    } catch (err) {
      setError('Something went wrong. Please try again.');
>>>>>>> 18f3828ee7fb9884f99719ee0d662a0189589820
    }
  }

  return (
    <form onSubmit={handleSubmit}>
<<<<<<< HEAD
      <h2 style={{ color: '#e7ecef' }}>Log In</h2>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Log In</button>
      {error && <p style={{ color: '#ff6b6b', fontSize: '13px' }}>{error}</p>}
=======
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />

      <button type="submit">Log In</button>

      {error && (
        <p style={{ color: 'red' }}>
          {error}
        </p>
      )}
>>>>>>> 18f3828ee7fb9884f99719ee0d662a0189589820
    </form>
  );
}

export default LoginForm;