import { motion } from 'motion/react';
import { MapPin, Star, Scissors, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const Hero = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');

  // Search function that actually filters , nathan always use documentations.
  const handleSearch = (e) => {
    e?.preventDefault();
    if (location.trim()) {
      navigate(`/discover?location=${encodeURIComponent(location.trim())}`);
    } else {
      navigate('/discover');
    }
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-40 overflow-hidden bg-bg-deep text-[#d1d1d1]">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-[100px]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 mb-6">
              <CheckCircle2 className="w-4 h-4 text-brand" />
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-light text-white leading-[1] mb-8 tracking-tighter">
              Professional Hair Services  <br />
              <span className="text-brand italic font-serif">On Demand.</span>
            </h1>
            
            <p className="text-lg text-[#888] mb-10 max-w-lg leading-relaxed font-medium">
              Experience premium barbering and styling services. Whether at home or in the shop, we connect you with Nigeria's most skilled grooming experts.
            </p>
            
            {/* Search Box */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 p-2 bg-bg-surface/50 backdrop-blur-md border border-border-muted rounded-2xl shadow-2xl mb-12">
              <div className="relative flex-1 group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-brand w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Where are you? (e.g. Lagos, Abuja)" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-transparent focus:outline-none text-white placeholder:text-[#555] text-sm"
                />
              </div>
              <button 
                type="submit"
                className="px-10 py-4 bg-brand text-bg-deep rounded-xl font-black uppercase tracking-widest text-[11px] hover:scale-[1.02] transition-all shadow-lg shadow-brand/20 active:scale-95 flex items-center justify-center gap-2"
              >
                Find Stylists
              </button>
            </form>
            
            {/* Social Proof (Black Stylist Images)  nathan remember in your src"" is where you /images/the image name */} 
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <img className="w-10 h-10 rounded-full border-2 border-bg-deep object-cover" src="" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-bg-deep object-cover" src="" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-bg-deep object-cover" src="" alt="User" />
                <div className="w-10 h-10 rounded-full border-2 border-bg-deep bg-brand flex items-center justify-center text-bg-deep text-[10px] font-bold">+1,500</div>
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-tighter">Verified Professionals</p>
                <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-brand fill-brand" />
                    <span className="text-[10px] text-[#888] font-medium">Join 1,500+ happy clients</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Dual Image Layout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="hidden lg:flex relative h-[600px] items-center justify-center"
          >
            {/* Main Image 1 (The Professional) */}
            <div className="relative z-10 w-[350px] h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-white/10 -rotate-3 hover:rotate-0 transition-transform duration-700">
              <img 
                src=""  // add image here with /images/image name.
                alt="Professional Barber at work" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/60 to-transparent" />
            </div>

            {/* Main Image 2 (The Result/Detail) */}
            <div className="absolute top-10 right-0 z-20 w-[280px] h-[380px] rounded-2xl overflow-hidden shadow-2xl border border-brand/30 rotate-6 translate-y-12 hover:rotate-0 transition-transform duration-700">
              <img 
                src=""  // add image here with /images/image name.
                alt="Clean Fade Haircut" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/60 to-transparent" />
            </div>

            {/* Floating Badge */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute -bottom-4 right-20 bg-bg-surface p-5 rounded-2xl shadow-2xl z-30 flex items-center gap-4 border border-border-muted"
            >
              <div className="w-12 h-12 bg-brand/20 rounded-xl flex items-center justify-center">
                <Scissors className="text-brand w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-white tracking-tight">Premium Cuts</p>
                <p className="text-[10px] text-brand font-black uppercase tracking-widest">Certified Stylists</p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};