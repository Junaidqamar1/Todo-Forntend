import React, { useState, useEffect } from "react";
import API from "../api";
import socket from "../socket";

const TaskForm = ({ onTaskCreated }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Todo",
    priority: "Low",
    assignedTo: "",
  });

  const [users, setUsers] = useState([]);

  
  useEffect(() => {
    API.get("/auth/all").then((res) => setUsers(res.data));
  }, []);

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await API.post("/tasks", form);
    
    setForm({ title: "", description: "", status: "Todo", priority: "Low", assignedTo: "" });
  } catch (err) {
    alert("Error creating task");
    console.error(err);
  }
};

  return (
    <form onSubmit={handleSubmit} className="taskform">
      <h3>Create Task</h3>
      <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required
      />
      <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <select
        value={form.priority}
        onChange={(e) => setForm({ ...form, priority: e.target.value })}
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
      <select
        value={form.assignedTo}
        onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
        required
      >
        <option value="">-- Assign to --</option>
        {users.map((u) => (
          <option key={u._id} value={u._id}>{u.username}</option>
        ))}
      </select>
      <button type="submit">Create</button>
    </form>
  );
};

export default TaskForm;
