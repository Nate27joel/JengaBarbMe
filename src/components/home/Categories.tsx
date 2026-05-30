import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../../constants';

export const Categories = () => {
  return (
    <section className="py-24 bg-bg-deep border-y border-border-muted relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <span className="text-brand text-[10px] font-black uppercase tracking-widest mb-3 block">Expertise Areas</span>
            <h2 className="text-4xl font-light text-white mb-4 tracking-tight italic font-serif">Popular <span className="text-brand">Categories</span></h2>
            <p className="text-[#888] text-sm font-medium uppercase tracking-widest">Services tailored for every hair type and individual style.</p>
          </div>
          <Link 
            to="/discover"
            className="flex items-center gap-2 text-brand text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-80 transition-opacity border-b border-brand pb-1"
          >
            View All Services <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer"
            >
              <Link to={`/discover?category=${cat.name}`} className="block">
                <div className="relative h-80 rounded-2xl overflow-hidden mb-6 shadow-2xl transition-all duration-700 bg-bg-sidebar border border-border-muted group-hover:border-brand/30">
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[0.2] group-hover:grayscale-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-bg-deep/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                  <div className="absolute inset-x-0 bottom-0 p-8">
                    <span className="text-brand text-[8px] font-black uppercase tracking-[0.3em] mb-2 block opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">Book Now</span>
                    <h3 className="text-2xl font-light text-white mb-2 tracking-tight italic font-serif">{cat.name}</h3>
                    <p className="text-[#888] text-[9px] font-bold uppercase tracking-widest line-clamp-1">{cat.description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
