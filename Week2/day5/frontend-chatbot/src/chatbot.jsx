import { useState, useRef } from 'react';
import './Chatbot.css';

function ChatBox() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [tokenCount, setTokenCount] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);
  const inputRef = useRef(null);

  async function handleSend() {
    if (!message.trim() || isStreaming) return;

    setResponse('');
    setTokenCount(0);
    setIsStreaming(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, system_prompt: 'You are a helpful assistant.' }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setResponse((prev) => prev + chunk);
        setTokenCount((prev) => prev + Math.ceil(chunk.length / 4));
      }
    } catch (err) {
      setResponse('Connection failed. Is the server running?');
    } finally {
      setIsStreaming(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="chat-shell">
      <div className="chat-header">
        <div className="chat-header-title">
          <span className="chat-dot" />
          Smart Extractor &mdash; Chat
        </div>
        <div className="chat-token-counter">
          <span className="chat-token-value">{tokenCount}</span>
          <span className="chat-token-label">tokens</span>
        </div>
      </div>

      <div className="chat-body">
        {!response && !isStreaming && (
          <div className="chat-empty">Send a message to see the response stream in, token by token.</div>
        )}
        {response && (
          <div className="chat-response">
            {response}
            {isStreaming && <span className="chat-cursor">&#9612;</span>}
          </div>
        )}
      </div>

      <div className="chat-input-row">
        <textarea
          ref={inputRef}
          className="chat-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask something..."
          rows={1}
        />
        <button
          className="chat-send"
          onClick={handleSend}
          disabled={isStreaming || !message.trim()}
        >
          {isStreaming ? 'Streaming' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default ChatBox;