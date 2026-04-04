import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, Calendar, ArrowLeft, Heart, Play, Bell, BellOff, Info } from 'lucide-react';
import api from '../api/axios';
import MovieRow from '../components/MovieRow';
import { AuthContext } from '../context/AuthContext';

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/original";
const TMDB_POSTER_BASE = "https://image.tmdb.org/t/p/w500";
const LOGO_BASE = "https://image.tmdb.org/t/p/original";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [movie, setMovie] = useState(null);
  const [providers, setProviders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [hasAlert, setHasAlert] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        const [movieRes, providerRes] = await Promise.all([
          api.get(`/movies/${id}`),
          api.get(`/movies/${id}/providers`)
        ]);
        
        setMovie(movieRes.data);
        
        // Handle provider data for 'IN' region (defaulting to India for now, can be dynamic)
        const inProviders = providerRes.data.results?.IN || providerRes.data.results?.US;
        setProviders(inProviders);

        // Check user status (Watchlist/Favorites)
        if (user) {
          try {
            const meRes = await api.get('/users/me');
            setIsFavorite(meRes.data.favorites?.includes(parseInt(id)));
            const watchItem = meRes.data.watchlist?.find(item => item.movie_id === parseInt(id));
            setInWatchlist(!!watchItem);
            setHasAlert(watchItem?.notify_on_new_provider || false);
          } catch (e) {}
        }
      } catch (err) {
        console.error("Failed to fetch movie data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovieData();
  }, [id, user]);

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

  const toggleWatchlist = async () => {
    try {
      if (inWatchlist) {
        await api.delete(`/users/watchlist/${id}`);
        setInWatchlist(false);
        setHasAlert(false);
      } else {
        await api.post(`/users/watchlist/${id}`);
        setInWatchlist(true);
      }
    } catch (err) {
      console.error("Failed to toggle watchlist:", err);
    }
  };

  const toggleAlert = async () => {
    if (!inWatchlist) return;
    try {
      const nextState = !hasAlert;
      await api.patch(`/users/watchlist/${id}/alert`, null, { params: { notify: nextState } });
      setHasAlert(nextState);
    } catch (err) {
      console.error("Failed to toggle alert:", err);
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
      <div className="min-h-screen bg-cine-black flex items-center justify-center text-cine-gray-100 font-medium">
        Movie not found
      </div>
    );
  }

  const rating = (movie.vote_average || 0).toFixed(1);
  const year = (movie.release_date || '').split('-')[0];
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : '';
  const genres = movie.genres || [];

  const streamProviders = providers?.flatrate || [];
  const rentProviders = providers?.rent || [];
  const buyProviders = providers?.buy || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-cine-black grain"
    >
      {/* === HERO BACKDROP === */}
      <div className="relative h-[65vh] md:h-[85vh] w-full overflow-hidden">
        <motion.img
          src={`${TMDB_IMAGE_BASE}${movie.backdrop_path || movie.poster_path}`}
          alt={movie.title}
          onLoad={() => setImageLoaded(true)}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          className={`w-full h-full object-cover transition-opacity duration-1000
            ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Dynamic Shadow Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-cine-black via-cine-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-cine-black/80 via-cine-black/20 to-transparent" />
        <div className="absolute inset-0 bg-black/20" />

        {/* Navigation */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => navigate(-1)}
          className="absolute top-20 md:top-24 left-4 md:left-12 z-20
                   bg-white/10 backdrop-blur-xl border border-white/10 text-white
                   p-3 rounded-full hover:bg-white/20 transition-all shadow-xl"
        >
          <ArrowLeft size={20} />
        </motion.button>
      </div>

      {/* === CONTENT SECTION === */}
      <div className="relative -mt-48 md:-mt-72 z-10 px-4 md:px-12 max-w-[1500px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left: Poster & Providers */}
          <div className="lg:w-[350px] shrink-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="relative group"
            >
              <img
                src={`${TMDB_POSTER_BASE}${movie.poster_path}`}
                alt={movie.title}
                className="w-full rounded-3xl shadow-2xl shadow-black/80
                         border border-white/10 brightness-110"
              />
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/20 pointer-events-none" />
            </motion.div>

            {/* OTT Providers Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md"
            >
              <h3 className="text-sm font-black uppercase tracking-widest text-cine-gray-300 mb-5 flex items-center gap-2">
                <Play size={14} className="text-cine-red" fill="currentColor" />
                Where to Stream
              </h3>
              
              {streamProviders.length > 0 ? (
                <div className="grid grid-cols-4 gap-4">
                  {streamProviders.slice(0, 8).map(provider => (
                    <motion.div
                      key={provider.provider_id}
                      whileHover={{ scale: 1.1, y: -5 }}
                      className="group/icon relative"
                    >
                      <img
                        src={`${LOGO_BASE}${provider.logo_path}`}
                        alt={provider.provider_name}
                        className="w-full aspect-square rounded-xl shadow-lg border border-white/5"
                      />
                      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap opacity-0 group-hover/icon:opacity-100 transition-opacity font-bold text-white">
                        {provider.provider_name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-4 px-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
                  <Info size={16} className="text-cine-gray-400" />
                  <p className="text-sm text-cine-gray-300">Not available for streaming in your region.</p>
                </div>
              )}

              {/* Watchlist Alerts */}
              <div className="mt-8 pt-6 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-cine-gray-100">Status Alert</span>
                    <span className="text-[10px] text-cine-gray-400">Notify me on availability</span>
                  </div>
                  <button
                    onClick={toggleAlert}
                    disabled={!inWatchlist}
                    className={`p-2 rounded-lg transition-all ${
                      hasAlert 
                        ? 'bg-cine-red text-white shadow-lg shadow-cine-red/20' 
                        : 'bg-white/5 text-cine-gray-400 border border-white/10 hover:bg-white/10'
                    } ${!inWatchlist && 'opacity-30 cursor-not-allowed'}`}
                  >
                    {hasAlert ? <Bell size={18} fill="currentColor" /> : <BellOff size={18} />}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Info & Actions */}
          <div className="flex-1 lg:pt-16">
            {/* Title & Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6 flex flex-wrap items-center gap-3"
            >
              {genres.slice(0, 3).map((g) => (
                <span key={g.id} className="glass-chip px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-cine-gray-100">
                  {g.name}
                </span>
              ))}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-none tracking-tight"
            >
              {movie.title}
            </motion.h1>

            {/* Meta row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-6 mb-10 text-sm font-bold"
            >
              <div className="flex items-center gap-2 text-yellow-400 bg-yellow-400/10 px-3 py-1.5 rounded-lg border border-yellow-400/20">
                <Star size={16} fill="currentColor" />
                {rating}
              </div>
              <div className="text-green-400 uppercase tracking-widest text-xs">
                {Math.round((movie.vote_average || 0) * 10)}% Match
              </div>
              {year && (
                <div className="flex items-center gap-2 text-cine-gray-200">
                  <Calendar size={16} />
                  {year}
                </div>
              )}
              {runtime && (
                <div className="flex items-center gap-2 text-cine-gray-200">
                  <Clock size={16} />
                  {runtime}
                </div>
              )}
            </motion.div>

            {/* Main Primary Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="flex flex-wrap items-center gap-4 mb-12"
            >
              <button className="btn-primary px-10 py-4 flex items-center gap-3 group shadow-2xl shadow-cine-red/20">
                <Play size={20} fill="white" className="group-hover:scale-110 transition-transform" />
                <span className="font-black uppercase tracking-widest">Watch Trailer</span>
              </button>
              
              <button
                onClick={toggleWatchlist}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl border-2 font-black uppercase tracking-widest transition-all duration-500 hover:scale-105 active:scale-95 ${
                  inWatchlist
                    ? 'bg-white text-cine-black border-white shadow-xl shadow-white/10'
                    : 'bg-transparent border-white/20 text-white hover:border-white/40 hover:bg-white/5'
                }`}
              >
                {inWatchlist ? <Bell size={18} fill="currentColor" /> : <Play size={18} fill="none" className="rotate-90" />}
                {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              </button>

              <button
                onClick={toggleFavorite}
                className={`p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-110 active:scale-90 ${
                  isFavorite
                    ? 'bg-cine-red/10 border-cine-red/40 text-cine-red shadow-lg shadow-cine-red/10'
                    : 'bg-transparent border-white/10 text-white hover:bg-white/10'
                }`}
              >
                <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            </motion.div>

            {/* Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="max-w-4xl"
            >
              <h3 className="text-xl font-black uppercase tracking-widest text-cine-gray-300 mb-4">Storyline</h3>
              <p className="text-cine-gray-100 leading-relaxed text-lg lg:text-xl font-medium opacity-80 decoration-cine-red/20">
                {movie.overview}
              </p>
              
              {movie.tagline && (
                <div className="mt-8 pl-4 border-l-4 border-cine-red/50">
                  <p className="text-cine-gray-300 italic text-lg leading-relaxed">
                    "{movie.tagline}"
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* === EXPLORE MORE === */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="mt-24 pb-32 relative"
      >
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <MovieRow title="Based on your search" fetchUrl={`/movies/${id}/similar`} />
        <MovieRow title="More like this" fetchUrl={`/movies/${id}/recommendations`} />
      </motion.div>
    </motion.div>
  );
};

export default MovieDetail;
