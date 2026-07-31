import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import Chatbot from './Chatbot';
import Extractor from './Extractor';
import './App.css';

function App() {
  const [token, setToken] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [mode, setMode] = useState(null); // null = show mode picker

  if (!token) {
    return (
      <div className="auth-shell">
        {showRegister ? (
          <>
            <RegisterForm onRegisterSuccess={() => setShowRegister(false)} />
            <p className="auth-switch" onClick={() => setShowRegister(false)}>
              Already have an account? Log in
            </p>
          </>
        ) : (
          <>
            <LoginForm onLoginSuccess={setToken} />
            <p className="auth-switch" onClick={() => setShowRegister(true)}>
              Need an account? Register
            </p>
          </>
        )}
      </div>
    );
  }

  if (!mode) {
    return (
      <div className="home-container">
        <div className="home-card">
          <div className="logo">✨</div>
          <h1>Welcome to Smart Extractor AI</h1>
          <p className="subtitle">
            Your intelligent assistant for chatting, extracting information, and working with AI.
          </p>
          <h2>What would you like to do?</h2>
          <div className="choice-container">
            <button className="choice-card" onClick={() => setMode('chat')}>
              <span>💬</span>
              <div>
                <h3>Chat with AI</h3>
                <p>Ask questions and get intelligent responses.</p>
              </div>
            </button>
            <button className="choice-card" onClick={() => setMode('extract')}>
              <span>📄</span>
              <div>
                <h3>Extract Information</h3>
                <p>Extract names, emails, and phone numbers.</p>
              </div>
            </button>
          </div>
          <p className="auth-switch" onClick={() => setToken(null)} style={{ marginTop: 30 }}>
            Log out
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mode-bar">
        <button className="back-btn" onClick={() => setMode(null)}>
          &larr; Back
        </button>
      </div>
      {mode === 'chat' ? <Chatbot token={token} /> : <Extractor token={token} />}
    </div>
  );
}

export default App;