import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Scissors, 
  Clock, 
  Star, 
  TrendingDown, 
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';
import { Professional, User, Service, ServiceCategory } from '../types';
import { ProfessionalCard } from '../components/discovery/ProfessionalCard';
import { BookingFlow } from '../components/booking/BookingFlow';
import { ServiceDetailsModal } from '../components/service/ServiceDetailsModal';
import { MOCK_BARBERS, MOCK_SERVICES } from '../constants/mockData';

export const Offers = () => {
  const [selectedPro, setSelectedPro] = useState<(Professional & { user: User }) | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <div className="pt-24 min-h-screen bg-bg-deep text-white">
      {/* Editorial Header */}
      <div className="max-w-7xl mx-auto px-6 mb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand/5 border border-brand/20 rounded-full text-brand text-[10px] font-black uppercase tracking-[0.2em] mb-8"
        >
          <Zap className="w-4 h-4" /> 
          Offers
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-light tracking-tight italic font-serif mb-6"
        >
          Todays <span className="text-brand">Offers</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto text-[#666] text-sm uppercase font-black tracking-widest leading-relaxed"
        >
          Book your best style Haircut today.
        </motion.p>
      </div>

      {/* Offers Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {MOCK_SERVICES.map((service, idx) => {
                const pro = MOCK_BARBERS.find(p => p.id === service.professionalId);
                if (!pro) return null;

                return (
                    <motion.div
                        key={service.id}
                        initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-bg-surface border border-border-muted rounded-3xl overflow-hidden group hover:border-brand/30 transition-all flex flex-col md:flex-row shadow-2xl shadow-black/40"
                    >
                        <div className="md:w-48 h-48 md:h-full relative overflow-hidden">
                            <img 
                                src={pro.user.avatarUrl} 
                                className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-transparent to-transparent opacity-60" />
                            <div className="absolute bottom-4 left-4">
                                <p className="text-[10px] font-black text-white uppercase tracking-widest">{pro.user.fullName}</p>
                                <div className="flex items-center gap-1 text-brand">
                                    <Star className="w-3 h-3 fill-brand" />
                                    <span className="text-[10px] font-mono">{pro.avgRating}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 p-8 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="px-3 py-1 bg-brand text-bg-deep text-[9px] font-black uppercase tracking-widest rounded-full">
                                        SPECIAL DEAL
                                    </span>
                                    <div className="flex items-center gap-2 text-[#444]">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{service.durationMinutes} MIN</span>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-light text-white tracking-tight italic font-serif mb-2 group-hover:text-brand transition-colors">
                                    {service.name}
                                </h3>
                                <p className="text-[10px] text-[#555] uppercase font-black tracking-widest leading-relaxed mb-6">
                                    {service.description}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-border-muted">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-2xl font-bold text-white font-mono italic">₦{service.price}</span>
                                    <span className="text-[10px] text-[#444] line-through font-mono uppercase tracking-widest">₦{service.price + 2000}</span>
                                </div>
                                <button 
                                    onClick={() => {
                                        setSelectedPro(pro);
                                        setSelectedService(service);
                                    }}
                                    className="flex items-center gap-2 px-6 py-3 bg-white text-bg-deep rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand transition-all group/btn"
                                >
                                    Book Now <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
      </div>

      <AnimatePresence>
        {selectedPro && (
          <BookingFlow 
            pro={selectedPro} 
            isOpen={!!selectedPro} 
            onClose={() => setSelectedPro(null)} 
          />
        )}

        {selectedService && selectedPro && (
          <ServiceDetailsModal
            isOpen={!!selectedService}
            onClose={() => setSelectedService(null)}
            service={selectedService}
            pro={selectedPro}
            onBook={() => {
              setSelectedService(null);
              setSelectedPro(selectedPro);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
