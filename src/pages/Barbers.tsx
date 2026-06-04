import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Award,
  Zap,
  SlidersHorizontal,
  ChevronDown,
  UserPlus,
  Sparkles,
  Scissors,
  Check
} from 'lucide-react';
import { ProfessionalCard } from '../components/discovery/ProfessionalCard';
import { BookingFlow } from '../components/booking/BookingFlow';
import { ServiceDetailsModal } from '../components/service/ServiceDetailsModal';
import { Professional, User, Service } from '../types';

// Full List of Nigerian States
const NIGERIAN_STATES = [
  "All Nigeria", "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

export const Barbers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('Lagos');
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedPro, setSelectedPro] = useState<(Professional & { user: User }) | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const categories = ['All', 'Fade', 'Braids', 'Locks', 'Beard', 'Treatments'];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsStateDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const registeredPros = useMemo(() => {
    try {
      const usersRaw = localStorage.getItem('barbme_registered_users');
      const users: User[] = usersRaw ? JSON.parse(usersRaw) : [];
      
      return users
        .filter(u => u.role === 'professional')
        .map(u => ({
          id: u.id,
          userId: u.id,
          bio: u.bio || 'Master of precision and contemporary grooming. Specializing in high-definition fades and artistic styling.',
          categories: u.categories || ['Barbers'],
          yearsExperience: 5,
          serviceMode: (u.travelPreference as any) || 'both',
          address: u.address || 'Lagos', // Using the address for filtering
          latitude: 6.4281,
          longitude: 3.4219,
          avgRating: 5.0,
          totalReviews: Math.floor(Math.random() * 20) + 1,
          isAvailable: true,
          user: u
        }));
    } catch (e) {
      return [];
    }
  }, []);

  const getProServices = (pro: any): Service[] => {
    const rawServices = pro.user.proServices || [];
    if (rawServices.length > 0) {
      return rawServices.map((s: any) => ({
        id: s.id || `pro-s-${pro.id}-${Math.random()}`,
        professionalId: pro.id,
        category: 'mens_hair',
        name: s.name,
        description: `${s.name} premium grooming session.`,
        price: s.price,
        durationMinutes: parseInt(s.duration) || 45,
        isActive: true
      }));
    }
    return [
      { id: `d1-${pro.id}`, professionalId: pro.id, category: 'mens_hair', name: 'Signature Skin Fade', description: 'Precision tailoring.', price: 5000, durationMinutes: 45, isActive: true },
      { id: `d2-${pro.id}`, professionalId: pro.id, category: 'grooming', name: 'Luxury Beard Sculpt', description: 'Razor finish.', price: 3000, durationMinutes: 30, isActive: true }
    ];
  };

  // ADVANCED FILTER LOGIC
  const filteredBarbers = useMemo(() => {
    return registeredPros.filter(pro => {
      const matchesSearch = 
        pro.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pro.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pro.address.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCat = activeCategory === 'All' || 
        pro.bio.toLowerCase().includes(activeCategory.toLowerCase()) ||
        pro.categories.some(c => c.toLowerCase().includes(activeCategory.toLowerCase()));

      const matchesLocation = selectedState === "All Nigeria" || 
        pro.address.toLowerCase().includes(selectedState.toLowerCase());

      return matchesSearch && matchesCat && matchesLocation;
    });
  }, [searchQuery, activeCategory, selectedState, registeredPros]);

  return (
    <div className="pt-24 min-h-screen bg-bg-deep text-white selection:bg-brand selection:text-bg-deep">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-brand/10 to-transparent opacity-30 pointer-events-none" />

      {/* 1. Header Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6"
        >
          <Award className="w-3.5 h-3.5 text-brand" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand">Vetted Professionals</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-light tracking-tighter italic font-serif mb-6 leading-none"
        >
          Elite <span className="text-brand">Stylists.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-xl mx-auto text-[#888] text-xs md:text-sm uppercase font-bold tracking-[0.3em] leading-relaxed mb-12"
        >
          Discover Nigeria's most skilled grooming professionals across every state.
        </motion.p>

        {/* 2. SEARCH ENGINE */}
        <div className="max-w-5xl mx-auto mb-16 relative z-50">
          <div className="bg-bg-surface/40 backdrop-blur-xl border border-border-muted p-2 rounded-2xl shadow-2xl flex flex-col lg:flex-row gap-2">
            
            {/* Name/Style Search */}
            <div className="relative flex-[2] group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#555] group-focus-within:text-brand transition-colors" />
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name or style..."
                className="w-full bg-transparent pl-14 pr-4 py-5 text-sm font-medium outline-none placeholder:text-[#444] text-white"
              />
            </div>
            
            <div className="h-px lg:h-10 lg:w-px bg-border-muted self-center" />

            {/* STATE SELECTOR */}
            <div className="relative flex-1" ref={dropdownRef}>
              <div 
                onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
                className="flex items-center justify-between px-4 py-5 hover:bg-white/5 rounded-xl transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-brand" />
                  <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[120px]">
                    {selectedState}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-[#444] transition-transform ${isStateDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {/* State Dropdown Menu */}
              <AnimatePresence>
                {isStateDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-bg-surface border border-border-muted rounded-xl shadow-2xl max-h-[300px] overflow-y-auto z-[100] hide-scrollbar"
                  >
                    {NIGERIAN_STATES.map((state) => (
                      <div 
                        key={state}
                        onClick={() => {
                          setSelectedState(state);
                          setIsStateDropdownOpen(false);
                        }}
                        className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors cursor-pointer border-b border-white/5 last:border-0"
                      >
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${selectedState === state ? 'text-brand' : 'text-[#888]'}`}>
                          {state}
                        </span>
                        {selectedState === state && <Check className="w-3 h-3 text-brand" />}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              className="bg-brand text-bg-deep px-8 py-5 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-brand/20 hover:scale-[1.02] transition-all active:scale-95"
              onClick={() => {/* Filters update automatically via useMemo */}}
            >
              Search Stylists
            </button>
          </div>

          {/* Quick Category Pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${
                  activeCategory === cat 
                  ? 'bg-brand border-brand text-bg-deep shadow-lg shadow-brand/20' 
                  : 'bg-transparent border-border-muted text-[#666] hover:border-white hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Offer Banner */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <motion.div 
          whileHover={{ y: -5 }}
          className="relative overflow-hidden bg-gradient-to-r from-brand/20 via-brand/5 to-transparent border border-brand/30 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-brand flex items-center justify-center shadow-lg shadow-brand/40">
              <Sparkles className="w-8 h-8 text-bg-deep" />
            </div>
            <div>
              <h3 className="text-2xl font-light italic font-serif text-white">Elite Privilege</h3>
              <p className="text-[10px] text-[#888] font-black uppercase tracking-[0.2em] mt-1">First-time booking? Use <span className="text-brand">WELCOME25</span> for 25% off.</p>
            </div>
          </div>
          <button className="px-10 py-4 bg-white text-bg-deep text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-brand transition-colors font-bold">
            Redeem Now
          </button>
        </motion.div>
      </section>

      {/* 4. Professionals Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-40">
        <div className="flex items-center justify-between mb-10 border-b border-border-muted pb-6">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[#888]">
              {filteredBarbers.length} Available in {selectedState}
            </h2>
          </div>
          <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#555] hover:text-brand transition-colors">
            <SlidersHorizontal className="w-4 h-4" /> Filter Result
          </button>
        </div>

        {filteredBarbers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredBarbers.map((pro, idx) => (
              <motion.div
                key={pro.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <ProfessionalCard 
                  pro={pro}
                  user={pro.user}
                  services={getProServices(pro)}
                  onServiceSelect={(service) => {
                    setSelectedPro(pro);
                    setSelectedService(service);
                  }}
                  onSelect={() => setSelectedPro(pro)}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-40 text-center rounded-3xl bg-bg-surface/20 border-2 border-dashed border-border-muted"
          >
             <Scissors className="w-16 h-16 text-[#333] mx-auto mb-6" />
             <h3 className="text-3xl font-light italic font-serif mb-2">No Stylists Found in {selectedState}</h3>
             <p className="text-[10px] text-[#555] font-black uppercase tracking-[0.2em] mb-8">Try searching for a different state or service category.</p>
             <button 
               onClick={() => {setSearchQuery(''); setActiveCategory('All'); setSelectedState('All Nigeria')}}
               className="px-8 py-4 border border-brand text-brand text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-brand hover:text-bg-deep transition-all font-bold"
             >
               Reset Filters
             </button>
          </motion.div>
        )}
      </section>

      {/* Modals */}
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