import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [watchlist, setWatchlist] = useState([]);
  const [history, setHistory] = useState([]);

  // Load user data from local storage when user changes
  useEffect(() => {
    if (user && user.email) {
      const storedWatchlist = localStorage.getItem(`watchlist_${user.email}`);
      const storedHistory = localStorage.getItem(`history_${user.email}`);
      if (storedWatchlist) setWatchlist(JSON.parse(storedWatchlist));
      if (storedHistory) setHistory(JSON.parse(storedHistory));
    } else {
      setWatchlist([]);
      setHistory([]);
    }
  }, [user]);

  // Sync to local storage
  useEffect(() => {
    if (user && user.email) {
      localStorage.setItem(`watchlist_${user.email}`, JSON.stringify(watchlist));
      localStorage.setItem(`history_${user.email}`, JSON.stringify(history));
    }
  }, [watchlist, history, user]);

  const toggleWatchlist = (movie) => {
    setWatchlist((prev) => {
      const exists = prev.find(m => m.id === movie.id);
      if (exists) return prev.filter(m => m.id !== movie.id);
      return [movie, ...prev];
    });
  };

  const addToHistory = (movie) => {
    setHistory((prev) => {
      const filtered = prev.filter(m => m.id !== movie.id);
      return [movie, ...filtered];
    });
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/users/me');
          setUser(res.data);
        } catch (error) {
          console.error("Error fetching user", error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    
    const res = await api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    localStorage.setItem('token', res.data.access_token);
    
    const userRes = await api.get('/users/me');
    setUser(userRes.data);
  };

  const signup = async (email, password, fullName) => {
    await api.post('/auth/signup', { email, password, full_name: fullName });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, setUser, login, signup, logout, loading,
      watchlist, history, toggleWatchlist, addToHistory
    }}>
      {children}
    </AuthContext.Provider>
  );
};
