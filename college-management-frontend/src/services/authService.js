import axios from 'axios';

const API_URL = 'http://localhost:9090/api/auth/';

const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null; // Get token from localStorage

const instance = axios.create({
  baseURL: API_URL,
  headers: { Authorization: `Bearer ${token}` } // Include token in Authorization header
});
export const login = async (email, password) => {
  return instance // Use the configured instance
    .post('signin', { email, password })
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
        console.log(response.data);
     
      }
      return response.data;
    });
};

 export const logout = async() => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

export const getCurrentUser = async() => {
  return JSON.parse(localStorage.getItem('user'));
};

export const getRoles =async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? user.roles : [];
};




