import React, { useState, useEffect } from 'react';

interface Todo {
  _id: string;
  todo_name: string;
}

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoName, setNewTodoName] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/todo/");
        if (!response.ok) throw new Error("Failed to fetch todos");
        const todosData = await response.json();
        setTodos(todosData);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };
    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (!newTodoName.trim()) return;

    console.log("Creating new todo:", newTodoName);

    try {
      const response = await fetch("http://localhost:8080/api/todo/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ todo_name: newTodoName }),
      });

      if (!response.ok) {
        console.error("Failed to create todo:", await response.json());
        return;
      }

      const data = await response.json();
      console.log("Todo created with ID:", data.id);
      setTodos([...todos, { _id: data.id, todo_name: newTodoName }]);
      setNewTodoName('');
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/todo/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete todo");
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div>
      <h1>Todo List</h1>

      {/* Input form for new todos */}
      <div>
        <input
          type="text"
          placeholder="New todo"
          value={newTodoName}
          onChange={(e) => setNewTodoName(e.target.value)}
        />
        <button onClick={handleAddTodo}>Create</button>
      </div>

      {/* Display list of todos */}
      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            {todo.todo_name}
            <button onClick={() => handleDeleteTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
