// Login.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import login from "./login.jpg";
import "./Login.css"; // Import your CSS file for styling

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Add your login logic here
    const isadmin = username === "admin" ? true : false;
    if (isadmin) {
      // Redirect to the desired page after successful login
      navigate("/store-dashboard"); // Change "/dashboard" to your desired route
    } else {
      // Handle unsuccessful login
      navigate("/order");
    }
  };

  return (
    <div className="outer-container">
      <div className="login-container">
        <h2>Login to Order System</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <input
            className="form-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="form-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="form-button" type="submit">
            Login
          </button>
        </form>
      </div>
      <div className="image-container">
        <img src={login} alt="image" className="image" />
      </div>
    </div>
  );
};

export default Login;
