import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const API_URL = 'http://localhost:8080/api/v1';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(sessionStorage.getItem('token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem('token'));
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        setLoading(true);
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const res = await axios.get(`${API_URL}/users/me`);
          const userData = res.data.data.user;

          setUser(userData);
          setIsAuthenticated(true);

          if (userData.role && userData.role.toLowerCase() === 'admin') {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
            const favoriteIds = userData.favorites?.vehicles.map(v => v._id) || [];
            setFavorites(favoriteIds);
          }
        } catch (err) {
          console.error('Failed to fetch user data', err?.response?.data?.message || err.message);
          logout();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  const login = async (email, password) => {
    try {
      // 1. Authenticate and get token
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token, data } = res.data;

      if (!data.user || !data.user.role) {
        throw new Error("Login response was missing user data.");
      }

      // 2. Set token in storage and axios headers
      sessionStorage.setItem("token", token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setLoading(true);

      // 3. Fetch user data *immediately* to update auth state
      try {
        const userRes = await axios.get(`${API_URL}/users/me`);
        const userData = userRes.data.data.user;

        // 4. Set all state variables
        setUser(userData);
        setIsAuthenticated(true);

        if (userData.role && userData.role.toLowerCase() === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          const favoriteIds = userData.favorites?.vehicles.map(v => v._id) || [];
          setFavorites(favoriteIds);
        }

        // 5. Set the token state (which will trigger useEffect, but it's fine)
        setToken(token);
        setLoading(false);

        // 6. Now, safely return the role
        return userData.role;

      } catch (err) {
        console.error('Failed to fetch user data during login', err?.response?.data?.message || err.message);
        logout(); // Log out if fetching user data fails
        throw err; // Re-throw error to be caught below
      }

    } catch (err) {
      setLoading(false); // Ensure loading is off on failure
      throw new Error(err?.response?.data?.message || "Login failed");
    }
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    setFavorites([]);
    delete axios.defaults.headers.common['Authorization'];
  };

  const toggleFavorite = async (vehicleId) => {
    if (!isAuthenticated || isAdmin) {
      return;
    }

    const isFavorited = favorites.includes(vehicleId);

    try {
      if (isFavorited) {
        await axios.delete(`${API_URL}/users/my-favorites/vehicles/${vehicleId}`);
        setFavorites(prev => prev.filter(id => id !== vehicleId));
      } else {
        await axios.post(`${API_URL}/users/my-favorites/vehicles`, { vehicleId });
        setFavorites(prev => [...prev, vehicleId]);
      }
    } catch (err) {
      console.error('Failed to toggle favorite', err);
    }
  };

  const isFavorited = (vehicleId) => {
    return favorites.includes(vehicleId);
  };

  const value = {
    user,
    setUser,
    token,
    isAuthenticated,
    isAdmin,
    loading,
    favorites,
    isFavorited,
    toggleFavorite,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};