import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  Scissors, 
  Star, 
  MapPin, 
  ChevronRight, 
  LayoutGrid, 
  List,
  ShieldCheck,
  Zap,
  Award
} from 'lucide-react';
import { ProfessionalCard } from '../components/discovery/ProfessionalCard';
import { BookingFlow } from '../components/booking/BookingFlow';
import { ServiceDetailsModal } from '../components/service/ServiceDetailsModal';
import { Professional, User, Service, ServiceCategory } from '../types';

export const Barbers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPro, setSelectedPro] = useState<(Professional & { user: User }) | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Load dynamically from localStorage to clear hardcoded mock barbers 
  // and show professionals when they are registered & signed in.
  const registeredPros = useMemo(() => {
    try {
      const usersRaw = localStorage.getItem('barbme_registered_users');
      const users: User[] = usersRaw ? JSON.parse(usersRaw) : [];
      
      return users
        .filter(u => u.role === 'professional')
        .map(u => {
          const proObj: Professional & { user: User } = {
            id: u.id,
            userId: u.id,
            bio: u.bio || 'Premium grooming specialist and master details barber.',
            categories: u.categories || ['Barbers'],
            yearsExperience: 5,
            serviceMode: (u.travelPreference as any) || 'both',
            address: u.travelPreference === 'home' ? 'House Call Service' : 'Elite Styles Studio, Lagos',
            latitude: 6.4281,
            longitude: 3.4219,
            avgRating: 5.0,
            totalReviews: 1,
            isAvailable: true,
            user: u
          };
          return proObj;
        });
    } catch (e) {
      console.error(e);
      return [];
    }
  }, []);

  const getProServices = (pro: Professional & { user: User }): Service[] => {
    const rawServices = pro.user.proServices || [];
    if (rawServices.length > 0) {
      return rawServices.map((s: any) => ({
        id: s.id || `pro-service-${pro.id}-${Math.random()}`,
        professionalId: pro.id,
        category: 'mens_hair',
        name: s.name,
        description: `${s.name} high-definition styling session.`,
        price: s.price,
        durationMinutes: parseInt(s.duration) || 45,
        isActive: true
      }));
    }
    // Default fallback services if none are configured yet
    return [
      {
        id: `default-fade-${pro.id}`,
        professionalId: pro.id,
        category: 'mens_hair',
        name: 'Signature Skin Fade',
        description: 'Elite level precision haircut tailored directly to your head structure.',
        price: 5000,
        durationMinutes: 45,
        isActive: true
      },
      {
        id: `default-beard-${pro.id}`,
        professionalId: pro.id,
        category: 'grooming',
        name: 'Luxury Beard Sculpt & Treat',
        description: 'Hot towel razor shave, lining, hydration oil, and hair conditioning.',
        price: 3500,
        durationMinutes: 30,
        isActive: true
      }
    ];
  };

  const filteredBarbers = useMemo(() => {
    return registeredPros.filter(pro => 
      pro.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pro.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pro.address?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, registeredPros]);

  return (
    <div className="pt-24 min-h-screen bg-bg-deep text-white">
      {/* Editorial Header */}
      <div className="max-w-7xl mx-auto px-6 mb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand/5 border border-brand/20 rounded-full text-brand text-[10px] font-black uppercase tracking-[0.2em] mb-8"
        >
          <Award className="w-4 h-4" /> 
          Verified Barbers
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-light tracking-tight italic font-serif mb-6"
        >
          The <span className="text-brand">Avaliable</span> Hair-Stylist
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto text-[#666] text-sm uppercase font-black tracking-widest leading-relaxed mb-12"
        >
          Discover Barbers for the art of haircut. <br/>
          Style. Best-Look
        </motion.p>

        {/* Dynamic Offers Ribbon */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto bg-brand p-[1px] rounded-2xl overflow-hidden shadow-2xl shadow-brand/20"
        >
          <div className="bg-bg-deep px-8 py-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-brand" />
              </div>
              <div className="text-left">
                <h4 className="text-lg font-bold text-white tracking-tight italic">Limited Edition <span className="text-brand">Offers</span></h4>
                <p className="text-[10px] text-[#555] font-black uppercase tracking-widest mt-1">First-time booking discounts available today</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-bg-surface px-4 py-2 border border-border-muted rounded-lg text-center">
                <p className="text-[8px] font-black text-brand uppercase tracking-tighter">OFF</p>
                <p className="text-xl font-black text-white italic font-mono leading-none">25%</p>
              </div>
              <div className="bg-bg-surface px-4 py-2 border border-border-muted rounded-lg text-center">
                <p className="text-[8px] font-black text-brand uppercase tracking-tighter">CODE</p>
                <p className="text-xl font-black text-white italic font-mono leading-none">FADE</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Filter Section */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="bg-bg-surface border border-border-muted p-6 rounded-3xl flex flex-col md:flex-row gap-6">
           <div className="relative flex-1 group">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#444] group-focus-within:text-brand transition-colors" />
             <input 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder="SEARCH BY NAME, LOCATION OR STYLE..."
               className="w-full bg-bg-deep border border-border-muted rounded-2xl pl-12 pr-4 py-4 text-[10px] font-black uppercase tracking-[0.2em] outline-none focus:border-brand/40 transition-all"
             />
           </div>
           <div className="flex gap-4">
              <button className="px-8 py-4 bg-bg-deep border border-border-muted rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#555] hover:text-white transition-all flex items-center gap-3">
                <Filter className="w-4 h-4" /> Filter
              </button>
              <button className="px-8 py-4 bg-brand text-bg-deep rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand/20 hover:opacity-90 transition-all active:scale-95">
                Sort: Rating
              </button>
           </div>
        </div>
      </div>

      {/* Barbers Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-32">
        {filteredBarbers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBarbers.map((pro, idx) => (
              <ProfessionalCard 
                key={pro.id}
                pro={pro}
                user={pro.user}
                services={getProServices(pro)}
                onServiceSelect={(service) => {
                  setSelectedPro(pro);
                  setSelectedService(service);
                }}
                onSelect={() => setSelectedPro(pro)}
              />
            ))}
          </div>
        ) : (
          <div className="py-40 text-center border-2 border-dashed border-border-muted rounded-3xl">
             <Scissors className="w-16 h-16 text-[#222] mx-auto mb-8 animate-pulse" />
             <h3 className="text-2xl font-light italic font-serif mb-4">No <span className="text-brand">Barbers</span> Found</h3>
             <p className="text-[10px] text-[#444] font-black uppercase tracking-widest">Adjust your search to find elite grooming professionals</p>
          </div>
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
