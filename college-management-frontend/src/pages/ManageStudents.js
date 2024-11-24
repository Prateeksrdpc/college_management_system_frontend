import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';



const ManageStudents = () => {
  const API_URL = 'http://localhost:9090/api/';
const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;

const instance = axios.create({
  baseURL: API_URL,
  headers: { Authorization: `Bearer ${token}` },
});
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]); // Array of course IDs
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // Fetch students and courses on component mount
  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await instance.get('students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await instance.get('courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  // Handling Add Student
  const handleAddStudent = () => {
    setStudentName('');
    setStudentEmail('');
    setSelectedCourses([]); // Reset selected courses
    setEditingStudent(null);
    setIsAddModalOpen(true);
  };

  // Handling Edit Student
  const handleEditStudent = (student) => {
    setStudentName(student.name);
    setStudentEmail(student.email);
    setSelectedCourses(student.courses.map(course => course.id));
    setEditingStudent(student);
    setIsEditModalOpen(true);
  };

  // Handling Delete Student
  const handleDeleteStudent = (student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (isEditing = false) => {
    const studentData = {
      name: studentName,
      email: studentEmail,
      courses: selectedCourses.map(courseId => ({ id: courseId })),
    };

    try {
      if (isEditing && editingStudent) {
        await instance.put(`students/${editingStudent.id}`, studentData);
      } else {
        await instance.post('students', studentData);
      }
      fetchStudents(); // Refresh the students list after submit
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error saving student:', error);
    }
  };

  const confirmDeleteStudent = async () => {
    try {
      await instance.delete(`students/${studentToDelete.id}`);
      fetchStudents();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handleCourseSelect = (event) => {
    const selectedCourseId = parseInt(event.target.value);
    if (selectedCourseId && !selectedCourses.includes(selectedCourseId)) {
      setSelectedCourses([...selectedCourses, selectedCourseId]);
    }
  };

  const removeCourse = (courseId) => {
    setSelectedCourses(selectedCourses.filter(course => course !== courseId));
  };

  return (
    <div className="flex">
      <AdminSidebar />
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Manage Students</h2>
      <button onClick={handleAddStudent} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 mb-4 rounded-lg shadow-lg">
        Add Student
      </button>
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-200 text-center">
            <th className="px-4 py-2 border">Student Name</th>
            <th className="px-4 py-2 border">Courses List</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td className="px-4 py-2 border">{student.name}</td>
              <td className="px-4 py-2 border">{student.courses.map(course => course.name).join(', ')}</td>
              <td className="px-4 py-2 border">
                <button onClick={() => handleEditStudent(student)} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 mr-2 rounded-lg">
                  Edit
                </button>
                <button onClick={() => handleDeleteStudent(student)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <Modal
          title="Add Student"
          studentName={studentName}
          setStudentName={setStudentName}
          studentEmail={studentEmail}
          setStudentEmail={setStudentEmail}
          courses={courses}
          selectedCourses={selectedCourses}
          handleCourseSelect={handleCourseSelect}
          removeCourse={removeCourse}
          handleSubmit={() => handleSubmit(false)}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {/* Edit Student Modal */}
      {isEditModalOpen && (
        <Modal
          title="Edit Student"
          studentName={studentName}
          setStudentName={setStudentName}
          studentEmail={studentEmail}
          setStudentEmail={setStudentEmail}
          courses={courses}
          selectedCourses={selectedCourses}
          handleCourseSelect={handleCourseSelect}
          removeCourse={removeCourse}
          handleSubmit={() => handleSubmit(true)}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3>Are you sure you want to delete this student?</h3>
            <div className="flex justify-end mt-4">
              <button onClick={confirmDeleteStudent} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg">
                Yes
              </button>
              <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-lg ml-4">
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

const Modal = ({ title, studentName, setStudentName, studentEmail, setStudentEmail, courses, selectedCourses, handleCourseSelect, removeCourse, handleSubmit, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h3 className="text-xl mb-4">{title}</h3>
        <input
          type="text"
          placeholder="Student Name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          className="border rounded-lg w-full p-2 mb-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={studentEmail}
          onChange={(e) => setStudentEmail(e.target.value)}
          className="border rounded-lg w-full p-2 mb-4"
        />
        <div className="mb-4">
          <h4 className="text-lg mb-2">Select Courses:</h4>
          <select onChange={handleCourseSelect} className="border rounded-lg p-2 w-full mb-4">
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
          <div className="flex flex-wrap gap-2">
            {selectedCourses.map((courseId) => (
              <div key={courseId} className="bg-blue-500 text-white p-2 rounded-lg">
                {courses.find((course) => course.id === courseId)?.name}
                <button onClick={() => removeCourse(courseId)} className="ml-2 text-red-500">x</button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg mr-2">
            Submit
          </button>
          <button onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-lg">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageStudents;
