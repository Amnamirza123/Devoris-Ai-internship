import { useState } from 'react'; /* useState updates the changes on UI */

function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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