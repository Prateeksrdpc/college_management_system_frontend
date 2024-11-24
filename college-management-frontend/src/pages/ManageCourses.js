import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';



const ManageCourses = () => {
  const API_URL = 'http://localhost:9090/api/';
const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;

const instance = axios.create({
  baseURL: API_URL,
  headers: { Authorization: `Bearer ${token}` },
});
  const [newCourse, setNewCourse] = useState({
    name: "",
    departmentId: "",
    instructorId: "",
  });
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [instructors, setInstructors] = useState([]);

  // Fetch all departments and courses
  useEffect(() => {
    fetchDepartmentsAndCourses();
  }, []);

  const fetchDepartmentsAndCourses = async () => {
    try {
      setLoading(true);
      const departmentResponse = await instance.get('departments');
      const instResponse = await instance.get("/instructors");
      const coursesResponse = await instance.get('courses');

      setDepartments(departmentResponse.data);
      setCourses(coursesResponse.data);
      setInstructors(instResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  // Open Add Course Modal
  const openAddModal = () => {
    setNewCourse({ name: '', departmentId: '', instructorId: '' });
    setErrorMessage('');
    setShowAddModal(true);
  };

  // Close Add Course Modal
  const closeAddModal = () => {
    setShowAddModal(false);
  };

  // Open Edit Course Modal
  const openEditModal = (course) => {
    setSelectedCourse(course);
    setShowEditModal(true);
  };

  // Close Edit Course Modal
  const closeEditModal = () => {
    setShowEditModal(false);
  };

  // Open Delete Confirmation Modal
  const openDeleteModal = (course) => {
    setSelectedCourse(course);
    setShowDeleteModal(true);
  };

  // Close Delete Modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  //add course
  const handleAddCourse = async () => {
    try {
      const { departmentId, instructorId, name } = newCourse;
  
      // Validate if all necessary fields are filled
      if (!name || !departmentId || !instructorId) {
        setErrorMessage("All fields are required.");
        return;
      }
  
      // Clear previous error message
      setErrorMessage("");
  
      // Check if the selected instructor is the head of the department
      const selectedDepartment = departments.find(
        (dept) => dept.id === parseInt(departmentId)
      );
      if (
        selectedDepartment &&
        selectedDepartment.head &&
        parseInt(instructorId) === selectedDepartment.head.id
      ) {
        const instructorCourses = await instance.get(
          `courses/instructor/${selectedDepartment.head.id}`
        );
        if (instructorCourses.data.length > 0) {
          setErrorMessage("Department head can only teach one course.");
          return;
        }
      }
  
      // Attempt to add the new course
      await instance.post("/courses", {
        name, // The course name
        departmentId, // ID of the selected department
        instructorId, // ID of the selected instructor
      });
  
      // Close the modal and refresh the course list
      setShowAddModal(false);
      fetchDepartmentsAndCourses(); // Refresh course list after adding the new course
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // Show message if the course name already exists (case-sensitive check from backend)
        setErrorMessage("Course name is already taken. Please choose a different name.");
      } else {
        console.error("Error adding course:", error);
        setErrorMessage("Failed to add course. Please try again.");
      }
    }
  };
  
  // Edit course
  const handleEditCourse = async () => {
    try {
      await instance.put(`courses/${selectedCourse.id}`, {
        name: selectedCourse.name,
        departmentId: selectedCourse.departmentId,
        instructorId: selectedCourse.instructorId,
      });
      setShowEditModal(false);
      fetchDepartmentsAndCourses();  // Refresh data after editing
    } catch (error) {
      console.error('Error editing course:', error);
    }
  };

  // Delete course
  const handleDeleteCourse = async () => {
    try {
      await instance.delete(`courses/${selectedCourse.id}`);
      setShowDeleteModal(false);
      fetchDepartmentsAndCourses();  // Refresh data after deleting
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />
    <div className=" p-8">
      <h1 className="text-3xl font-semibold mb-8">Manage Courses</h1>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        onClick={openAddModal}
      >
        Add Course
      </button>

      {/* Courses Table */}
      <div className="mt-8">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="px-4 py-2">Course Name</th>
                <th className="px-4 py-2">Instructor Name</th>
                <th className="px-4 py-2">Department Name</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td className="border px-4 py-2">{course.name}</td>
                  <td className="border px-4 py-2">{course.instructor?.name || 'Unknown'}</td>
                  <td className="border px-4 py-2">{course.department?.name || 'Unknown'}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-yellow-500 text-white px-4 py-1 rounded-lg hover:bg-yellow-600 mr-2"
                      onClick={() => openEditModal(course)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
                      onClick={() => openDeleteModal(course)}
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

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl mb-4">Add New Course</h2>
            <input
              type="text"
              className="w-full p-2 border rounded-lg mb-4"
              placeholder="Enter Course Name"
              value={newCourse.name}
              onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
            />
            <select
              className="w-full p-2 border rounded-lg mb-4"
              value={newCourse.departmentId}
              onChange={(e) => setNewCourse({ ...newCourse, departmentId: e.target.value })}
            >
              <option value="">Select Department</option>
              {departments.map(department => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
            <select
              className="w-full p-2 border rounded-lg mb-4"
              value={newCourse.instructorId}
              onChange={(e) => setNewCourse({ ...newCourse, instructorId: e.target.value })}
            >
              <option value="">Select Instructor</option>
              {newCourse.departmentId && departments.find(dept => dept.id === parseInt(newCourse.departmentId))?.instructors.map(instructor => (
                <option key={instructor.id} value={instructor.id}>
                  {instructor.name}
                </option>
              ))}
            </select>
            {errorMessage && (
              <p className="text-red-500 mb-4">{errorMessage}</p>
            )}
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              onClick={handleAddCourse}
            >
              Add Course
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              onClick={closeAddModal}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl mb-4">Edit Course</h2>
          
<input
  type="text"
  className="w-full p-2 border rounded-lg mb-4"
  value={selectedCourse.name}
  onChange={(e) => setSelectedCourse({ ...selectedCourse, name: e.target.value })}
/>


<select
  className="w-full p-2 border rounded-lg mb-4"
  value={selectedCourse.departmentId || ''}
  onChange={(e) => setSelectedCourse({ 
    ...selectedCourse, 
    departmentId: e.target.value,
    instructorId: '' // Reset instructor when department changes
  })}
>
  <option value="">Select Department</option>
  {departments.map(department => (
    <option key={department.id} value={department.id}>
      {department.name}
    </option>
  ))}
</select>


<select
  className="w-full p-2 border rounded-lg mb-4"
  value={selectedCourse.instructorId || ''}
  onChange={(e) => setSelectedCourse({ ...selectedCourse, instructorId: e.target.value })}
>
  <option value="">Select Instructor</option>
  {selectedCourse.departmentId && departments.find(dept => dept.id === parseInt(selectedCourse.departmentId))?.instructors.map(instructor => (
    <option key={instructor.id} value={instructor.id}>
      {instructor.name}
    </option>
  ))}
</select>

            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              onClick={handleEditCourse}
            >
              Save Changes
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              onClick={closeEditModal}
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
            <h2 className="text-2xl mb-4">Are you sure you want to delete this course?</h2>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mr-4"
              onClick={handleDeleteCourse}
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

export default ManageCourses;
