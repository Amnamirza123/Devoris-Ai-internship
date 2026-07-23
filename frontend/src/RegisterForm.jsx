import { useState } from 'react';

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
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
    }
  }

  return (
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
  );
}

export default RegisterForm;