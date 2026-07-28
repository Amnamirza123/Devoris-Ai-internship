import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import TaskList from './TaskList';
import './App.css';

function App() {
  const [token, setToken] = useState(null);

  return (
    <div className="app">

      <h1>TaskTrack</h1>

      <p className="subtitle">
        Manage your tasks efficiently
      </p>

      {!token && (
        <div className="auth-container">
          <div className="card">
            <h2>Create Account</h2>
            <RegisterForm />
          </div>

          <div className="card">
            <h2>Login</h2>
            <LoginForm onLoginSuccess={setToken} /> /* loginform component is using a function "settoken" and we'll save it as onloginsucess in our login page */
          </div>
        </div>
      )}

      {token && ( /*no ! mark here before token indicated it requires token to process further*/
        <div className="dashboard">
          <p className="welcome">
            Welcome back 👋
          </p>

          <TaskList token={token} />
        </div>
      )}

    </div>
  );
}

export default App;