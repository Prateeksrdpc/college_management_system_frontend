// src/components/Navbar.js
import React from 'react';
import logoo from '../images/collegelogo.png'
function Navbar({ onLoginClick, onLogout, isAuthenticated, username }) {
  return (
    <nav className="bg-gray-800 p-5 flex justify-between items-center text-white">
      {/* Left Side: Logo and College Name */}
      <div className="flex items-center space-x-3">
        <img src={logoo} alt="College Logo" className="h-10" />
        <span className="text-2xl font-semibold">College Management System</span>
      </div>

      {/* Right Side: Authentication Buttons */}
      <div>
        {isAuthenticated ? (
          <>
            <span className="mr-4">Welcome, {username}</span>
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={onLoginClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
