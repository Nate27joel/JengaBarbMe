import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Scissors, 
  Clock, 
  Star, 
  ArrowRight,
  Tag,
  Loader2
} from 'lucide-react';
import { Professional, User, Service } from '../types';
import { BookingFlow } from '../components/booking/BookingFlow';
import { ServiceDetailsModal } from '../components/service/ServiceDetailsModal';
import { MOCK_BARBERS, MOCK_SERVICES } from '../constants/mockData';
import { useAuth } from '../contexts/AuthContext';

// High-quality service-specific images for a professional look
const SERVICE_IMAGES = [
  "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=500", // Skin Fade
  "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=500", // Beard Trim
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=500", // Classic Cut
  "https://images.unsplash.com/photo-1646753522408-077ef9839300?q=80&w=500", // Braids/Texture
  "https://images.unsplash.com/photo-1593702275677-f916c8c98ca3?q=80&w=500", // Luxury Shave
];

export const Offers = () => {
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedPro, setSelectedPro] = useState<(Professional & { user: User }) | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Simulate Backend Fetch
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const targetPro = useMemo(() => {
    // 1. Check Auth 2. Check LocalStorage 3. Fallback to Mock
    const registered = JSON.parse(localStorage.getItem('barbme_registered_users') || '[]');
    const localProUser = registered.find((u: any) => u.role === 'professional');
    const activeUser = (authUser?.role === 'professional' ? authUser : localProUser);

    if (activeUser) {
      const match = MOCK_BARBERS.find(p => p.userId === activeUser.id);
      return match ? { ...match, user: { ...match.user, ...activeUser } } : {
        id: activeUser.id,
        userId: activeUser.id,
        bio: activeUser.bio || 'Premium grooming specialist.',
        categories: activeUser.categories || ['Barbers'],
        yearsExperience: 5,
        serviceMode: 'both',
        address: 'Lagos, Nigeria',
        avgRating: 4.9,
        totalReviews: 24,
        isAvailable: true,
        user: activeUser
      };
    }
    return MOCK_BARBERS[0];
  }, [authUser]);

  const offersList = useMemo(() => {
    if (!targetPro) return [];
    const mocks = MOCK_SERVICES.filter(s => s.professionalId === targetPro.id);
    const customs = (targetPro.user.proServices || []).map((s: any, i: number) => ({
      id: s.id || `offer-${i}`,
      professionalId: targetPro.id,
      name: s.name,
      description: s.description || 'Signature premium grooming session.',
      price: parseInt(s.price) || 5000,
      durationMinutes: parseInt(s.duration) || 45,
      isActive: true
    }));
    return [...mocks, ...customs];
  }, [targetPro]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-deep flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-bg-deep text-white selection:bg-brand selection:text-bg-deep">
      {/* Dynamic Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 mb-20 text-center">
        
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-light tracking-tighter italic font-serif mb-8"
        >
          Special <span className="text-brand">Offers</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-xl mx-auto text-[#888] text-[11px] md:text-xs uppercase font-bold tracking-[0.3em] leading-relaxed"
        >
          Premium services at exceptional rates from <span className="text-white underline decoration-brand underline-offset-4"></span>. 
          Limited availability for this week only.
        </motion.p>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-40">
        {offersList.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {offersList.map((service, idx) => {
                // Calculate a fake "original price" for the discount look
                const originalPrice = Math.ceil(service.price * 1.3 / 500) * 500;
                const discount = Math.round(((originalPrice - service.price) / originalPrice) * 100);

                return (
                    <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-bg-surface/40 backdrop-blur-sm border border-border-muted rounded-[2rem] overflow-hidden group hover:border-brand/40 transition-all duration-500 flex flex-col md:flex-row h-full shadow-2xl"
                    >
                        {/* Different Image for Each Div based on index */}
                        <div className="md:w-56 h-64 md:h-auto relative overflow-hidden">
                            <img 
                                src={SERVICE_IMAGES[idx % SERVICE_IMAGES.length]} 
                                className="w-full h-full object-cover grayscale-[0.4] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" 
                                alt={service.name}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/80 via-transparent to-transparent" />
                            <div className="absolute top-4 left-4">
                               <div className="bg-brand text-bg-deep px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter shadow-xl">
                                  {discount}% OFF
                               </div>
                            </div>
                        </div>

                        <div className="flex-1 p-10 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                                        <Zap className="w-3 h-3 text-brand fill-brand" />
                                        <span className="text-[9px] font-black text-white uppercase tracking-widest">Flash Deal</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[#666]">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">{service.durationMinutes}m</span>
                                    </div>
                                </div>
                                
                                <h3 className="text-3xl font-light text-white tracking-tight italic font-serif mb-4 group-hover:text-brand transition-colors">
                                    {service.name}
                                </h3>
                                
                                <p className="text-[11px] text-[#777] font-medium tracking-wide leading-relaxed mb-8 line-clamp-2">
                                    {service.description}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-8 border-t border-white/5">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-[#555] line-through font-bold tracking-widest mb-1">₦{originalPrice.toLocaleString()}</span>
                                    <span className="text-3xl font-light text-white italic font-serif">₦{service.price.toLocaleString()}</span>
                                </div>
                                <button 
                                    onClick={() => {
                                        setSelectedPro(targetPro);
                                        setSelectedService(service);
                                    }}
                                    className="flex items-center gap-3 px-8 py-4 bg-brand text-bg-deep rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-lg shadow-brand/20 group/btn active:scale-95"
                                >
                                    Book <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-32 text-center border-2 border-dashed border-border-muted rounded-[3rem] bg-bg-surface/20 p-12 max-w-2xl mx-auto"
          >
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
                <Scissors className="w-8 h-8 text-[#333]" />
            </div>
            <h3 className="text-3xl font-light text-white italic font-serif mb-4">Seasonal Pause</h3>
            <p className="text-xs text-[#666] font-bold uppercase tracking-[0.2em] leading-loose max-w-sm mx-auto">
              {targetPro?.user.fullName} is currently fully booked. Check back soon for exclusive loyalty offers.
            </p>
          </motion.div>
        )}
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