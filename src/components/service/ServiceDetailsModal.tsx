import React from 'react';
import { motion } from 'motion/react';
import { X, Clock, Star, Scissors, ShieldCheck, Zap } from 'lucide-react';
import { Service, Professional, User } from '../../types';

interface ServiceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service;
  pro: Professional & { user: User };
  onBook: () => void;
}

export const ServiceDetailsModal: React.FC<ServiceDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  service, 
  pro,
  onBook 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-bg-deep/90 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-lg bg-bg-surface rounded-3xl border border-border-muted overflow-hidden shadow-2xl"
      >
        <div className="relative h-48 bg-gradient-to-br from-brand/20 to-bg-deep">
             <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <Scissors className="w-40 h-40" />
             </div>
             <button onClick={onClose} className="absolute top-6 right-6 p-2 text-[#444] hover:text-white transition-colors bg-bg-deep/50 rounded-full backdrop-blur-md">
                <X className="w-6 h-6" />
             </button>
             <div className="absolute -bottom-6 left-8">
                 <div className="w-20 h-20 rounded-2xl border-4 border-bg-surface overflow-hidden shadow-xl">
                    <img 
                      src={pro.user.avatarUrl} 
                      alt={pro.user.fullName}
                      className="w-full h-full object-cover"
                    />
                 </div>
             </div>
        </div>

        <div className="p-8 pt-12">
            <div className="flex justify-between items-start mb-6">
                <div>
                   <span className="text-brand text-[9px] font-black uppercase tracking-[0.2em] mb-1 block italic font-serif">Service Details</span>
                   <h2 className="text-3xl font-light text-white tracking-tight italic font-serif">{service.name}</h2>
                   <p className="text-[#555] text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                       by <span className="text-white hover:text-brand cursor-pointer transition-colors font-bold uppercase tracking-widest">{pro.user.fullName}</span>
                       <span className="w-1 h-1 bg-[#222] rounded-full" />
                       <span className="flex items-center gap-1 text-brand">
                          <Star className="w-3 h-3 fill-current" />
                          {pro.avgRating}
                       </span>
                   </p>
                </div>
                <div className="text-right">
                   <p className="text-3xl font-black text-brand italic font-mono">₦{service.price.toLocaleString()}</p>
                   <p className="text-[#444] text-[9px] font-black uppercase tracking-widest mt-1">Starting Price</p>
                </div>
            </div>

            <div className="bg-bg-deep rounded-2xl p-6 border border-border-muted mb-8 group hover:border-brand/20 transition-all">
                <p className="text-white/80 text-sm leading-relaxed font-medium mb-6 italic">
                    "{service.description}"
                </p>
                
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/5">
                          <Clock className="w-5 h-5 text-[#444]" />
                       </div>
                       <div>
                          <p className="text-white text-xs font-black tracking-tight">{service.durationMinutes} MIN</p>
                          <p className="text-[9px] text-[#444] font-black uppercase tracking-widest">Duration</p>
                       </div>
                    </div>
                    <div className="h-8 w-[1px] bg-border-muted" />
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/5">
                          <ShieldCheck className="w-5 h-5 text-[#444]" />
                       </div>
                       <div>
                          <p className="text-white text-xs font-black tracking-tight">PROTECTED</p>
                          <p className="text-[9px] text-[#444] font-black uppercase tracking-widest">Satisfaction</p>
                       </div>
                    </div>
                </div>
            </div>

            <button 
                onClick={onBook}
                className="w-full py-5 bg-brand text-bg-deep rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-brand/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
            >
                <Zap className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                Book Now
            </button>
        </div>
      </motion.div>
    </div>
  );
};
