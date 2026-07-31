import { useState } from 'react';

<<<<<<< HEAD
const API_URL = 'http://127.0.0.1:8000';

function RegisterForm({ onRegisterSuccess }) {
=======
function RegisterForm() {
>>>>>>> 18f3828ee7fb9884f99719ee0d662a0189589820
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
<<<<<<< HEAD

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');

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
=======
  const [isError, setIsError] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch("https://tasktrack-v1w1.onrender.com/register", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, useremail: email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsError(true);
        setMessage(data.message || 'Registration failed');
      } else {
        setIsError(false);
        setMessage('Registration successful! You can now log in.');
        setUsername('');
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      setIsError(true);
      setMessage('Something went wrong. Please try again.');
>>>>>>> 18f3828ee7fb9884f99719ee0d662a0189589820
    }
  }

  return (
<<<<<<< HEAD
    <form onSubmit={handleSubmit}>
      <h2 style={{ color: '#e7ecef' }}>Register</h2>
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Register</button>
      {message && <p style={{ color: '#8b949c', fontSize: '13px' }}>{message}</p>}
    </form>
=======
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
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
        <button type="submit">Register</button>
      </form>
      {message && (
        <p style={{ color: isError ? 'red' : 'green' }}>{message}</p>
      )}
    </div>
>>>>>>> 18f3828ee7fb9884f99719ee0d662a0189589820
  );
}

export default RegisterForm;