// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes,NavLink} from 'react-router-dom';
import Home from './components/Home';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import './App.css';
import UserDashboard from './pages/UserDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ManageDepartments from './pages/ManageDepartments';
import ManageInstructors from './pages/ManageInstructors';
import ManageCourses from './pages/ManageCourses';
import ManageStudents from './pages/ManageStudents';


function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [username, setUsername] = useState('');

 
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setAuthenticated(true);
      setUserRole(parsedUser.roles[0]);
      setUsername(parsedUser.username);
    }
  }, []);

  const handleLoginClick = () => setLoginOpen(true);
  const handleCloseLogin = () => setLoginOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    
    setAuthenticated(false);
    setUserRole('');
    setUsername('');
   
    <NavLink to="/"></NavLink>
    
  };

  return (
    <Router>
      <div className="App">
        <Navbar
          onLoginClick={handleLoginClick}
          onLogout={handleLogout}
          isAuthenticated={isAuthenticated}
          username={username}
        />

        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Admin Dashboard Route */}
          <Route
            path="/admindashboard"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                userRole={userRole}
                allowedRoles={['ROLE_ADMIN']}
              >
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* User Dashboard Route */}
          <Route
            path="/userdashboard"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                userRole={userRole}
                allowedRoles={['ROLE_USER']}
              >
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Student Dashboard Route */}
          <Route
            path="/studentdashboard"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                userRole={userRole}
                allowedRoles={['ROLE_STUDENT']}
              >
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Manage Departments Route */}
          <Route
            path="/admindashboard/manage-departments"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                userRole={userRole}
                allowedRoles={['ROLE_ADMIN']}
              >
                <ManageDepartments />
              </ProtectedRoute>
            }
          />
        
        {/* Manage instructors Route */}
        <Route
            path="/admindashboard/instructors"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                userRole={userRole}
                allowedRoles={['ROLE_ADMIN']}
              >
                <ManageInstructors/>
              </ProtectedRoute>
            }
          />
           {/* Manage instructors Route */}
        <Route
            path="/admindashboard/courses"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                userRole={userRole}
                allowedRoles={['ROLE_ADMIN']}
              >
                <ManageCourses/>
              </ProtectedRoute>
            }
          />
           <Route
            path="/admindashboard/students"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                userRole={userRole}
                allowedRoles={['ROLE_ADMIN']}
              >
                <ManageStudents/>
              </ProtectedRoute>
            }
          />
        </Routes>

        {/* Login Popup */}
        {isLoginOpen && (
          <LoginPage
            onClose={handleCloseLogin}
            setAuthenticated={setAuthenticated}
            setUserRole={setUserRole}
            setUsername={setUsername}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
