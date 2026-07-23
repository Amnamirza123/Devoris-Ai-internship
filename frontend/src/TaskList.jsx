import { useState, useEffect } from 'react';
import TaskForm from './TaskForm';

function TaskList({ token }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('pending');

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3000/tasks', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch tasks');
        return res.json();
      })
      .then(data => {
        setTasks(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  function handleTaskCreated(newTask) {
    setTasks([...tasks, newTask]);
  }

  async function handleDelete(taskId) {
    try {
      await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (err) {
      setError('Failed to delete task');
    }
  }

  function startEditing(task) {
    setEditingTaskId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditStatus(task.status);
  }

  async function handleUpdate(taskId) {
    try {
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          status: editStatus,
        }),
      });
      const updatedTask = await response.json();
      setTasks(tasks.map(task => (task._id === taskId ? updatedTask : task)));
      setEditingTaskId(null);
    } catch (err) {
      setError('Failed to update task');
    }
  }

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>My Tasks</h2>
      <TaskForm token={token} onTaskCreated={handleTaskCreated} />
      {tasks.length === 0 && <p>No tasks yet — add one above!</p>}
      {tasks.map(task => (
        <div key={task._id}>
          {editingTaskId === task._id ? (
            <>
              <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
              <input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
              <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <button onClick={() => handleUpdate(task._id)}>Save</button>
              <button onClick={() => setEditingTaskId(null)}>Cancel</button>
            </>
          ) : (
            <>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <span>{task.status}</span>
              <button onClick={() => startEditing(task)}>Edit</button>
              <button onClick={() => handleDelete(task._id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default TaskList;