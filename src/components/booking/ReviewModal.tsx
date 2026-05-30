import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, X, MessageSquare, Send } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: {
    id: string;
    pro: string;
    service: string;
  };
  onSubmit: (rating: number, comment: string) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, booking, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    onSubmit(rating, comment);
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-bg-deep/80 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md bg-bg-surface rounded-2xl border border-border-muted overflow-hidden shadow-2xl"
      >
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-2xl font-light text-white tracking-tight italic font-serif">Rate your <span className="text-brand">Experience</span></h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#555] mt-2">
                {booking.service} with <span className="text-brand">{booking.pro}</span>
              </p>
            </div>
            <button onClick={onClose} className="p-2 text-[#444] hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col items-center">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className="transition-all duration-200"
                  >
                    <Star 
                      className={`w-10 h-10 ${
                        star <= (hover || rating) 
                          ? 'text-brand fill-current shadow-brand' 
                          : 'text-[#222]'
                      }`} 
                    />
                  </button>
                ))}
              </div>
              <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-brand italic h-4">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Outstanding!'}
              </p>
            </div>

            <div className="relative group">
              <div className="absolute left-4 top-4">
                <MessageSquare className="w-4 h-4 text-[#444] group-focus-within:text-brand transition-colors" />
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="TELL US WHAT YOU LIKED OR COULD BE IMPROVED..."
                className="w-full bg-bg-deep border border-border-muted rounded-xl p-4 pl-12 text-xs text-white outline-none focus:border-brand transition-all min-h-[120px] resize-none uppercase font-black placeholder:text-[#333] tracking-widest"
              />
            </div>

            <button
              disabled={rating === 0 || isSubmitting}
              className="w-full py-4 bg-brand text-bg-deep rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-brand/10 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                >
                  <Star className="w-4 h-4" />
                </motion.div>
              ) : (
                <>Submit Review <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
