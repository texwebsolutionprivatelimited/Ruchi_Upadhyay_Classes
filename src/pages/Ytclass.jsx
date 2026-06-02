import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Calendar, Eye, Loader2, Sparkles, Youtube, ExternalLink, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

const YOUTUBE_API_KEY = "AIzaSyA2WDWMrkdVemygZ0Gf0hWGjuSnY0OAiyI";

const playlists = [
  { id: "PLOWo_xH368odQH9A2D0XnMPW6q0TIAR57", name: "Polymer Classes" },
  { id: "PLOWo_xH368ofKH2IEImuhNOGqZnw59Ok_", name: "Environmental Science" },
  { id: "PLOWo_xH368odBdAE5x6XDMX32oOP_Iq3m", name: "Practical Knowledge" },
  { id: "PLOWo_xH368oe9PSRxtbp30xYSc4Rmeue2", name: "Important Facts" }
];

const Ytclass = () => {
  const [activePlaylist, setActivePlaylist] = useState(playlists[0].id);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [error, setError] = useState("");

  const fetchVideos = async (playlistId, pageToken = "") => {
    try {
      setLoading(true);
      setError("");
      
      const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=6&playlistId=${playlistId}&key=${YOUTUBE_API_KEY}&pageToken=${pageToken}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch playlist items");
      }
      
      const data = await response.json();
      
      if (pageToken) {
        setVideos(prev => [...prev, ...data.items]);
      } else {
        setVideos(data.items || []);
      }
      
      setNextPageToken(data.nextPageToken || null);
    } catch (err) {
      console.error(err);
      setError("⚠️ Failed to load videos. Please check your network or playlist ID.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos(activePlaylist);
  }, [activePlaylist]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="pt-20 md:pt-24 pb-16">
        {/* Banner header section */}
        <section className="relative pt-6 pb-12 md:pt-8 md:pb-16 bg-gradient-to-br from-primary/20 via-background to-accent/15 border-b border-border overflow-hidden">
          <div className="container mx-auto px-6 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              <Youtube className="w-5 h-5" />
              <span>YouTube Video Classes</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-foreground mb-4">
              Learn Chemistry <span className="text-primary">Visually</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Explore specialized video playlists covering Polymer chemistry, Environmental science, practical laboratory knowledge, and essential scientific facts.
            </p>
          </div>
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-accent/5 blur-3xl pointer-events-none" />
        </section>

        {/* Playlists Tabs navigation */}
        <section className="container mx-auto px-6 mt-12">
          <div className="flex flex-wrap justify-center items-center gap-3 mb-10 pb-4 border-b border-border">
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider mr-2">
              Explore Playlists:
            </span>
            {playlists.map(pl => (
              <button
                key={pl.id}
                onClick={() => {
                  setActivePlaylist(pl.id);
                  setNextPageToken(null);
                  setVideos([]);
                }}
                className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                  activePlaylist === pl.id 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-[1.03]" 
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                }`}
              >
                {pl.name}
              </button>
            ))}
          </div>

          {/* Videos Grid */}
          <AnimatePresence mode="wait">
            {error ? (
              <div className="text-center py-16 text-destructive font-semibold text-lg">{error}</div>
            ) : (
              <motion.div 
                layout 
                className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto"
              >
                {videos.map((vid, idx) => {
                  const title = vid.snippet.title;
                  const videoId = vid.snippet.resourceId.videoId;
                  
                  return (
                    <motion.div
                      key={videoId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      whileHover={{ y: -6 }}
                      className="bg-card border border-border rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
                    >
                      {/* Video Player Embed */}
                      <div className="relative aspect-video w-full bg-black">
                        <iframe
                          className="w-full h-full border-none"
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title={title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>

                      {/* Video Title & details */}
                      <div className="p-5 flex-grow flex flex-col justify-between">
                        <h3 className="text-base sm:text-lg font-heading font-bold text-card-foreground line-clamp-2 mb-4 group-hover:text-primary transition-colors">
                          {title}
                        </h3>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Classes</span>
                          </span>
                          
                          <a 
                            href={`https://www.youtube.com/watch?v=${videoId}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                          >
                            <span>Watch on YouTube</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loader when loading */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          )}

          {/* Load More Button */}
          {nextPageToken && !loading && !error && (
            <div className="flex justify-center mt-12">
              <Button
                onClick={() => fetchVideos(activePlaylist, nextPageToken)}
                variant="outline"
                size="lg"
                className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-8 h-12"
              >
                Load More Videos
              </Button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Ytclass;
