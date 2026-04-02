import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import MovieRow from '../components/MovieRow';
import api from '../api/axios';
import { Play, Info, Star, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TMDB_IMAGE_BASE = "https://wsrv.nl/?url=image.tmdb.org/t/p/w1280";

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await api.get('/movies/trending');
        const results = res.data.results || res.data;
        if (results && results.length > 0) {
          setTrendingMovies(results.slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to load trending", err);
      }
    };
    fetchTrending();
  }, []);

  // Auto-rotate the hero movie every 8 seconds
  useEffect(() => {
    if (trendingMovies.length === 0) return;
    const interval = setInterval(() => {
      setHeroLoaded(false); // trigger crossfade
      setHeroIndex((prev) => (prev + 1) % trendingMovies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [trendingMovies]);

  const heroMovie = trendingMovies[heroIndex] || null;

  const heroRating = heroMovie ? (heroMovie.vote_average || 0).toFixed(1) : '0';
  const heroYear = heroMovie ? (heroMovie.release_date || '').split('-')[0] : '';

  return (
    <div className="relative min-h-screen grain">
      {/* === HERO SECTION === */}
      <div className="relative h-[80vh] md:h-[95vh] w-full overflow-hidden">
        {heroMovie && (
          <motion.div
            key={heroMovie.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="w-full h-full absolute inset-0"
          >
            {/* Hero backdrop */}
            <motion.img
              src={`${TMDB_IMAGE_BASE}${heroMovie.backdrop_path}`}
              alt={heroMovie.title || heroMovie.name}
              onLoad={() => setHeroLoaded(true)}
              initial={{ scale: 1.1 }}
              animate={{ scale: heroLoaded ? 1 : 1.1 }}
              transition={{ duration: 10, ease: 'linear' }}
              className="w-full h-full object-cover"
            />

            {/* Multi-layer gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-cine-black via-cine-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-cine-black/80 via-transparent to-transparent" />
            <div className="absolute top-0 left-0 w-full h-[30%] bg-gradient-to-b from-cine-black/60 to-transparent" />

            {/* Hero content */}
            <div className="absolute bottom-[15%] md:bottom-[18%] left-0 px-4 md:px-12 w-full md:w-[55%] z-10">
              {/* Trending badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex items-center gap-2 mb-4"
              >
                <div className="flex items-center gap-1.5 bg-cine-red/20 border border-cine-red/30
                              backdrop-blur-sm px-3 py-1 rounded-full">
                  <TrendingUp size={14} className="text-cine-red" />
                  <span className="text-xs font-semibold text-cine-red">Trending Now</span>
                </div>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-hero-sm md:text-hero mb-4 drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)]
                         leading-tight tracking-tight"
              >
                {heroMovie.title || heroMovie.name}
              </motion.h1>

              {/* Meta */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="flex items-center gap-3 mb-4 text-sm"
              >
                <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                  <Star size={14} fill="currentColor" />
                  {heroRating}
                </span>
                {heroYear && <span className="text-cine-gray-200">{heroYear}</span>}
                <span className="text-green-400 font-semibold">
                  {Math.round((heroMovie.vote_average || 0) * 10)}% Match
                </span>
              </motion.div>

              {/* Overview */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.5 }}
                className="text-cine-gray-100 text-sm md:text-base mb-6 line-clamp-3 max-w-2xl
                         leading-relaxed drop-shadow-md"
              >
                {heroMovie.overview}
              </motion.p>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.5 }}
                className="flex items-center gap-3"
              >
                <button className="btn-primary px-6 md:px-8 py-3 flex items-center gap-2 text-sm md:text-base">
                  <Play size={18} fill="white" />
                  <span className="font-bold">Play</span>
                </button>
                <button
                  onClick={() => navigate(`/movie/${heroMovie.id}`)}
                  className="btn-secondary px-6 md:px-8 py-3 flex items-center gap-2 text-sm md:text-base"
                >
                  <Info size={18} />
                  <span className="font-bold">More Info</span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Hero skeleton */}
        {!heroMovie && (
          <div className="w-full h-full skeleton" />
        )}
      </div>

      {/* === CONTENT ROWS === */}
      <div className="-mt-20 md:-mt-32 relative z-10 pb-20">
        <MovieRow title="🔥 Trending Now" fetchUrl="/movies/trending?time_window=day" />
        <MovieRow title="⭐ Top Rated" fetchUrl="/movies/top-rated" />
        <MovieRow title="🎬 Now Playing" fetchUrl="/movies/category/now-playing" />
        <MovieRow title="🎯 Action" fetchUrl="/movies/discover/28" />
        <MovieRow title="😂 Comedy" fetchUrl="/movies/discover/35" />
        <MovieRow title="🔮 Sci-Fi" fetchUrl="/movies/discover/878" />
        <MovieRow title="😱 Horror" fetchUrl="/movies/discover/27" />
        <MovieRow title="💕 Romance" fetchUrl="/movies/discover/10749" />
        <MovieRow title="📅 Upcoming" fetchUrl="/movies/category/upcoming" />
      </div>
    </div>
  );
};

export default Home;
