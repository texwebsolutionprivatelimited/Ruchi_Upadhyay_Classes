import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Youtube, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const popularVideos = [
  {
    id: "FOYOLMBF48g",
    title: "Polymerization Mechanisms & Synthetic Materials",
    category: "Polymer Classes"
  },
  {
    id: "f3CkLnPyYzA",
    title: "Water Treatment Methods & Desalination",
    category: "Environmental Science"
  },
  {
    id: "04YHMSFEBAQ",
    title: "Phase Rule & Phase Diagrams Made Simple",
    category: "Practical Knowledge"
  },
  {
    id: "m-EQ5eHfcss",
    title: "Principles of Green Chemistry & Waste Minimization",
    category: "EVS Core"
  },
  {
    id: "pp01Dhtbipk",
    title: "Corrosion Engineering: Mechanisms & Prevention",
    category: "Important Facts"
  }
];

const VideosMarquee = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-background to-secondary/30 border-t border-border overflow-hidden select-none">
      <div className="container mx-auto px-4 mb-10 flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 text-red-500 text-xs font-bold mb-4 shadow-sm shadow-red-500/5">
          <Youtube className="w-4 h-4" />
          Featured Video Lectures
        </span>
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-3">
          Watch & Learn <span className="text-primary italic">on YouTube</span>
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          Check out some of our popular visual lectures and classes covering advanced molecular chemistry. Click any video to play!
        </p>
      </div>

      {/* Marquee Row Container */}
      <div className="relative w-full flex items-center overflow-hidden py-4">
        {/* Gradients to fade edges */}
        <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* Endless Marquee Loop */}
        <div className="flex animate-marquee-videos whitespace-nowrap">
          {/* Double array for seamless transition */}
          {[...popularVideos, ...popularVideos, ...popularVideos].map((video, index) => (
            <div 
              key={`${video.id}-${index}`} 
              onClick={() => setSelectedVideo(video)}
              className="inline-block flex-shrink-0 w-72 sm:w-80 mx-4 sm:mx-6 rounded-2xl overflow-hidden border border-border bg-card shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                <img 
                  src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`} 
                  alt={video.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <motion.div 
                    whileHover={{ scale: 1.15 }}
                    className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/30"
                  >
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </motion.div>
                </div>
              </div>

              {/* Title & Category Info */}
              <div className="p-4 whitespace-normal">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-1">
                  {video.category}
                </span>
                <h3 className="text-sm font-bold text-card-foreground line-clamp-2 min-h-[40px] leading-snug group-hover:text-primary transition-colors">
                  {video.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Centered CTA Button Below Marquee */}
      <div className="flex justify-center mt-10">
        <Link to="/Ytclass">
          <Button variant="outline" size="lg" className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-8 h-12 shadow-lg shadow-primary/5 hover:shadow-primary/20 transition-all duration-300 hover:scale-105 gap-2 group">
            View More Classes
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      {/* Video Modal Player */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedVideo(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-card border border-border rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-55 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-all hover:scale-105 border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Video Player */}
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  className="w-full h-full border-none"
                  src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&rel=0`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Title and Action Buttons */}
              <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border-t border-border">
                <div className="max-w-xl">
                  <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-1">
                    {selectedVideo.category}
                  </span>
                  <h3 className="text-base sm:text-lg md:text-xl font-heading font-bold text-foreground leading-tight">
                    {selectedVideo.title}
                  </h3>
                </div>
                <div className="flex gap-3 shrink-0">
                  <Link to="/Ytclass" onClick={() => setSelectedVideo(null)}>
                    <Button variant="default" className="gap-2 font-semibold">
                      Explore More Classes <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Styled animation keyframes for Marquee */}
      <style>{`
        @keyframes marquee-videos {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.3333%);
          }
        }
        .animate-marquee-videos {
          animation: marquee-videos 30s linear infinite;
        }
        .animate-marquee-videos:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default VideosMarquee;
