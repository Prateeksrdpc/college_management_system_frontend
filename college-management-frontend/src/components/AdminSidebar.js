import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <div className= "bg-white shadow-md w-64 h-full py-5">
      <ul className="space-y-2">
        <li>
        <NavLink
          to="/admindashboard"
          className={({ isActive }) =>
            isActive
              ? 'block px-4 py-2 text-blue-600 font-semibold bg-gray-200 rounded-md'
              : 'block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md'
          }
        >
          Admin Dashboard
        </NavLink>
        </li>
        
        <li>
       
          <NavLink
            to="/admindashboard/manage-departments"
            className={({ isActive }) =>
              isActive
                ? 'block px-4 py-2 text-blue-600 font-semibold bg-gray-200 rounded-md'
                : 'block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md'
            }
          >
            Manage Departments
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admindashboard/students"
            className={({ isActive }) =>
              isActive
                ? 'block px-4 py-2 text-blue-600 font-semibold bg-gray-200 rounded-md'
                : 'block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md'
            }
          >
            Manage Students
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admindashboard/instructors"
            className={({ isActive }) =>
              isActive
                ? 'block px-4 py-2 text-blue-600 font-semibold bg-gray-200 rounded-md'
                : 'block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md'
            }
          >
            Manage Instructors
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admindashboard/courses"
            className={({ isActive }) =>
              isActive
                ? 'block px-4 py-2 text-blue-600 font-semibold bg-gray-200 rounded-md'
                : 'block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md'
            }
          >
            Manage Courses
          </NavLink>
        </li>
        
      </ul>
    </div>
  );
};

export default AdminSidebar;
