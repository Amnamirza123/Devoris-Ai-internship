import { useState } from 'react';

function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

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
    }
  }

  return (
    <form onSubmit={handleSubmit}>
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
    </form>
  );
}

export default LoginForm;