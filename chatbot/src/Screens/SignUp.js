import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUp({ setIsAuthenticated }) {
  let navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    confirm_password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (credentials.password !== credentials.confirm_password) {
      setError("Passwords do not match");
      return;
    }

    const response = await fetch("http://localhost:5000/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    const json = await response.json();
    if (!json.success) {
      alert("Error signing up");
    } else {
      setIsAuthenticated(true);
      navigate("/chat");
    }
  };

  const onChange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };

  return (
    <div className="h-screen flex">
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2">
                Email:
              </label>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={onChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block mb-2">
                Password:
              </label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={onChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="confirm_password" className="block mb-2">
                Confirm Password:
              </label>
              <input
                type="password"
                name="confirm_password"
                value={credentials.confirm_password}
                onChange={onChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
      <div className="flex-1 bg-blue-500">
        <img
          src="/path-to-your-image.jpg"
          alt="Sign Up"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export default SignUp;

