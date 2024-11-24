import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';

// import AdminSidebar from '../components/AdminSidebar';



const ManageDepartments = () => {
  const API_URL = 'http://localhost:9090/api/';
const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;

const instance = axios.create({
  baseURL: API_URL,
  headers: { Authorization: `Bearer ${token}` },
});
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [newDepartmentName, setNewDepartmentName] = useState('');

  const [newHeadInstructor, setNewHeadInstructor] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHeadModal, setShowHeadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  const fetchDepartments = () => {
    instance.get('departments').then((response) => {
      setDepartments(response.data);
    });
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const openAddModal = () => {
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setShowHeadModal(false);
    setShowDeleteModal(false);
  };

  const openAssignHeadModal = (department) => {
    setSelectedDepartment(department);
    const id = department.id;
    instance.get(`departments/${id}`).then((response) => {
      setInstructors(response.data.instructors);
      setShowHeadModal(true);
    });
  };

  const handleAddDepartment = () => {
    instance.post('departments', { name: newDepartmentName }).then(() => {
      closeModal();
      fetchDepartments(); // Refresh departments after adding
    });
  };
 

  const handleAssignHead = () => {
  
    instance.put(`/instructors/department/${selectedDepartment.id}/head`, null, {
      params: { instructorId: newHeadInstructor },
    }).then(() => {
      closeModal();
      fetchDepartments(); // Refresh departments after assigning a head
    });
  };


  const handleDeleteDepartment = (department) => {
    instance.delete(`/departments/${department.id}`).then(() => {
      closeModal();
      fetchDepartments(); // Refresh departments after deleting
    });
  };

  return (
    <div className="flex">
      <AdminSidebar />
    <div className=" p-4">
      <h1 className="text-3xl font-semibold mb-8">Manage Departments</h1>
      
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        onClick={openAddModal}
      >
        Add Department
      </button>

      <div className="mt-8 w-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="px-4 py-2">Department Name</th>
              <th className="px-4 py-2">Head of Department</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((department) => (
              <tr key={department.id}>
                <td className="border px-4 py-2">{department.name}</td>
                <td className="border px-4 py-2">{department.head ? department.head.name : 'None'}</td>
                <td className="border px-4 py-2">
                  {!department.head && (
                    <button
                      className="bg-green-500 text-white px-2.5 py-1 lg:px-4 lg:py-1 rounded-lg hover:bg-green-600 lg:mr-2 sm:p-2 sm:m-2"
                      onClick={() => openAssignHeadModal(department)}
                    >
                      Assign Head
                    </button>
                  )}
                  <button
                    className="bg-yellow-500 text-white  px-3 py-1 lg:px-4 lg:py-1 rounded-lg hover:bg-yellow-600 lg:mr-2 sm:p-2 sm:m-2"
                    onClick={() => openAssignHeadModal(department)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white  px-3 py-1 lg:px-4 lg:py-1 rounded-lg hover:bg-red-600 mr-2 sm:p-2 sm:m-2"
                    onClick={() => setShowDeleteModal(department)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Department Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl mb-4">Add New Department</h2>
            <input
              type="text"
              className="w-full p-2 border rounded-lg mb-4"
              placeholder="Enter Department Name"
              value={newDepartmentName}
              onChange={(e) => setNewDepartmentName(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={handleAddDepartment}
            >
              Submit
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-lg ml-4"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Assign Head Modal */}
      {showHeadModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl mb-4">Assign Head of Department</h2>
            <select
              className="w-full p-2 border rounded-lg mb-4"
              onChange={(e) => setNewHeadInstructor(e.target.value)}
            >
              <option value="">Select Instructor</option>
              {instructors.map((instructor) => (
                <option key={instructor.id} value={instructor.id}>
                  {instructor.name}
                </option>
              ))}
            </select>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
              onClick={handleAssignHead}
            >
              Assign
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-lg ml-4"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl mb-4">Are you sure you want to delete this department?</h2>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg mr-4"
              onClick={() => handleDeleteDepartment(showDeleteModal)}
            >
              Yes, Delete
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              onClick={closeModal}
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

export default ManageDepartments;
