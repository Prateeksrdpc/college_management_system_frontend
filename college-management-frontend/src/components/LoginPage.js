// src/components/LoginPage.js
import React, { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';
// src/components/LoginPage.js

function LoginPage({ onClose, setAuthenticated, setUserRole, setUsername }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Extract email and password from state
      const response = await login(email, password); // Pass email and password separately
      localStorage.setItem('user', JSON.stringify(response));
      
      setAuthenticated(true);
      setUserRole(response.roles[0]); // assuming first role defines access
      setUsername(response.username);
      // if (response.roles.includes('ROLE_ADMIN')){
      //   const stats = await fetchStats(); // Fetch admin-related stats after login
      // console.log(stats); // For debugging, you can remove this later
      // }
      
      
      
      // Role-based navigation
      if (response.roles.includes('ROLE_ADMIN')) {
       
        navigate('/admindashboard');
      
      } else if (response.roles.includes('ROLE_USER')) {
        navigate('/userdashboard');
      } else if (response.roles.includes('ROLE_STUDENT')) {
        navigate('/studentdashboard');
      }
  
      onClose();
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6 relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close login popup"
        >
          &times;
        </button>

        {/* Header */}
        <h3 className="text-2xl font-semibold mb-4 text-center">Login</h3>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        {/* Form Inputs */}
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
