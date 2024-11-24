// src/pages/StudentDashboard.js
import React from 'react';
import Navbar from '../components/Navbar';
import AdminSidebar from '../components/AdminSidebar';

const StudentDashboard = ({ onLogout, username }) => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar onLogout={onLogout} isAuthenticated={true} username={username} />
      <div className="flex">
        <AdminSidebar />
        <div className="dashboard-content p-6 w-full">
          <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
          <p className="mb-4">Welcome to the Student Dashboard, {username}!</p>
          <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
            <p>You are currently enrolled in the following courses:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>Course 1</li>
              <li>Course 2</li>
              <li>Course 3</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
