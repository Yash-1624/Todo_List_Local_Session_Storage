import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [deletedTasks, setDeletedTasks] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState('');

  // ✅ Load data from localStorage
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    const savedDeletedTasks = JSON.parse(localStorage.getItem('deletedTasks'));

    if (savedTasks) setTasks(savedTasks);
    if (savedDeletedTasks) setDeletedTasks(savedDeletedTasks);
  }, []);

  // ✅ Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('deletedTasks', JSON.stringify(deletedTasks));
  }, [tasks, deletedTasks]);

  // ✅ Add task
  const addTask = () => {
    if (task.trim() === '') return;
    setTasks([...tasks, task.trim()]);
    setTask('');
  };

  // ✅ Delete task (move to deleted list)
  const deleteTask = (indexToDelete) => {
    const deleted = tasks[indexToDelete];
    const updatedTasks = tasks.filter((_, index) => index !== indexToDelete);
    setTasks(updatedTasks);
    setDeletedTasks([deleted, ...deletedTasks]);
  };

  // ✅ Start editing
  const startEdit = (index) => {
    setEditingIndex(index);
    setEditText(tasks[index]);
  };

  // ✅ Save edited task
  const saveEdit = () => {
    if (editText.trim() === '') return;
    const updatedTasks = [...tasks];
    updatedTasks[editingIndex] = editText.trim();
    setTasks(updatedTasks);
    setEditingIndex(null);
    setEditText('');
  };

  return (
    <div className="app">
      <h1>To-Do List</h1>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter a task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      {/* ✅ Deleted tasks */}
      {deletedTasks.length > 0 && (
        <div className="deleted-section">
          <h3>Deleted Tasks</h3>
          <ul className="task-list deleted">
            {deletedTasks.map((t, index) => (
              <li key={index} className="deleted-task">
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ✅ Active tasks */}
      <ul className="task-list">
        {tasks.length === 0 ? (
          <p>No active tasks.</p>
        ) : (
          tasks.map((t, index) => (
            <li key={index}>
              {editingIndex === index ? (
                <>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button onClick={saveEdit}>Save</button>
                </>
              ) : (
                <>
                  <span>{t}</span>
                  <div>
                    <button onClick={() => startEdit(index)}>Edit</button>
                    <button onClick={() => deleteTask(index)}>Delete</button>
                  </div>
                </>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;
