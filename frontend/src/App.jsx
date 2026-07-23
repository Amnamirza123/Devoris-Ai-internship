import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import TaskList from './TaskList';

function App() {
  const [token, setToken] = useState(null);

  return (
    <div>
      <h1>TaskTrack</h1>
      {!token && (
        <>
          <RegisterForm />
          <LoginForm onLoginSuccess={setToken} />
        </>
      )}

      {/* this is to get the token on screen}
      {/*token && (
        <>
          <p>Logged in! Token: {token}</p>
          <TaskList token={token} />
        </>
      )*/}
      {token && (
  <>
    <p>Logged in!</p>
    <TaskList token={token} />
  </>
)}
    </div>
  );
}

export default App;