import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = sessionStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    sessionStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (input.trim()) {
      const newTodo = {
        id: Date.now(),
        text: input,
        completed: false,
        deleted: false,
      };
      setTodos([newTodo, ...todos]);
      setInput('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const softDeleteTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, deleted: true } : todo
    ));
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = (id) => {
    if (editText.trim()) {
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, text: editText } : todo
      ));
    }
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleKeyPress = (e, id = null) => {
    if (e.key === 'Enter') {
      id ? saveEdit(id) : addTodo();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const sortedTodos = [...todos].sort((a, b) => {
    if (a.deleted && !b.deleted) return -1;
    if (!a.deleted && b.deleted) return 1;
    return 0;
  });
  return (
    <>
      <div className="todo-container">
        <h1>To-Do List</h1>

        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Add a new task..."
          />
          <button onClick={addTodo}>Add</button>
        </div>

        <ul className="todo-list">
          {sortedTodos.map(todo => (
            <li
              key={todo.id}
              className={`todo-item ${todo.completed ? 'completed' : ''} ${todo.deleted ? 'deleted' : ''}`}
            >
              {editingId === todo.id ? (
                <div className="edit-container">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => handleKeyPress(e, todo.id)}
                    autoFocus
                  />
                  <button onClick={() => saveEdit(todo.id)}>Save</button>
                  <button onClick={cancelEdit}>Cancel</button>
                </div>
              ) : (
                <div className="task-container">
                  <div className="task-header">
                    <span
                      onClick={() => !todo.deleted && toggleTodo(todo.id)}
                      onDoubleClick={() => !todo.deleted && startEditing(todo.id, todo.text)}
                      className="task-text"
                    >
                      {todo.text}
                    </span>

                    {!todo.deleted && (
                      <div className="task-buttons">
                        <button onClick={() => startEditing(todo.id, todo.text)}>✏️</button>
                        <button onClick={() => softDeleteTodo(todo.id)}>✕</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        {todos.length === 0 && (
          <p className="empty-message">No tasks yet! Add one to get started.</p>
        )}
      </div>
    </>
  );
}

export default App;
