import { useEffect, useState } from 'react';
import './sidebar.css';

const API_URL = 'https://smart-extractor-backend.onrender.com';

function Sidebar({ token, activeSessionId, onSelectSession, onNewChat, refreshKey }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSessions() {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/chat/sessions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setSessions(data);
        }
      } catch {
        // sidebar just stays empty if this fails
      } finally {
        setLoading(false);
      }
    }
    loadSessions();
  }, [token, refreshKey]);

  return (
    <div className="sidebar">
      <button className="new-chat-btn" onClick={onNewChat}>
        + New Chat
      </button>

      <div className="session-list">
        {loading && <p className="sidebar-hint">Loading...</p>}
        {!loading && sessions.length === 0 && (
          <p className="sidebar-hint">No previous chats yet.</p>
        )}
        {sessions.map((s) => (
          <div
            key={s.session_id}
            className={s.session_id === activeSessionId ? 'session-item active' : 'session-item'}
            onClick={() => onSelectSession(s.session_id)}
          >
            {s.title}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;