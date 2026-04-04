import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, Calendar, ArrowLeft, Heart, Play } from 'lucide-react';
import api from '../api/axios';
import MovieRow from '../components/MovieRow';
import { AuthContext } from '../context/AuthContext';

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/original";
const TMDB_POSTER_BASE = "https://image.tmdb.org/t/p/w500";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/movies/${id}`);
        setMovie(res.data);

        // Check if in favorites
        try {
          const favRes = await api.get('/users/favorites');
          setIsFavorite(favRes.data.favorites?.includes(parseInt(id)));
        } catch (e) {}
      } catch (err) {
        console.error("Failed to fetch movie:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await api.delete(`/users/favorites/${id}`);
      } else {
        await api.post(`/users/favorites/${id}`);
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cine-black flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-cine-red/30 border-t-cine-red rounded-full animate-spin" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-cine-black flex items-center justify-center text-cine-gray-200">
        Movie not found
      </div>
    );
  }

  const rating = (movie.vote_average || 0).toFixed(1);
  const year = (movie.release_date || '').split('-')[0];
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : '';
  const genres = movie.genres || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-cine-black grain"
    >
      {/* === HERO BACKDROP === */}
      <div className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden">
        <motion.img
          src={`${TMDB_IMAGE_BASE}${movie.backdrop_path || movie.poster_path}`}
          alt={movie.title}
          onLoad={() => setImageLoaded(true)}
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className={`w-full h-full object-cover transition-opacity duration-700
            ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-cine-black via-cine-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-cine-black/70 via-transparent to-transparent" />

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => navigate(-1)}
          className="absolute top-20 md:top-24 left-4 md:left-12 z-20
                   bg-cine-black/40 backdrop-blur-md border border-white/10 text-white
                   p-3 rounded-full hover:bg-white/10 transition-all"
        >
          <ArrowLeft size={20} />
        </motion.button>
      </div>

      {/* === CONTENT SECTION === */}
      <div className="relative -mt-40 md:-mt-60 z-10 px-4 md:px-12 max-w-[1400px]">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="hidden md:block shrink-0"
          >
            <img
              src={`${TMDB_POSTER_BASE}${movie.poster_path}`}
              alt={movie.title}
              className="w-[250px] lg:w-[300px] rounded-2xl shadow-2xl shadow-black/60
                       border border-white/5"
            />
          </motion.div>

          {/* Details */}
          <div className="flex-1 pt-4">
            {/* Genres */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-2 mb-4"
            >
              {genres.map((g) => (
                <span
                  key={g.id}
                  className="text-xs font-medium px-3 py-1 rounded-full
                           bg-white/5 border border-white/10 text-cine-gray-100
                           backdrop-blur-sm"
                >
                  {g.name}
                </span>
              ))}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight tracking-tight"
            >
              {movie.title}
            </motion.h1>

            {/* Meta row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 mb-6 text-sm"
            >
              <span className="flex items-center gap-1.5 text-yellow-400 font-bold text-base">
                <Star size={16} fill="currentColor" />
                {rating}
              </span>
              <span className="text-green-400 font-semibold">
                {Math.round((movie.vote_average || 0) * 10)}% Match
              </span>
              {year && (
                <span className="flex items-center gap-1 text-cine-gray-200">
                  <Calendar size={14} />
                  {year}
                </span>
              )}
              {runtime && (
                <span className="flex items-center gap-1 text-cine-gray-200">
                  <Clock size={14} />
                  {runtime}
                </span>
              )}
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="flex items-center gap-3 mb-8"
            >
              <button className="btn-primary px-8 py-3 flex items-center gap-2">
                <Play size={18} fill="white" />
                <span className="font-bold">Play</span>
              </button>
              <button
                onClick={toggleFavorite}
                className={`p-3 rounded-xl border transition-all duration-300 ${
                  isFavorite
                    ? 'bg-cine-red/20 border-cine-red/30 text-cine-red'
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            </motion.div>

            {/* Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-lg font-bold mb-2">Overview</h3>
              <p className="text-cine-gray-100 leading-relaxed text-sm md:text-base max-w-3xl">
                {movie.overview}
              </p>
            </motion.div>

            {/* Additional info */}
            {movie.tagline && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-4 text-cine-gray-300 italic text-sm"
              >
                "{movie.tagline}"
              </motion.p>
            )}
          </div>
        </div>
      </div>

      {/* === RELATED CONTENT === */}
      <div className="mt-12 pb-20">
        <MovieRow title="Similar Movies" fetchUrl={`/movies/${id}/similar`} />
        <MovieRow title="Recommendations" fetchUrl={`/movies/${id}/recommendations`} />
      </div>
    </motion.div>
  );
};

export default MovieDetail;
