import { motion } from 'motion/react';
import { MapPin, ShieldCheck, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const Hero = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    navigate(`/discover?location=${encodeURIComponent(location)}`);
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-bg-deep text-[#d1d1d1]">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-[100px]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            
            <h1 className="text-5xl lg:text-7xl font-light text-white leading-[1.1] mb-8 tracking-tight">
              Professional hair services at your <span className="text-brand italic font-serif">Safety.</span>
            </h1>
            <p className="text-lg text-[#888] mb-10 max-w-lg leading-relaxed">
              Book verified barbers and stylists for home visits or in-shop appointments across Nigeria.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555] group-focus-within:text-brand transition-colors" />
                <input 
                  type="text" 
                  placeholder="Enter your location..." 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-bg-surface border border-border-muted rounded-xl focus:outline-none focus:border-brand transition-all shadow-xl text-white placeholder:text-[#555] text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                />
              </div>
              <button 
                onClick={handleSearch}
                className="px-8 py-4 bg-brand text-bg-deep rounded-xl font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-all shadow-lg shadow-brand/10 active:scale-95 flex items-center justify-center whitespace-nowrap"
              >
                Find Barbers
              </button>
            </div>
            
            <div className="mt-10 flex items-center gap-4 text-xs font-medium text-[#555] uppercase tracking-widest">
              <div className="flex -space-x-3">
                {[1,2,3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-bg-deep bg-bg-surface" />
                ))}
              </div>
              <p><span className="text-white font-bold">500+</span> stylists joined this App</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl skew-x-[-1deg] border border-border-muted">
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTy1pEwbu19hj81GGm6ijC11FL0MRQistt0Ng&s" 
                alt="Professional Barber" 
                className="w-full h-[600px] object-cover grayscale-[0.2]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/80 to-transparent" />
            </div>
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute -bottom-6 -left-6 bg-bg-surface p-6 rounded-2xl shadow-2xl z-20 flex items-center gap-4 border border-border-muted"
            >
              <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center">
                <Star className="text-brand w-6 h-6 fill-current" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">4.9/5 Average Rating</p>
                <p className="text-xs text-[#555] font-mono">12,000+ BOOKINGS</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
