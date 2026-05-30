import React from 'react';
import { motion } from 'motion/react';
import { X, Calendar, Clock, User, Scissors, ChevronRight } from 'lucide-react';

interface BookingsSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookingsSummaryModal: React.FC<BookingsSummaryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const bookings = [
    { id: 'b1', client: 'Adesola Bello', service: 'Fade + Beard Trim', date: 'TODAY', time: '10:00 AM', status: 'In Progress', price: '₦5,500' },
    { id: 'b2', client: 'Chidi Nwosu', service: 'Traditional Braids', date: 'TODAY', time: '01:30 PM', status: 'Confirmed', price: '₦12,000' },
    { id: 'b3', client: 'Tunde Raji', service: 'Hair Coloring', date: 'TODAY', time: '04:00 PM', status: 'Confirmed', price: '₦8,500' },
    { id: 'b4', client: 'Grace E.', service: 'Silk Press', date: 'YESTERDAY', time: '06:00 PM', status: 'Completed', price: '₦15,000' },
    { id: 'b5', client: 'Michael S.', service: 'Basic Cut', date: '08 MAY', time: '11:00 AM', status: 'Completed', price: '₦3,500' },
  ];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-bg-deep/90 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-xl bg-bg-surface rounded-3xl border border-border-muted overflow-hidden shadow-2xl"
      >
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-2xl font-light text-white tracking-tight italic font-serif">Booking <span className="text-brand">Summary</span></h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#555] mt-2">Activity report for the last 7 days</p>
            </div>
            <button onClick={onClose} className="p-2 text-[#444] hover:text-white transition-colors bg-bg-deep/50 rounded-full backdrop-blur-md">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {bookings.map((b) => (
              <div key={b.id} className="bg-bg-deep/50 p-5 rounded-2xl border border-border-muted hover:border-brand/20 transition-all group">
                <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-bg-surface border border-border-muted flex items-center justify-center group-hover:border-brand/10 transition-all">
                         <User className="w-4 h-4 text-brand" />
                      </div>
                      <div>
                         <p className="text-xs font-bold text-white tracking-tight">{b.client}</p>
                         <p className="text-[8px] font-black text-[#444] uppercase tracking-widest mt-0.5">{b.service}</p>
                      </div>
                   </div>
                   <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded ${
                     b.status === 'Completed' ? 'bg-green-500/10 text-green-500' : 
                     b.status === 'In Progress' ? 'bg-brand/10 text-brand' : 
                     'bg-[#111] text-[#444]'
                   }`}>
                      {b.status}
                   </span>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-border-muted/50">
                   <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                         <Calendar className="w-3 h-3 text-[#444]" />
                         <span className="text-[9px] font-black text-white uppercase tracking-widest">{b.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                         <Clock className="w-3 h-3 text-[#444]" />
                         <span className="text-[9px] font-black text-white uppercase tracking-widest">{b.time}</span>
                      </div>
                   </div>
                   <p className="text-sm font-black text-white font-mono italic">{b.price}</p>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={onClose}
            className="w-full mt-8 py-4 bg-brand text-bg-deep rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand/10 hover:opacity-90 transition-all"
          >
            Close Summary
          </button>
        </div>
      </motion.div>
    </div>
  );
};
