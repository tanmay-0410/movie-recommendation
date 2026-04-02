import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import MovieCard from './MovieCard';
import { SkeletonCard } from './SkeletonCard';
import api from '../api/axios';

const MovieRow = ({ title, fetchUrl, moviesData }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const rowRef = useRef(null);

  useEffect(() => {
    if (moviesData) {
      setMovies(moviesData);
      setLoading(false);
      return;
    }
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const request = await api.get(fetchUrl);
        setMovies(request.data.results || request.data);
      } catch (error) {
        console.error("Error fetching row:", error);
      } finally {
        setLoading(false);
      }
    };
    if (fetchUrl) fetchData();
  }, [fetchUrl, moviesData]);

  const updateArrows = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 20);
    }
  };

  useEffect(() => {
    const el = rowRef.current;
    if (el) {
      el.addEventListener('scroll', updateArrows, { passive: true });
      updateArrows();
      return () => el.removeEventListener('scroll', updateArrows);
    }
  }, [movies]);

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.8;
      const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!loading && (!movies || movies.length === 0)) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="my-8 md:my-10 relative group"
    >
      {/* Section title */}
      <h2 className="text-white text-lg md:text-2xl font-bold mb-4 px-4 md:px-12
                     flex items-center gap-3">
        <span>{title}</span>
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="text-xs text-cine-gray-300 font-normal opacity-0 group-hover:opacity-100
                     transition-opacity duration-300 hidden md:inline-flex items-center gap-1
                     cursor-pointer hover:text-cine-red"
        >
          Explore All →
        </motion.span>
      </h2>

      <div className="relative">
        {/* Left arrow */}
        <button
          onClick={() => handleScroll('left')}
          className={`absolute left-0 top-0 bottom-0 z-30 w-12 md:w-14
                     bg-gradient-to-r from-cine-black/90 to-transparent
                     flex items-center justify-center
                     transition-all duration-300 hidden md:flex
                     ${showLeftArrow ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <div className="bg-cine-dark/80 backdrop-blur-sm p-2 rounded-full border border-white/10
                         hover:bg-white/10 hover:border-white/20 transition-all">
            <ChevronLeft size={20} className="text-white" />
          </div>
        </button>

        {/* Scrollable row */}
        <div
          ref={rowRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth px-4 md:px-12 py-2"
        >
          {loading
            ? Array.from({ length: 7 }).map((_, i) => <SkeletonCard key={i} />)
            : movies.map((movie, index) =>
                (movie.poster_path || movie.backdrop_path) ? (
                  <MovieCard key={movie.id} movie={movie} index={index} />
                ) : null
              )
          }
        </div>

        {/* Right arrow */}
        <button
          onClick={() => handleScroll('right')}
          className={`absolute right-0 top-0 bottom-0 z-30 w-12 md:w-14
                     bg-gradient-to-l from-cine-black/90 to-transparent
                     flex items-center justify-center
                     transition-all duration-300 hidden md:flex
                     ${showRightArrow ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <div className="bg-cine-dark/80 backdrop-blur-sm p-2 rounded-full border border-white/10
                         hover:bg-white/10 hover:border-white/20 transition-all">
            <ChevronRight size={20} className="text-white" />
          </div>
        </button>

        {/* Edge fade effects */}
        <div className="absolute left-0 top-0 bottom-0 w-4 md:w-12 bg-gradient-to-r from-cine-black to-transparent pointer-events-none z-20" />
        <div className="absolute right-0 top-0 bottom-0 w-4 md:w-12 bg-gradient-to-l from-cine-black to-transparent pointer-events-none z-20" />
      </div>
    </motion.div>
  );
};

export default MovieRow;
