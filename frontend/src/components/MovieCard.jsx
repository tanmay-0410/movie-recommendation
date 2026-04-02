import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Play, Plus, Star, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const TMDB_IMAGE_BASE = "https://wsrv.nl/?url=image.tmdb.org/t/p/w342";

const MovieCard = ({ movie, index = 0 }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { watchlist, history, toggleWatchlist, addToHistory } = useContext(AuthContext);

  const rating = (movie.vote_average || 0).toFixed(1);
  const year = (movie.release_date || movie.first_air_date || '').split('-')[0];

  const inWatchlist = watchlist?.some(m => m.id === movie.id);
  const inHistory = history?.some(m => m.id === movie.id);

  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ scale: 1.05, zIndex: 20 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      className="relative min-w-[90px] md:min-w-[90px] aspect-[2/3] rounded-xl overflow-hidden
                 shrink-0 cursor-pointer gpu group"
      style={{
        boxShadow: isHovered
          ? '0 16px 48px rgba(0,0,0,0.8), 0 0 30px rgba(229,9,20,0.15)'
          : '0 4px 16px rgba(0,0,0,0.4)',
        transition: 'box-shadow 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }}
    >
      {/* Skeleton placeholder */}
      {!imageLoaded && (
        <div className="absolute inset-0 skeleton rounded-xl" />
      )}

      {/* Movie poster */}
      <img
        src={`${TMDB_IMAGE_BASE}${movie.poster_path || movie.backdrop_path}`}
        alt={movie.title || movie.name}
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
        className={`w-full h-full object-cover rounded-xl transition-all duration-500
          ${imageLoaded ? 'opacity-100' : 'opacity-0'}
          ${isHovered ? 'scale-105 brightness-50' : 'scale-100 brightness-100'}`}
      />

      {/* Hover overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-gradient-to-t from-cine-black via-cine-black/60 to-transparent
                   flex flex-col justify-end p-4"
      >
        {/* Title */}
        <motion.h4
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0 }}
          transition={{ delay: 0.05, duration: 0.25 }}
          className="text-white text-xs font-bold mb-1 line-clamp-2 leading-snug"
        >
          {movie.title || movie.name}
        </motion.h4>

        {/* Meta info */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0 }}
          transition={{ delay: 0.1, duration: 0.25 }}
          className="flex items-center gap-2 mb-3 text-xs"
        >
          <span className="flex items-center gap-1 text-yellow-400">
            <Star size={10} fill="currentColor" />
            {rating}
          </span>
          {year && <span className="text-cine-gray-200">{year}</span>}
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0 }}
          transition={{ delay: 0.15, duration: 0.25 }}
          className="flex items-center gap-2"
        >
          <button
            onClick={(e) => { 
                e.stopPropagation(); 
                if (!inHistory) addToHistory(movie);
            }}
            className={`p-1.5 rounded-full border transition-all duration-200 active:scale-90 backdrop-blur-sm
              ${inHistory ? 'bg-cine-red text-white border-cine-red' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}
            title={inHistory ? "Watched" : "Mark as watched"}
          >
            <Check size={12} />
          </button>
          
          <button
            onClick={(e) => { 
                e.stopPropagation(); 
                toggleWatchlist(movie); 
            }}
            className={`p-1.5 rounded-full border transition-all duration-200 active:scale-90 backdrop-blur-sm
              ${inWatchlist ? 'bg-white text-black border-white' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}
            title="Watchlist"
          >
            {inWatchlist ? <Check size={12} /> : <Plus size={12} />}
          </button>
        </motion.div>
      </motion.div>

      {/* Rating badge (always visible) */}
      <div className="absolute top-2 right-2 bg-cine-black/70 backdrop-blur-sm text-yellow-400
                      text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5
                      border border-white/5">
        <Star size={8} fill="currentColor" />
        {rating}
      </div>
    </motion.div>
  );
};

export default MovieCard;
