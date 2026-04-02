import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import MovieRow from '../components/MovieRow';
import { History, Bookmark } from 'lucide-react';

const Profile = () => {
  const { user, watchlist, history } = useContext(AuthContext);

  if (!user) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 pb-12"
    >
      {/* Header Profile Section */}
      <div className="px-4 md:px-12 mb-12 flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-cine-red to-cine-red-dark flex items-center justify-center text-4xl md:text-5xl font-black shadow-lg shadow-cine-red/20 border-4 border-cine-black">
          {(user.full_name || user.email)?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {user.full_name || 'CineScope Member'}
          </h1>
          <p className="text-cine-gray-200">
            {user.email}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Watch History */}
        {history?.length > 0 ? (
          <MovieRow title="Watch History" moviesData={history} />
        ) : (
          <div className="px-4 md:px-12 mb-12">
            <h2 className="text-white text-lg md:text-2xl font-bold mb-4 flex items-center gap-3">
              Watch History
            </h2>
            <div className="py-12 flex flex-col items-center justify-center text-cine-gray-300 bg-white/5 rounded-xl border border-white/5">
              <History size={32} className="mb-3 opacity-50" />
              <p>No watch history yet</p>
            </div>
          </div>
        )}

        {/* Watchlist */}
        {watchlist?.length > 0 ? (
          <MovieRow title="My Watchlist" moviesData={watchlist} />
        ) : (
          <div className="px-4 md:px-12 mb-12">
            <h2 className="text-white text-lg md:text-2xl font-bold mb-4 flex items-center gap-3">
              My Watchlist
            </h2>
            <div className="py-12 flex flex-col items-center justify-center text-cine-gray-300 bg-white/5 rounded-xl border border-white/5">
              <Bookmark size={32} className="mb-3 opacity-50" />
              <p>Your watchlist is empty</p>
            </div>
          </div>
        )}

        {/* Recommendations */}
        <MovieRow title="Recommended for You" fetchUrl="/movies/popular" />
      </div>
    </motion.div>
  );
};

export default Profile;
