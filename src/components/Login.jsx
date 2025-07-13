import React, { useState } from "react";
import API from "../api";
import { Link, useNavigate } from "react-router-dom";


const Login = () => {


  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      setMessage("Login successful!");

     
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      
     window.location.reload();

    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login">
      <h2 className="heading">Login</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
      <p>crete account</p><Link to="/register">Register</Link>
    </div>
  );
};

export default Login;
