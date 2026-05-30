import { motion } from 'motion/react';
import { TrendingUp, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const TRENDS = [
  {
    id: 1,
    name: 'Skin Fade + Deep Waves',
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=400',
    pro: 'Boluwatife A.',
    price: '₦5,500',
    popularity: 'Hot'
  },
  {
    id: 2,
    name: 'Knotless Goddess Braids',
    image: 'https://plus.unsplash.com/premium_photo-1694618624326-94ec3e867dd9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YnJhaWRzfGVufDB8fDB8fHww',
    pro: 'Chinwe Okeke',
    price: '₦18,000',
    popularity: 'Trending'
  },
  {
    id: 3,
    name: 'Textured Crop Top',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFyYmluZyUyMHRvb2xzfGVufDB8fDB8fHww',
    pro: 'Yusuf Ahmed',
    price: '₦7,000',
    popularity: 'New'
  },
  {
    id: 4,
    name: 'Butterfly Locs',
    image: 'https://images.unsplash.com/photo-1651446152855-884e9af68dfc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGJ1dHRlcmZseSUyMExvY3N8ZW58MHx8MHx8fDA%3D',
    pro: 'Funke Williams',
    price: '₦22,000',
    popularity: 'High Demand'
  }
];

export const Trending = () => {
  return (
    <section className="py-32 bg-bg-deep overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 text-brand mb-4">
              <TrendingUp className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Style Pulse</span>
            </div>
            <h2 className="text-5xl font-light text-white tracking-tighter italic font-serif">
               Trending <span className="text-brand">Hairstyles</span>
            </h2>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-[#555] text-[10px] font-black uppercase tracking-widest max-w-xs text-right"
          >
            The most requested looks in Lagos and Abuja this week.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {TRENDS.map((style, idx) => (
            <motion.div
              key={style.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6 bg-bg-surface border border-border-muted transition-all group-hover:border-brand/40">
                <img 
                  src={style.image} 
                  alt={style.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                
                {/* Overlay Info */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-brand text-bg-deep text-[9px] font-black uppercase tracking-widest rounded shadow-xl">
                    {style.popularity}
                  </span>
                </div>

                <div className="absolute bottom-6 left-6 right-6 translate-y-2 group-hover:translate-y-0 transition-transform">
                   <div className="flex items-center gap-2 text-white mb-2">
                      <Clock className="w-3 h-3 text-brand" />
                      <span className="text-[9px] font-black uppercase tracking-widest">45-60 MINS</span>
                   </div>
                   <h3 className="text-lg font-bold text-white tracking-tight leading-tight group-hover:text-brand transition-colors">
                     {style.name}
                   </h3>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-[#888] uppercase tracking-widest mb-1">Stylist</p>
                  <p className="text-xs font-bold text-white">{style.pro}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-brand uppercase tracking-widest mb-1">From</p>
                  <p className="text-sm font-light text-white font-mono italic">{style.price}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           className="mt-20 flex justify-center"
        >
          <Link 
            to="/discover"
            className="px-12 py-5 bg-bg-surface border border-border-muted text-white rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-brand hover:text-bg-deep hover:border-brand transition-all shadow-2xl"
          >
            Explore Collection
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
