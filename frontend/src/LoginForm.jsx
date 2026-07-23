import { useState } from 'react';

function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await fetch('https://tasktrack-v1w1.onrender.com/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ useremail: email, password: password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage('Incorrect credentials');
      return;
    }

    setMessage('');
    onLoginSuccess(data.token);
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

      {message && (
        <p style={{ color: 'red' }}>
          {message}
        </p>
      )}
    </form>
  );
}

export default LoginForm;