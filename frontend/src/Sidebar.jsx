import { useEffect, useState } from 'react';
import './sidebar.css';

const API_URL = 'https://smart-extractor-backend.onrender.com';

function Sidebar({ token, activeSessionId, onSelectSession, onNewChat, onSessionDeleted, refreshKey }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    loadSessions();
  }, [token, refreshKey]);

  async function loadSessions() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/chat/sessions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setSessions(await res.json());
      }
    } catch {
      // sidebar stays empty
    } finally {
      setLoading(false);
    }
  }

  function startEditing(e, session) {
    e.stopPropagation();
    setEditingId(session.session_id);
    setEditValue(session.title);
  }

  async function saveRename(sessionId) {
    const title = editValue.trim();
    setEditingId(null);
    if (!title) return;

    setSessions((prev) => prev.map((s) => (s.session_id === sessionId ? { ...s, title } : s)));

    try {
      await fetch(`${API_URL}/chat/${sessionId}/rename`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      });
    } catch {
      loadSessions();
    }
  }

  async function handleDelete(e, session) {
    e.stopPropagation();
    const confirmed = window.confirm(`Delete "${session.title}"? This can't be undone.`);
    if (!confirmed) return;

    setSessions((prev) => prev.filter((s) => s.session_id !== session.session_id));

    try {
      await fetch(`${API_URL}/chat/${session.session_id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      loadSessions();
      return;
    }

    if (session.session_id === activeSessionId) {
      onSessionDeleted();
    }
  }

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
            onClick={() => editingId !== s.session_id && onSelectSession(s.session_id)}
          >
            {editingId === s.session_id ? (
              <input
                className="session-rename-input"
                value={editValue}
                autoFocus
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => saveRename(s.session_id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveRename(s.session_id);
                  if (e.key === 'Escape') setEditingId(null);
                }}
              />
            ) : (
              <>
                <span className="session-title">{s.title}</span>
                <span className="session-actions">
                  <button className="icon-btn" title="Rename" onClick={(e) => startEditing(e, s)}>
                    ✏️
                  </button>
                  <button className="icon-btn" title="Delete" onClick={(e) => handleDelete(e, s)}>
                    🗑️
                  </button>
                </span>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;