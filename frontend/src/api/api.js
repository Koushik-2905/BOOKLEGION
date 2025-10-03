import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth APIs
export const signup = (userData) => api.post('/signup', userData);
export const login = (credentials) => api.post('/auth/login', credentials);

// Movie APIs
export const getMovies = (genreId = null) => {
  const url = genreId ? `/movies/?genre_id=${genreId}` : '/movies/';
  return api.get(url);
};
export const addMovie = (movieData) => api.post('/movies', movieData);
export const updateMovie = (movieId, movieData) => api.put(`/movies/${movieId}`, movieData);
export const deleteMovie = (movieId, adminEmail, adminPassword) => {
  return api.delete(`/movies/${movieId}?admin_email=${adminEmail}&admin_password=${adminPassword}`);
};

// Genre APIs
export const getGenres = () => api.get('/genres/');
export const addGenre = (genreData) => api.post('/genres', genreData);
export const updateGenre = (genreId, genreData) => api.put(`/genres/${genreId}`, genreData);
export const deleteGenre = (genreId, adminEmail, adminPassword) => {
  return api.delete(`/genres/${genreId}?admin_email=${adminEmail}&admin_password=${adminPassword}`);
};

// Watchlist APIs
export const getWatchlist = (userId) => api.get(`/watchlist/${userId}`);
export const addToWatchlist = (watchlistData) => api.post('/watchlist/', watchlistData);
export const removeFromWatchlist = (watchlistId) => api.delete(`/watchlist/${watchlistId}`);

// Booking APIs
export const createBooking = (bookingData) => api.post('/bookings', bookingData);

// Payment APIs
export const addPayment = (paymentData) => api.post('/payments', paymentData);

// Review APIs
export const getReviews = (movieId) => api.get(`/reviews/${movieId}`);

// User Management APIs (Admin)
export const getUsers = (adminEmail, adminPassword) => {
  return api.get(`/users/?admin_email=${adminEmail}&admin_password=${adminPassword}`);
};
export const addUser = (userData) => api.post('/users', userData);
export const updateUser = (userId, userData) => api.put(`/users/${userId}`, userData);
export const deleteUser = (userId, adminEmail, adminPassword) => {
  return api.delete(`/users/${userId}?admin_email=${adminEmail}&admin_password=${adminPassword}`);
};

export default api;