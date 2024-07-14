import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUp() {
  let navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (credentials.password !== credentials.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const response = await fetch("http://localhost:5000/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    const json = await response.json();
    if (!json.success) {
      alert("Error signing up");
    } else {
      localStorage.setItem("authToken", json.token);
      navigate("/chat");
    }
  };

  const onChange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-neutral-light">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4 text-secondary">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-neutral-dark mb-2">
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={onChange}
              required
              className="w-full p-2 border border-neutral rounded focus:ring-2 focus:ring-secondary"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-neutral-dark mb-2">
              Password:
            </label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={onChange}
              required
              className="w-full p-2 border border-neutral rounded focus:ring-2 focus:ring-secondary"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-neutral-dark mb-2"
            >
              Confirm Password:
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={credentials.confirmPassword}
              onChange={onChange}
              required
              className="w-full p-2 border border-neutral rounded focus:ring-2 focus:ring-secondary"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-secondary text-white py-2 px-4 rounded hover:bg-secondary-dark transition duration-300"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
