import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import './chatbot.css';

const API_URL = 'https://smart-extractor-backend.onrender.com';

function Chatbot({ token }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID());
  const [refreshKey, setRefreshKey] = useState(0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleNewChat() {
    setSessionId(crypto.randomUUID());
    setMessages([]);
  }

  async function handleSelectSession(id) {
    setSessionId(id);
    setMessages([]);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/chat/${id}/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const history = await res.json();
        setMessages(history);
      }
    } catch {
      // chat just stays empty if this fails
    } finally {
      setLoading(false);
    }
  }

  async function handleSend() {
    if (!message.trim() || loading) return;

    const userText = message;
    setMessage('');
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      { role: 'user', content: userText },
      { role: 'assistant', content: '' },
    ]);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: userText,
          system_prompt: 'You are a helpful AI assistant. Give clear and concise answers.',
        }),
      });

      if (response.status === 401) {
        throw new Error('Session expired. Please log in again.');
      }
      if (!response.ok) {
        throw new Error('Server error ' + response.status);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: 'assistant',
            content: updated[updated.length - 1].content + chunk,
          };
          return updated;
        });
      }

      setRefreshKey((k) => k + 1);
    } catch (error) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', content: 'Error: ' + error.message };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat-layout">
      <Sidebar
        token={token}
        activeSessionId={sessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onSessionDeleted={handleNewChat}
        refreshKey={refreshKey}
      />

      <div className="chat-container">
        <div className="messages">
          {messages.length === 0 && (
            <div className="welcome">
              <h2>Smart Extractor Chat</h2>
              <p>Ask something to get started.</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={msg.role === 'user' ? 'message user' : 'message assistant'}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
            </div>
          ))}
          {loading && <div className="message assistant">Thinking...</div>}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask something..."
          />
          <button onClick={handleSend} disabled={loading}>
            {loading ? 'Thinking...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;