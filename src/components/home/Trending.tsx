import { motion, useScroll, useTransform } from 'framer-motion';
import { TrendingUp, Clock, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef } from 'react';

const TRENDS = [
  {
    id: 1,
    name: 'Skin Fade + Deep Waves',
    image: '',
    pro: 'Boluwatife A.',
    price: '₦5,500',
    popularity: 'Hot',
    duration: '45 MINS'
  },
  {
    id: 2,
    name: 'Knotless Goddess Braids',
    image: '',
    pro: 'Chinwe Okeke',
    price: '₦18,000',
    popularity: 'Trending',
    duration: '4 HRS'
  },
  {
    id: 3,
    name: 'Textured Crop Top',
    image: '',
    pro: 'Yusuf Ahmed',
    price: '₦7,000',
    popularity: 'New',
    duration: '60 MINS'
  },
  {
    id: 4,
    name: 'Butterfly Locs',
    image: '',
    pro: 'Funke Williams',
    price: '₦22,000',
    popularity: 'High Demand',
    duration: '3.5 HRS'
  },
  {
    id: 5,
    name: 'Classic Low Cut',
    image: '',
    pro: 'Segun Master',
    price: '₦4,000',
    popularity: 'Classic',
    duration: '30 MINS'
  }
];

export const Trending = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth / 1.5 
        : scrollLeft + clientWidth / 1.5;
      
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-32 bg-bg-deep overflow-hidden border-t border-border-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Navigation */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-3 text-brand mb-6">
              <div className="p-2 bg-brand/10 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
          
            </div>
            <h2 className="text-5xl lg:text-7xl font-light text-white tracking-tighter italic font-serif leading-none">
               This Week's <br />
               <span className="text-brand">Trending Looks</span>
            </h2>
          </motion.div>

          <div className="flex items-center gap-4">
             <button 
                onClick={() => scroll('left')}
                className="p-4 rounded-full border border-border-muted text-white hover:bg-brand hover:text-bg-deep transition-all active:scale-90"
             >
                <ChevronLeft className="w-5 h-5" />
             </button>
             <button 
                onClick={() => scroll('right')}
                className="p-4 rounded-full border border-border-muted text-white hover:bg-brand hover:text-bg-deep transition-all active:scale-90"
             >
                <ChevronRight className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* The Carousel Container */}
        <div 
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-12"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {TRENDS.map((style) => (
            <motion.div
              key={style.id}
              className="min-w-[300px] md:min-w-[400px] snap-start group"
            >
              <Link to="/discover" className="block">
                {/* Image Container */}
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-8 bg-bg-surface border border-border-muted shadow-2xl">
                  <img 
                    src={style.image} 
                    alt={style.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  
                  {/* Glassmorphism Badge */}
                  <div className="absolute top-6 left-6">
                    <div className="px-4 py-2 backdrop-blur-xl bg-white/10 border border-white/20 rounded-full flex items-center gap-2">
                       <Zap className="w-3 h-3 text-brand fill-brand" />
                       <span className="text-[9px] font-black text-white uppercase tracking-widest">
                         {style.popularity}
                       </span>
                    </div>
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-transparent to-transparent opacity-90 group-hover:opacity-70 transition-opacity" />
                  
                  {/* Bottom Text Overlay */}
                  <div className="absolute bottom-8 left-8 right-8">
                     <div className="flex items-center gap-3 text-brand mb-3">
                        <Clock className="w-4 h-4" />
                        <span className="text-[10px] font-bold tracking-[0.2em]">{style.duration}</span>
                     </div>
                     <h3 className="text-3xl font-light text-white tracking-tight italic font-serif group-hover:text-brand transition-colors">
                       {style.name}
                     </h3>
                  </div>
                </div>

                {/* Stylist & Price Info */}
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center text-brand font-bold text-xs">
                      {style.pro[0]}
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-[#555] uppercase tracking-widest">Stylist</p>
                      <p className="text-sm font-bold text-white uppercase tracking-tighter">{style.pro}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-brand uppercase tracking-widest">Starting Price</p>
                    <p className="text-xl font-light text-white italic font-serif">{style.price}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 flex flex-col items-center">
            <div className="w-full h-[1px] bg-border-muted mb-12" />
            <Link 
                to="/discover"
                className="group relative flex items-center gap-4 px-12 py-6 bg-transparent overflow-hidden rounded-full border border-brand/50 text-white transition-all hover:border-brand"
            >
                <span className="relative z-10 text-[11px] font-black uppercase tracking-[0.4em]">Explore Entire Lookbook</span>
                <ChevronRight className="w-4 h-4 text-brand group-hover:translate-x-2 transition-transform" />
            </Link>
        </div>
      </div>
    </section>
  );
};