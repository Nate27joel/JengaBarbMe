import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Map as MapIcon, List, Star, Clock, Zap } from 'lucide-react';
import { DiscoveryMap } from '../components/discovery/DiscoveryMap';
import { ProfessionalCard } from '../components/discovery/ProfessionalCard';
import { BookingFlow } from '../components/booking/BookingFlow';
import { ServiceDetailsModal } from '../components/service/ServiceDetailsModal';
import { Professional, User, Service } from '../types';

const CATEGORIES = ['All', 'Barbers', 'Braiders', 'Stylists', 'Nails', 'Grooming'];

export const Discovery = () => {
  const [view, setView] = useState<'map' | 'list'>('list');
  const [selectedPro, setSelectedPro] = useState<(Professional & { user: User }) | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'reviews'>('rating');
  const [searchParams] = useSearchParams();

  // Load dynamically from localStorage to clear hardcoded mock barbers 
  // and show professionals when they are registered & signed in.
  const registeredPros = useMemo(() => {
    try {
      const usersRaw = localStorage.getItem('barbme_registered_users');
      const users: User[] = usersRaw ? JSON.parse(usersRaw) : [];
      
      return users
        .filter(u => u.role === 'professional')
        .map((u, idx) => {
          const anyUser = u as any;
          const proObj: Professional & { user: User } = {
            id: u.id,
            userId: u.id,
            bio: anyUser.bio || 'Premium grooming specialist and master details barber.',
            categories: anyUser.categories || ['Barbers'],
            yearsExperience: anyUser.yearsExperience || 5,
            serviceMode: (anyUser.travelPreference as any) || 'both',
            address: anyUser.travelPreference === 'home' ? 'House Call Service' : (anyUser.address || 'Elite Styles Studio, Lagos'),
            latitude: 6.4281 + (idx * 0.008),
            longitude: 3.4219 + (idx * 0.012),
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
        price: Number(s.price) || 5000,
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
        price: 5500,
        durationMinutes: 45,
        isActive: true
      },
      {
        id: `default-beard-${pro.id}`,
        professionalId: pro.id,
        category: 'grooming',
        name: 'Luxury Beard Sculpt & Treat',
        description: 'Hot towel razor shave, lining, hydration oil, and hair conditioning.',
        price: 2500,
        durationMinutes: 30,
        isActive: true
      }
    ];
  };

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && CATEGORIES.includes(categoryParam)) {
      setActiveCategory(categoryParam);
    }
    
    const locationParam = searchParams.get('location');
    if (locationParam) {
      setSearchQuery(locationParam);
    }
  }, [searchParams]);

  const filteredPros = useMemo(() => {
    return registeredPros.filter(pro => {
      const matchesSearch = pro.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            pro.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (pro.address && pro.address.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = activeCategory === 'All' || pro.categories.includes(activeCategory);
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.avgRating - a.avgRating;
      if (sortBy === 'experience') return b.yearsExperience - a.yearsExperience;
      if (sortBy === 'reviews') return b.totalReviews - a.totalReviews;
      return 0;
    });
  }, [searchQuery, activeCategory, sortBy, registeredPros]);

  return (
    <div className="pt-20 min-h-screen bg-bg-deep">
      {/* Header / Filter Bar */}
      <div className="sticky top-20 z-30 bg-bg-deep/80 backdrop-blur-md border-b border-border-muted px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555] w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search stylists, barbers, or skills..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-bg-surface border border-border-muted rounded-xl focus:border-brand transition-all text-sm outline-none text-white placeholder:text-[#444]"
              />
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* Sort Dropdown */}
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-bg-surface border border-border-muted rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-[#888] outline-none focus:border-brand/30 transition-all cursor-pointer"
              >
                <option value="rating">Top Rated</option>
                <option value="experience">Most Experienced</option>
                <option value="reviews">Most Reviewed</option>
              </select>

              <div className="h-10 w-[1px] bg-border-muted hidden md:block" />
              
              <div className="flex bg-bg-sidebar p-1.5 rounded-xl border border-border-muted">
                <button 
                  onClick={() => setView('list')}
                  className={`flex items-center gap-2 px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'list' ? 'bg-bg-surface border border-border-highlight text-brand shadow-xl' : 'text-[#555] hover:text-[#888]'}`}
                >
                  <List className="w-4 h-4" />
                  <span>List</span>
                </button>
                <button 
                  onClick={() => setView('map')}
                  className={`flex items-center gap-2 px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'map' ? 'bg-bg-surface border border-border-highlight text-brand shadow-xl' : 'text-[#555] hover:text-[#888]'}`}
                >
                  <MapIcon className="w-4 h-4" />
                  <span>Map</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${
                  activeCategory === cat 
                  ? 'bg-brand text-bg-deep border-brand shadow-lg' 
                  : 'bg-bg-surface text-[#555] border-border-muted hover:border-brand/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`max-w-7xl mx-auto px-4 py-8 ${view === 'map' ? 'h-[calc(100vh-280px)]' : 'min-h-screen'}`}>
        {/* Nearby Banner (only in list view) */}
        {view === 'list' && searchQuery === '' && activeCategory === 'All' && (
          <div className="mb-10 p-8 rounded-2xl bg-bg-surface border border-brand/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-[100px]" />
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center border border-brand/20 shadow-xl group-hover:scale-110 transition-transform">
                  <Zap className="text-brand w-8 h-8 fill-current" />
                </div>
                <div>
                  <h2 className="text-2xl font-light text-white tracking-tight italic font-serif">Instant <span className="text-brand">Booking</span> available.</h2>
                  <p className="text-[#888] text-sm font-medium mt-1 uppercase tracking-widest">Book top pros in under 60 seconds.</p>
                </div>
              </div>
              <button 
                onClick={() => setSortBy('rating')}
                className="px-8 py-3 bg-brand text-bg-deep rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-xl hover:opacity-90 active:scale-95 transition-all"
              >
                View Top Rated
              </button>
            </div>
          </div>
        )}

        {view === 'list' ? (
          <div>
            {filteredPros.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPros.map(pro => (
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
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-bg-surface rounded-full flex items-center justify-center mb-6 border border-border-muted">
                  <Search className="w-10 h-10 text-[#444]" />
                </div>
                <h3 className="text-xl font-light text-white mb-2 italic font-serif">No <span className="text-brand">professionals</span> found.</h3>
                <p className="text-[#555] uppercase tracking-widest text-[10px] font-black">Try adjusting your filters or search query.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full border border-border-muted rounded-2xl overflow-hidden shadow-2xl">
            <DiscoveryMap 
              professionals={filteredPros} 
              onSelect={(pro: any) => setSelectedPro(registeredPros.find(p => p.id === pro.id) || null)} 
            />
          </div>
        )}
      </div>

      {/* Newsletter Footer Section */}
      {view === 'list' && (
        <div className="bg-bg-sidebar border-t border-border-muted py-20 mt-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-light text-white tracking-tight mb-4 italic font-serif">Stay <span className="text-brand">Connected.</span></h2>
            <p className="text-[#888] text-sm font-medium uppercase tracking-widest mb-10">Get notified when new pros join your area.</p>
            <div className="max-w-md mx-auto flex gap-4">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 bg-bg-surface border border-border-muted rounded-xl px-6 py-4 text-white text-sm outline-none focus:border-brand transition-all"
              />
              <button className="px-8 py-4 bg-brand text-bg-deep rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:opacity-90 transition-all">
                Join
              </button>
            </div>
            <p className="text-[10px] text-[#444] uppercase tracking-[0.2em] mt-8 font-black">Join 15,000+ others already subscribed.</p>
          </div>
        </div>
      )}

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
            setSelectedPro(selectedPro); // Redundant but triggers BookingFlow
          }}
        />
      )}
    </div>
  );
};
