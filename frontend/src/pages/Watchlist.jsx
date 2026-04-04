import React, { useEffect, useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Trash2, Bell, BellOff, Info, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import SkeletonCard from '../components/SkeletonCard';

const TMDB_POSTER_BASE = "https://image.tmdb.org/t/p/w500";
const LOGO_BASE = "https://image.tmdb.org/t/p/original";

const Watchlist = () => {
  const { user } = useContext(AuthContext);
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWatchlistDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users/me');
      const watchlist = res.data.watchlist || [];
      
      // Fetch details and providers for each movie in parallel
      const detailedItems = await Promise.all(
        watchlist.map(async (item) => {
          try {
            const [movieRes, providerRes] = await Promise.all([
              api.get(`/movies/${item.movie_id}`),
              api.get(`/movies/${item.movie_id}/providers`)
            ]);
            return {
              ...item,
              movie: movieRes.data,
              providers: providerRes.data.results?.IN || providerRes.data.results?.US
            };
          } catch (e) {
            console.error(`Failed to fetch details for movie ${item.movie_id}`, e);
            return null;
          }
        })
      );
      
      setWatchlistItems(detailedItems.filter(Boolean));
    } catch (err) {
      console.error("Failed to fetch watchlist:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWatchlistDetails();
    }
  }, [user]);

  const removeFromWatchlist = async (movieId) => {
    try {
      await api.delete(`/users/watchlist/${movieId}`);
      setWatchlistItems(prev => prev.filter(item => item.movie_id !== movieId));
    } catch (err) {
      console.error("Failed to remove from watchlist:", err);
    }
  };

  const toggleAlert = async (movieId, currentState) => {
    try {
      const nextState = !currentState;
      await api.patch(`/users/watchlist/${movieId}/alert`, null, { params: { notify: nextState } });
      setWatchlistItems(prev => prev.map(item => 
        item.movie_id === movieId ? { ...item, notify_on_new_provider: nextState } : item
      ));
    } catch (err) {
      console.error("Failed to toggle alert:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cine-black pt-32 px-4 md:px-12">
        <h1 className="text-4xl font-black mb-12 uppercase tracking-tighter">Your Watchlist</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {[...Array(10)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cine-black pt-32 pb-20 px-4 md:px-12 grain">
      <div className="max-w-[1700px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-cine-red font-black uppercase tracking-[0.3em] text-sm mb-3 block">OTT Aggregator</span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic">
              Watch<span className="text-gradient">list</span>
            </h1>
          </div>
          <div className="flex items-center gap-4 text-cine-gray-300">
            <span className="text-2xl font-black text-white">{watchlistItems.length}</span>
            <span className="uppercase tracking-widest text-xs font-bold">Movies Saved</span>
          </div>
        </div>

        {watchlistItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8">
              <Play size={40} className="text-cine-gray-400 rotate-90" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">Your Watchlist is Empty</h3>
            <p className="text-cine-gray-300 max-w-md mx-auto mb-10 leading-relaxed">
              Start adding movies to track their availability across streaming platforms.
            </p>
            <Link to="/search" className="btn-primary px-10 py-4 font-black uppercase tracking-widest">
              Explore Now
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {watchlistItems.map((item, index) => (
                <motion.div
                  layout
                  key={item.movie_id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05, type: 'spring', stiffness: 260, damping: 20 }}
                  className="group relative h-[250px] md:h-[280px] bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden flex shadow-2xl hover:border-white/20 hover:bg-white/[0.07] transition-all duration-500"
                >
                  {/* Movie Poster */}
                  <div className="w-1/3 h-full relative">
                    <img
                      src={`${TMDB_POSTER_BASE}${item.movie.poster_path}`}
                      alt={item.movie.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-cine-black/50" />
                  </div>

                  {/* Info Section */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <Link to={`/movie/${item.movie_id}`} className="hover:text-cine-red transition-colors">
                          <h3 className="text-xl font-black line-clamp-1 uppercase tracking-tight leading-tight">
                            {item.movie.title}
                          </h3>
                        </Link>
                        <button 
                          onClick={() => removeFromWatchlist(item.movie_id)}
                          className="p-2 text-cine-gray-400 hover:text-cine-red transition-colors hover:scale-110"
                          title="Remove from Watchlist"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs font-bold mb-4">
                        <span className="flex items-center gap-1 text-yellow-400">
                          <Star size={12} fill="currentColor" />
                          {(item.movie.vote_average || 0).toFixed(1)}
                        </span>
                        <span className="text-cine-gray-300">
                          {(item.movie.release_date || '').split('-')[0]}
                        </span>
                      </div>

                      {/* Streaming Icons */}
                      <div className="mb-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cine-gray-400 block mb-3">Available On</span>
                        {item.providers?.flatrate?.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {item.providers.flatrate.slice(0, 4).map(p => (
                              <div key={p.provider_id} className="relative group/logo">
                                <img
                                  src={`${LOGO_BASE}${p.logo_path}`}
                                  alt={p.provider_name}
                                  className="w-8 h-8 rounded-lg shadow-lg border border-white/10"
                                />
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-cine-black border border-white/10 px-2 py-1 rounded text-[8px] opacity-0 group-hover/logo:opacity-100 transition-opacity whitespace-nowrap z-20">
                                  {p.provider_name}
                                </div>
                              </div>
                            ))}
                            {item.providers.flatrate.length > 4 && (
                              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-cine-gray-300">
                                +{item.providers.flatrate.length - 4}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-[11px] text-cine-gray-400 flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 w-fit">
                            <Info size={12} />
                            Coming Soon to OTT
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                      <button
                        onClick={() => toggleAlert(item.movie_id, item.notify_on_new_provider)}
                        className={`flex items-center gap-2 text-xs font-bold transition-all px-3 py-1.5 rounded-full ${
                          item.notify_on_new_provider 
                            ? 'bg-cine-red/20 text-cine-red border border-cine-red/30' 
                            : 'text-cine-gray-300 hover:text-white'
                        }`}
                      >
                        {item.notify_on_new_provider ? <Bell size={14} fill="currentColor" /> : <BellOff size={14} />}
                        {item.notify_on_new_provider ? 'Alerts On' : 'Alert Me'}
                      </button>

                      <Link 
                        to={`/movie/${item.movie_id}`} 
                        className="text-white hover:text-cine-red transition-colors flex items-center gap-2 text-xs font-bold group/link"
                      >
                        Details
                        <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
