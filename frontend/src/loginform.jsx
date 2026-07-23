import { useState } from 'react';

function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ useremail: email, password: password }),
    });

    const data = await response.json();
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
    </form>
  );
}

export default LoginForm;