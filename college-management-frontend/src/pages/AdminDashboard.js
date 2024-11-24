import React, { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import Card from '../components/Card';
import axios from 'axios';

function AdminDashboard() {
  const API_URL = 'http://localhost:9090/api/';

const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null; // Get token from localStorage

const instance = axios.create({
  baseURL: API_URL,
  headers: { Authorization: `Bearer ${token}` } // Include token in Authorization header
});
  const [stats, setStats] = useState({
    students: 0,
    instructors: 0,
    departments: 0,
    courses: 0,
    enrollements :0,
  });

// Fetch all departments and courses
useEffect(() => {
  count();
}, []);

    const count=async ()=> {

      try{
        const statsData = await  instance.get('all/count');
        const data=statsData.data;
        setStats({
          ...stats,
          students:data[0],
          instructors:data[1],
          departments:data[2],
          courses:data[3],
  
        })
      }catch (error) {
        console.error('Error fetching data:', error);
      
      }
  
    }
  
 count()

 

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card title="Number of Students" count={stats.students} />
          <Card title="Number of Instructors" count={stats.instructors} />
          <Card title="Number of Departments" count={stats.departments} />
          <Card title="Number of Courses" count={stats.courses} />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
