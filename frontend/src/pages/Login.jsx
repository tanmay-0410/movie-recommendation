import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, User, Lock, Loader2 } from 'lucide-react';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (isSignUp) {
        await signup(email, password, fullName);
        setIsSignUp(false);
        setSuccess('Account created successfully! Please sign in.');
        setFullName('');
        setPassword('');
      } else {
        await login(email, password);
        navigate('/');
      }
    } catch (err) {
      if (!err.response) {
        setError("Cannot connect to server. Is the backend running?");
      } else if (Array.isArray(err.response.data?.detail)) {
        setError(err.response.data.detail[0].msg || "Validation error");
      } else {
        setError(err.response?.data?.detail || "An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setSuccess('');
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.1, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
    }),
  };

  return (
    <div className="relative min-h-screen w-full bg-cine-black flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('https://image.tmdb.org/t/p/w1280/2RVcJbWFmICRDsVxBI9F58Rah3q.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cine-black via-cine-black/60 to-cine-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-cine-black/80 via-transparent to-cine-black/80" />
      </div>

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      w-[600px] h-[600px] bg-cine-red/5 rounded-full blur-3xl pointer-events-none" />

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="glass-strong rounded-2xl p-8 md:p-10 shadow-2xl shadow-black/50">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-wider mb-2">
              <span className="text-gradient">CINE</span>
              <span className="text-white">SCOPE</span>
            </h1>
            <motion.h2
              key={isSignUp ? 'signup' : 'signin'}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-cine-gray-200 text-sm"
            >
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </motion.h2>
          </div>

          {/* Messages */}
          <AnimatePresence mode="wait">
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="bg-green-500/10 border border-green-500/20 text-green-400
                         p-3 mb-4 rounded-lg text-sm backdrop-blur-sm"
              >
                {success}
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="bg-cine-red/10 border border-cine-red/20 text-cine-red
                         p-3 mb-4 rounded-lg text-sm backdrop-blur-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <AnimatePresence mode="wait">
              {isSignUp && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-cine-gray-300" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-cine-dark/60 border border-white/10 text-white rounded-xl
                               pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-cine-red/50
                               focus:ring-1 focus:ring-cine-red/20 transition-all duration-300
                               placeholder:text-cine-gray-300 backdrop-blur-sm"
                      required={isSignUp}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div custom={0} variants={inputVariants} initial="hidden" animate="visible">
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-cine-gray-300" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-cine-dark/60 border border-white/10 text-white rounded-xl
                           pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-cine-red/50
                           focus:ring-1 focus:ring-cine-red/20 transition-all duration-300
                           placeholder:text-cine-gray-300 backdrop-blur-sm"
                  required
                />
              </div>
            </motion.div>

            <motion.div custom={1} variants={inputVariants} initial="hidden" animate="visible">
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-cine-gray-300" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-cine-dark/60 border border-white/10 text-white rounded-xl
                           pl-11 pr-11 py-3.5 text-sm focus:outline-none focus:border-cine-red/50
                           focus:ring-1 focus:ring-cine-red/20 transition-all duration-300
                           placeholder:text-cine-gray-300 backdrop-blur-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-cine-gray-300
                           hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </motion.div>

            <motion.button
              custom={2}
              variants={inputVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="btn-primary py-3.5 text-sm mt-2 flex items-center justify-center gap-2
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <span className="font-bold">{isSignUp ? 'Create Account' : 'Sign In'}</span>
              )}
            </motion.button>
          </form>

          {/* Toggle mode */}
          <motion.div
            custom={3}
            variants={inputVariants}
            initial="hidden"
            animate="visible"
            className="mt-6 text-center text-sm text-cine-gray-200"
          >
            {isSignUp ? 'Already have an account? ' : 'New to CineScope? '}
            <button
              type="button"
              onClick={toggleMode}
              className="text-white hover:text-cine-red font-semibold transition-colors duration-300"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
