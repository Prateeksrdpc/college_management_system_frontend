// src/pages/UserDashboard.js
import React from 'react';
import Navbar from '../components/Navbar';
import AdminSidebar from '../components/AdminSidebar';

const UserDashboard = ({ onLogout, username }) => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar onLogout={onLogout} isAuthenticated={true} username={username} />
      <div className="flex">
        <AdminSidebar />
        <div className="dashboard-content p-6 w-full">
          <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>
          <p className="mb-4">Welcome to the User Dashboard, {username}!</p>
          <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
            <p>Name: {username}</p>
            <p>Email: {JSON.parse(localStorage.getItem('user')).email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
