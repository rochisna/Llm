import React from "react";
import "../CSS/Login.css";

function Login() {
  return (
    <div className="login">
      <h2>Login</h2>
      <form>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" required />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
