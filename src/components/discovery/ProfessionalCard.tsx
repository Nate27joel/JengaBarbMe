import React from 'react';
import { motion } from 'motion/react';
import { Star, MapPin, Scissors, ShieldCheck, ChevronRight, Clock, Calendar, Zap, CreditCard, Heart } from 'lucide-react';
import { Professional, User, Service } from '../../types';
import { useFavorites } from '../../contexts/FavoritesContext';

interface ProCardProps {
  pro: Professional;
  user: User;
  services?: Service[];
  onSelect: () => void;
  onServiceSelect?: (service: Service) => void;
}

export const ProfessionalCard: React.FC<ProCardProps> = ({ pro, user, services = [], onSelect, onServiceSelect }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorited = isFavorite(pro.id);

  return (
    <div 
      className="group bg-bg-surface rounded-2xl p-4 shadow-sm hover:shadow-2xl transition-all duration-500 border border-border-muted cursor-default hover:border-brand/30 flex flex-col h-full"
    >
      <div 
        onClick={onSelect}
        className="relative h-48 rounded-xl overflow-hidden mb-4 bg-bg-deep border border-border-muted flex-shrink-0 cursor-pointer"
      >
        <img 
          src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.fullName}&background=random`}
          alt={user.fullName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale-[0.3] group-hover:grayscale-0"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          {user.isVerified && (
            <div className="px-2 py-1 bg-brand text-bg-deep rounded-md text-[9px] font-black tracking-widest flex items-center gap-1 shadow-lg">
              <ShieldCheck className="w-3 h-3" />
              <span>VERIFIED</span>
            </div>
          )}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(pro.id);
            }}
            className={`p-2 rounded-xl backdrop-blur-md border shadow-lg transition-all ${
              favorited 
                ? 'bg-red-500 border-red-400 text-white' 
                : 'bg-bg-deep/50 border-border-muted text-white/50 hover:text-white hover:bg-bg-deep/80'
            }`}
          >
            <motion.div
              key={favorited ? "favorited" : "unfavorited"}
              initial={{ scale: 1 }}
              animate={{ 
                scale: favorited ? [1, 1.4, 0.95, 1.1, 1] : 1,
              }}
              transition={{ 
                duration: 0.5, 
                ease: "easeOut"
              }}
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
            </motion.div>
          </motion.button>
        </div>
        {pro.hasOffer && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-white text-bg-deep rounded-md text-[9px] font-black tracking-widest flex items-center gap-1 shadow-lg z-10">
            <Zap className="w-3 h-3 text-brand" />
            <span>SPECIAL OFFER</span>
          </div>
        )}
        <div className="absolute bottom-3 left-3 flex gap-1 flex-wrap pr-3 z-10">
          {pro.categories.slice(0, 2).map(cat => (
             <span key={cat} className="px-2 py-1 bg-bg-deep/80 backdrop-blur-md border border-border-muted rounded text-[8px] font-black text-white uppercase tracking-widest">
               {cat}
             </span>
          ))}
        </div>
      </div>

      <div className="px-2 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3" onClick={onSelect}>
          <div className="cursor-pointer">
            <h3 className="font-bold text-white leading-tight tracking-tight hover:text-brand transition-colors">{user.fullName}</h3>
            <div className="flex items-center gap-1 text-[#555] text-[10px] uppercase font-bold tracking-wider mt-1">
              <MapPin className="w-3 h-3" />
              <span>{pro.address || 'Remote / Lagos'}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-brand/5 text-brand rounded-md text-[10px] font-black border border-brand/10 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.5)]">
            <motion.div
              animate={Number(pro.avgRating) >= 5 ? { scale: [1, 1.25, 1] } : {}}
              transition={Number(pro.avgRating) >= 5 ? { repeat: Infinity, duration: 1.8, ease: "easeInOut" } : {}}
              className="flex items-center"
            >
              <Star className="w-3 h-3 fill-current" />
            </motion.div>
            <span>{pro.avgRating}</span>
          </div>
        </div>

        <p className="text-[#888] text-xs line-clamp-2 mb-4 h-8 leading-relaxed font-medium">
          {pro.bio}
        </p>

        {pro.accountNumber && (
          <div className="mb-4 p-3 bg-bg-deep/50 rounded-xl border border-border-muted flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-bg-surface flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-brand" />
             </div>
             <div>
                <p className="text-[10px] font-black text-white uppercase tracking-widest">{pro.accountNumber}</p>
                <p className="text-[8px] font-black text-[#444] uppercase tracking-tighter">{pro.bankName || 'GT BANK'}</p>
             </div>
          </div>
        )}

        {services.length > 0 && (
          <div className="mb-6 space-y-2">
            <p className="text-[8px] font-black text-[#333] uppercase tracking-[0.2em] mb-2">Featured Services</p>
            {services.slice(0, 2).map(s => (
              <button 
                key={s.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onServiceSelect?.(s);
                }}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-bg-deep border border-border-muted hover:border-brand/30 transition-all group/service"
              >
                <div className="flex items-center gap-2">
                   <Scissors className="w-3 h-3 text-[#444] group-hover/service:text-brand" />
                   <span className="text-[10px] font-black text-white uppercase tracking-wider">{s.name}</span>
                </div>
                <span className="text-[10px] font-black text-brand italic">₦{s.price.toLocaleString()}</span>
              </button>
            ))}
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-border-muted flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[10px] font-black text-[#444] uppercase tracking-widest">
              <Clock className="w-3 h-3" />
              <span>{pro.yearsExperience}+ years</span>
            </div>
            {pro.availability && (
              <div className="flex items-center gap-2 text-[9px] font-black text-brand uppercase tracking-widest italic">
                <Calendar className="w-3 h-3" />
                <span>Available Today</span>
              </div>
            )}
          </div>
          <button 
            onClick={onSelect}
            className="flex items-center gap-2 px-4 py-2 bg-brand text-bg-deep rounded-lg text-[9px] font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-brand/10"
          >
            Book Now <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
