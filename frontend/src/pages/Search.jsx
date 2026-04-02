import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, X, Filter } from 'lucide-react';
import api from '../api/axios';
import MovieCard from '../components/MovieCard';

const GENRE_MAP = [
  { id: 28, name: 'Action', emoji: '🎯' },
  { id: 12, name: 'Adventure', emoji: '🗺️' },
  { id: 16, name: 'Animation', emoji: '🎨' },
  { id: 35, name: 'Comedy', emoji: '😂' },
  { id: 80, name: 'Crime', emoji: '🔍' },
  { id: 18, name: 'Drama', emoji: '🎭' },
  { id: 14, name: 'Fantasy', emoji: '✨' },
  { id: 27, name: 'Horror', emoji: '😱' },
  { id: 10749, name: 'Romance', emoji: '💕' },
  { id: 878, name: 'Sci-Fi', emoji: '🔮' },
  { id: 53, name: 'Thriller', emoji: '😰' },
  { id: 10752, name: 'War', emoji: '⚔️' },
];

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounced search
  const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  const performSearch = useCallback(
    debounce(async (searchQuery) => {
      if (!searchQuery.trim()) {
        setMovies([]);
        setHasSearched(false);
        return;
      }
      try {
        setLoading(true);
        setHasSearched(true);
        setSelectedGenre(null);
        const res = await api.get(`/movies/search?query=${encodeURIComponent(searchQuery)}`);
        setMovies(res.data.results || []);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    performSearch(val);
    if (val.trim()) {
      setSearchParams({ q: val });
    } else {
      setSearchParams({});
    }
  };

  const handleGenreClick = async (genre) => {
    if (selectedGenre === genre.id) {
      setSelectedGenre(null);
      setMovies([]);
      setHasSearched(false);
      return;
    }
    try {
      setLoading(true);
      setSelectedGenre(genre.id);
      setQuery('');
      setSearchParams({});
      setHasSearched(true);
      const res = await api.get(`/movies/discover/${genre.id}`);
      setMovies(res.data.results || []);
    } catch (err) {
      console.error("Genre fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setMovies([]);
    setSelectedGenre(null);
    setHasSearched(false);
    setSearchParams({});
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-cine-black pt-20 pb-20 grain"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-12">
        {/* Search header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
            Explore <span className="text-gradient">Movies</span>
          </h1>

          {/* Search bar */}
          <div className="relative max-w-2xl">
            <SearchIcon size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-cine-gray-300" />
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Search for movies..."
              autoFocus
              className="w-full bg-cine-dark/60 border border-white/10 text-white text-base
                       pl-14 pr-12 py-4 rounded-2xl focus:outline-none focus:border-cine-red/40
                       focus:ring-1 focus:ring-cine-red/20 transition-all duration-300
                       placeholder:text-cine-gray-300 backdrop-blur-sm"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-cine-gray-300
                         hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </motion.div>

        {/* Genre chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          <div className="flex items-center gap-2 mr-2 text-cine-gray-300">
            <Filter size={14} />
            <span className="text-xs font-medium">Genres:</span>
          </div>
          {GENRE_MAP.map((genre, i) => (
            <motion.button
              key={genre.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.03 }}
              onClick={() => handleGenreClick(genre)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-300
                ${selectedGenre === genre.id
                  ? 'bg-cine-red text-white border-cine-red shadow-glow'
                  : 'bg-white/5 border border-white/10 text-cine-gray-100 hover:bg-white/10 hover:border-white/20'
                }`}
            >
              {genre.emoji} {genre.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-cine-red/30 border-t-cine-red rounded-full animate-spin" />
          </div>
        ) : hasSearched ? (
          <>
            <p className="text-cine-gray-200 text-sm mb-6">
              {movies.length} results found
              {query && <span> for "<span className="text-white font-medium">{query}</span>"</span>}
              {selectedGenre && (
                <span> in <span className="text-white font-medium">
                  {GENRE_MAP.find(g => g.id === selectedGenre)?.name}
                </span></span>
              )}
            </p>

            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {movies.map((movie, index) =>
                  movie.poster_path ? (
                    <motion.div
                      key={movie.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.03, duration: 0.3 }}
                    >
                      <MovieCard movie={movie} index={index} />
                    </motion.div>
                  ) : null
                )}
              </AnimatePresence>
            </motion.div>

            {movies.length === 0 && (
              <div className="text-center py-20">
                <p className="text-cine-gray-300 text-lg">No movies found</p>
                <p className="text-cine-gray-400 text-sm mt-2">Try a different search term</p>
              </div>
            )}
          </>
        ) : (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🎬</div>
            <p className="text-cine-gray-200 text-lg font-medium">
              Search for your favorite movies
            </p>
            <p className="text-cine-gray-400 text-sm mt-2">
              Or browse by genre using the filters above
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SearchPage;
