import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Initialize todos from sessionStorage or as an empty array
  const [todos, setTodos] = useState(() => {
    const saved = sessionStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });

  // State for input field
  const [input, setInput] = useState('');

  // State for tracking the ID of the task being edited
  const [editingId, setEditingId] = useState(null);

  // State for the edit text of the task being edited
  const [editText, setEditText] = useState('');

  // Save todos to sessionStorage whenever they change
  useEffect(() => {
    sessionStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Add a new todo item
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

  // Toggle completion status of a todo
  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // Soft-delete a todo (mark as deleted without removing from list)
  const softDeleteTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, deleted: true } : todo
    ));
  };

  // Start editing a specific todo
  const startEditing = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  // Save the edited todo text
  const saveEdit = (id) => {
    if (editText.trim()) {
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, text: editText } : todo
      ));
    }
    setEditingId(null);
    setEditText('');
  };

  // Cancel the editing process
  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  // Handle Enter or Escape key during input/editing
  const handleKeyPress = (e, id = null) => {
    if (e.key === 'Enter') {
      id ? saveEdit(id) : addTodo();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  // Sort todos: deleted tasks appear at the top
  const sortedTodos = [...todos].sort((a, b) => {
    if (a.deleted && !b.deleted) return -1;
    if (!a.deleted && b.deleted) return 1;
    return 0;
  });

  return (
    <>
      <div className="todo-container">
        <h1>To-Do List</h1>

        {/* Input field and add button */}
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

        {/* Todo list display */}
        <ul className="todo-list">
          {sortedTodos.map(todo => (
            <li
              key={todo.id}
              className={`todo-item ${todo.completed ? 'completed' : ''} ${todo.deleted ? 'deleted' : ''}`}
            >
              {/* If editing, show edit UI */}
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
                // Normal task view
                <div className="task-container">
                  <div className="task-header">
                    <span
                      onClick={() => !todo.deleted && toggleTodo(todo.id)}
                      onDoubleClick={() => !todo.deleted && startEditing(todo.id, todo.text)}
                      className="task-text"
                    >
                      {todo.text}
                    </span>

                    {/* Show buttons only if not deleted */}
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

        {/* Show message if there are no todos */}
        {todos.length === 0 && (
          <p className="empty-message">No tasks yet! Add one to get started.</p>
        )}
      </div>
    </>
  );
}

export default App;
