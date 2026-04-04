import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import LoadingScreen from './components/LoadingScreen';

// Lazy-loaded pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const MovieDetail = lazy(() => import('./pages/MovieDetail'));
const SearchPage = lazy(() => import('./pages/Search'));
const Profile = lazy(() => import('./pages/Profile'));

// Page loading fallback
const PageLoader = () => (
  <div className="min-h-screen bg-cine-black flex items-center justify-center">
    <div className="w-10 h-10 border-2 border-cine-red/30 border-t-cine-red rounded-full animate-spin" />
  </div>
);

// Page transition wrapper
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
  >
    {children}
  </motion.div>
);

// Private route guard
const PrivateRoute = ({ children }) => {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return <PageLoader />;
  return user ? children : <Navigate to="/login" />;
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/login"
          element={
            <Suspense fallback={<PageLoader />}>
              <PageTransition>
                <Login />
              </PageTransition>
            </Suspense>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Suspense fallback={<PageLoader />}>
                <PageTransition>
                  <Home />
                </PageTransition>
              </Suspense>
            </PrivateRoute>
          }
        />
        <Route
          path="/movie/:id"
          element={
            <PrivateRoute>
              <Suspense fallback={<PageLoader />}>
                <PageTransition>
                  <MovieDetail />
                </PageTransition>
              </Suspense>
            </PrivateRoute>
          }
        />
        <Route
          path="/search"
          element={
            <PrivateRoute>
              <Suspense fallback={<PageLoader />}>
                <PageTransition>
                  <SearchPage />
                </PageTransition>
              </Suspense>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Suspense fallback={<PageLoader />}>
                <PageTransition>
                  <Profile />
                </PageTransition>
              </Suspense>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [showLoading, setShowLoading] = useState(true);

  return (
    <AuthProvider>
      <Router>
        <AnimatePresence mode="wait">
          {showLoading ? (
            <LoadingScreen key="loading" onComplete={() => setShowLoading(false)} />
          ) : (
            <motion.div
              key="app"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-cine-black min-h-screen text-white font-sans overflow-x-hidden"
            >
              <Navbar />
              <AnimatedRoutes />
            </motion.div>
          )}
        </AnimatePresence>
      </Router>
    </AuthProvider>
  );
}

export default App;
