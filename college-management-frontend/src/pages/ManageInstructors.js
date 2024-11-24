import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';



const ManageInstructors = () => {
  const API_URL = 'http://localhost:9090/api/';
const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;

const instance = axios.create({
  baseURL: API_URL,
  headers: { Authorization: `Bearer ${token}` },
});
  const [departments, setDepartments] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [newInstructor, setNewInstructor] = useState({ name: '', email: '', departmentId: '' });
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch all departments and instructors
  useEffect(() => {
    fetchDepartmentsAndInstructors();
  }, []);

  const fetchDepartmentsAndInstructors = async () => {
    try {
      setLoading(true);
      const departmentResponse = await instance.get('departments');
      const departments = departmentResponse.data;

      const allInstructors = departments.flatMap(dept => dept.instructors);

      // Fetch courses for each instructor
      const instructorsWithCourses = await Promise.all(
        allInstructors.map(async instructor => {
          const courseResponse = await instance.get(`courses/instructor/${instructor.id}`);
          return { ...instructor, courses: courseResponse.data };
        })
      );

      setDepartments(departments);
      setInstructors(instructorsWithCourses);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  // Open Add Instructor Modal
  const openAddModal = () => {
    setNewInstructor({ name: '', email: '', departmentId: '' });
    setShowAddModal(true);
  };

  // Close Add Instructor Modal
  const closeAddModal = () => {
    setShowAddModal(false);
  };

  // Open Edit Instructor Modal
  const openEditModal = (instructor) => {
    setSelectedInstructor(instructor);
    setShowEditModal(true);
  };

  // Close Edit Instructor Modal
  const closeEditModal = () => {
    setShowEditModal(false);
  };

  // Open Delete Confirmation Modal
  const openDeleteModal = (instructor) => {
    setSelectedInstructor(instructor);
    setShowDeleteModal(true);
  };

  // Close Delete Modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  // Add new instructor
  const handleAddInstructor = async () => {
    try {
      await instance.post('instructors', {
        name: newInstructor.name,
        email: newInstructor.email,
      }, {
        params: { departmentId: newInstructor.departmentId }
      });
      setShowAddModal(false);
      fetchDepartmentsAndInstructors();  // Refresh data after adding
    } catch (error) {
      console.error('Error adding instructor:', error);
    }
  };

  // Edit instructor
  const handleEditInstructor = async () => {
    try {
      await instance.put(`instructors/${selectedInstructor.id}`, selectedInstructor);
      setShowEditModal(false);
      fetchDepartmentsAndInstructors();  // Refresh data after editing
    } catch (error) {
      console.error('Error editing instructor:', error);
    }
  };

  // Delete instructor
  const handleDeleteInstructor = async () => {
    try {
      await instance.delete(`instructors/${selectedInstructor.id}`);
      setShowDeleteModal(false);
      fetchDepartmentsAndInstructors();  // Refresh data after deleting
    } catch (error) {
      console.error('Error deleting instructor:', error);
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />
    <div className=" p-8">
      <h1 className="text-3xl font-semibold mb-8">Manage Instructors</h1>
      
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        onClick={openAddModal}
      >
        Add Instructor
      </button>

      {/* Instructors Table */}
      <div className="mt-8">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="px-4 py-2">Instructor Name</th>
                <th className="px-4 py-2">Department Name</th>
                <th className="px-4 py-2">Courses</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {instructors.map((instructor) => (
                <tr key={instructor.id}>
                  <td className="border px-4 py-2">{instructor.name}</td>
                  <td className="border px-4 py-2">
                    {departments.find(dept => dept.instructors.some(inst => inst.id === instructor.id))?.name}
                  </td>
                  <td className="border px-4 py-2">
                    <ul>
                      {instructor.courses && instructor.courses.length > 0
                        ? instructor.courses.map(course => <li key={course.id}>{course.name},</li>)
                        : 'No Courses'}
                    </ul>
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-yellow-500 text-white px-4 py-1 rounded-lg hover:bg-yellow-600 mr-2"
                      onClick={() => openEditModal(instructor)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
                      onClick={() => openDeleteModal(instructor)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Instructor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl mb-4">Add New Instructor</h2>
            <button className="absolute top-2 right-2 " onClick={closeAddModal}>Close</button>
            <input
              type="text"
              className="w-full p-2 border rounded-lg mb-4"
              placeholder="Enter Instructor Name"
              value={newInstructor.name}
              onChange={(e) => setNewInstructor({ ...newInstructor, name: e.target.value })}
            />
            <input
              type="email"
              className="w-full p-2 border rounded-lg mb-4"
              placeholder="Enter Email"
              value={newInstructor.email}
              onChange={(e) => setNewInstructor({ ...newInstructor, email: e.target.value })}
            />
            <select
              className="w-full p-2 border rounded-lg mb-4"
              value={newInstructor.departmentId}
              onChange={(e) => setNewInstructor({ ...newInstructor, departmentId: e.target.value })}
            >
              <option value="">Select Department</option>
              {departments.map(department => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={handleAddInstructor}
            >
              Submit
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-lg mx-2"
              onClick={closeAddModal}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Edit Instructor Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl mb-4">Edit Instructor</h2>
           
            <input
              type="text"
              className="w-full p-2 border rounded-lg mb-4"
              value={selectedInstructor.name}
              onChange={(e) => setSelectedInstructor({ ...selectedInstructor, name: e.target.value })}
            />
            <input
              type="email"
              className="w-full p-2 border rounded-lg mb-4"
              value={selectedInstructor.email}
              onChange={(e) => setSelectedInstructor({ ...selectedInstructor, email: e.target.value })}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={handleEditInstructor}
            >
              Save Changes
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-lg mx-2"
              onClick={closeEditModal}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl mb-4">Are you sure you want to delete this instructor?</h2>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg mr-4"
              onClick={handleDeleteInstructor}
            >
              Yes, Delete
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              onClick={closeDeleteModal}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default ManageInstructors;
