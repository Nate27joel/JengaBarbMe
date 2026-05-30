import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Wallet, 
  History, 
  Star, 
  Settings, 
  ShieldCheck,
  ChevronRight,
  Clock,
  Scissors,
  MapPin,
  MessageSquare,
  Search,
  Filter,
  ArrowUpDown,
  X
} from 'lucide-react';
import { ChatWindow } from '../components/chat/ChatWindow';
import { ReviewModal } from '../components/booking/ReviewModal';
import { QuickSettingsModal } from '../components/dashboard/QuickSettingsModal';
import { User as UserType } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const ClientDashboard = () => {
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState<{ recipient: UserType; bookingId: string } | null>(null);
  const [reviewBooking, setReviewBooking] = useState<any | null>(null);
  const [settingsModal, setSettingsModal] = useState<{ isOpen: boolean; initialTab: 'account' | 'profile' | 'privacy' | 'payment' | 'saved' }>({
    isOpen: false,
    initialTab: 'account'
  });

  const upcomingBookings = [
    { 
      id: 'b1', 
      pro: 'Boluwatife Adeyemi', 
      proId: 'u1',
      proAvatar: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=100',
      service: 'Low Fade', 
      date: 'Tomorrow, 10:00 AM', 
      mode: 'In-Shop',
      status: 'Confirmed'
    }
  ];

  const handleOpenChat = (booking: any) => {
    setActiveChat({
      recipient: {
        id: booking.proId,
        fullName: booking.pro,
        avatarUrl: booking.proAvatar,
        email: '',
        phone: '',
        role: 'professional',
        isVerified: true,
        verificationStatus: 'verified',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      bookingId: booking.id
    });
  };

  const [recentServices, setRecentServices] = useState([
    { id: 'b2', pro: 'Chinwe Okeke', service: 'Box Braids', date: '2024-05-05', displayDate: '5 May 2024', rating: 5, price: '₦12,000', reviewed: true },
    { id: 'b3', pro: 'Kingsley E.', service: 'Beard Grooming', date: '2024-04-28', displayDate: '28 Apr 2024', rating: 4, price: '₦4,500', reviewed: true },
    { id: 'b4', pro: 'Amara J.', service: 'Silk Press', date: '2024-05-09', displayDate: 'Yesterday', rating: 0, price: '₦15,000', reviewed: false },
  ]);

  const [filters, setFilters] = useState({
    searchPro: '',
    serviceType: 'All',
    dateFrom: '',
    dateTo: '',
    sortBy: 'date',
    sortOrder: 'desc' as 'asc' | 'desc'
  });

  const uniqueServices = useMemo(() => ['All', ...new Set(recentServices.map(s => s.service))], [recentServices]);

  const filteredAndSortedServices = useMemo(() => {
    return recentServices
      .filter(s => {
        const matchesPro = s.pro.toLowerCase().includes(filters.searchPro.toLowerCase());
        const matchesService = filters.serviceType === 'All' || s.service === filters.serviceType;
        const matchesDateFrom = !filters.dateFrom || s.date >= filters.dateFrom;
        const matchesDateTo = !filters.dateTo || s.date <= filters.dateTo;
        return matchesPro && matchesService && matchesDateFrom && matchesDateTo;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (filters.sortBy === 'date') {
          comparison = a.date.localeCompare(b.date);
        } else if (filters.sortBy === 'rating') {
          comparison = a.rating - b.rating;
        }
        return filters.sortOrder === 'desc' ? -comparison : comparison;
      });
  }, [recentServices, filters]);

  const handleReviewSubmit = (rating: number, comment: string) => {
    if (!reviewBooking) return;
    
    setRecentServices(prev => prev.map(s => 
      s.id === reviewBooking.id 
        ? { ...s, rating, reviewed: true } 
        : s
    ));
    // In a real app, this would also add to a reviews collection
  };

  return (
    <div className="pt-20 min-h-screen bg-bg-deep">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Profile Summary */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-bg-surface p-8 rounded-2xl shadow-2xl border border-border-muted mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-[100px]" />
          
          <div className="flex items-center gap-6 mb-6 md:mb-0 relative z-10">
            <div className="w-20 h-20 rounded-xl bg-bg-deep flex items-center justify-center overflow-hidden border border-border-highlight">
                <img 
                  src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'Nate Azike')}&background=c4a47c&color=0d0d0d`} 
                  className="w-full h-full object-cover grayscale-[0.2]" 
                  referrerPolicy="no-referrer"
                />
            </div>
            <div>
                <h1 className="text-3xl font-light text-white tracking-tight">Hi, <span className="text-brand italic font-serif">{user?.fullName ? user.fullName.split(' ')[0] : 'Nate'}</span></h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-brand shadow-[0_0_8px_rgba(196,164,124,0.3)]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#555]">Verified Client</span>
                    </div>
                    <span id="user-id-badge" className="text-[9px] font-mono text-brand/60 px-2 py-0.5 bg-brand/5 border border-brand/10 rounded-md">
                        ID: {user?.id || 'u2_nate'}
                    </span>
                </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full md:w-auto relative z-10">
            <div className="bg-bg-deep p-6 rounded-xl border border-border-muted min-w-[170px]">
                <p className="text-[10px] font-black text-[#444] uppercase tracking-widest mb-1">Wallet Balance</p>
                <p className="text-2xl font-light text-white font-mono italic">₦8,500</p>
            </div>
            <button 
                onClick={() => alert('Top up system coming soon! Payment gateway integration required.')}
                className="bg-brand text-bg-deep rounded-xl p-6 flex flex-col justify-between hover:opacity-90 transition-all shadow-xl shadow-brand/5 active:scale-95 group"
            >
                <Wallet className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Top Up</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Main column */}
            <div className="lg:col-span-2 space-y-12">
                
                {/* Upcoming */}
                <div>
                   <h2 className="text-xl font-light text-white tracking-tight mb-8 italic font-serif">Upcoming <span className="text-brand">Appointments</span></h2>
                   {upcomingBookings.length > 0 ? (
                       upcomingBookings.map(b => (
                           <motion.div 
                            key={b.id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-bg-surface p-8 rounded-2xl shadow-xl border border-border-muted flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden group hover:border-brand/20 transition-all"
                           >
                               <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 -translate-y-1/2 translate-x-1/2 rounded-full blur-2xl group-hover:bg-brand/10 transition-all" />
                               
                               <div className="flex items-center gap-6 relative z-10">
                                   <div className="w-14 h-14 bg-brand rounded-xl flex items-center justify-center shadow-lg">
                                       <Calendar className="text-bg-deep w-6 h-6" />
                                   </div>
                                   <div>
                                       <h3 className="font-bold text-white text-lg mb-1 tracking-tight">{b.service}</h3>
                                       <p className="text-[10px] font-black uppercase tracking-widest text-brand mb-2">{b.pro}</p>
                                       <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#555]">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                <span>{b.date}</span>
                                            </div>
                                            <span>•</span>
                                            <div className="flex items-center gap-1 text-brand/80">
                                                <MapPin className="w-3 h-3" />
                                                <span>{b.mode}</span>
                                            </div>
                                       </div>
                                   </div>
                               </div>

                               <div className="flex flex-wrap items-center gap-3 relative z-10 w-full md:w-auto">
                                   <button 
                                      onClick={() => handleOpenChat(b)}
                                      className="flex-1 md:flex-none p-3 bg-bg-deep text-brand border border-border-muted rounded-lg hover:bg-bg-sidebar transition-colors group/btn"
                                   >
                                       <MessageSquare className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                   </button>
                                   <button 
                                      onClick={() => alert('Appointment management features coming soon!')}
                                      className="flex-1 md:flex-none px-6 py-3 bg-bg-deep text-[#888] font-black uppercase tracking-widest text-[10px] border border-border-muted rounded-lg hover:bg-bg-sidebar transition-colors"
                                   >
                                       Manage
                                   </button>
                                   <button className="flex-1 md:flex-none px-6 py-3 bg-brand text-bg-deep font-black uppercase tracking-widest text-[10px] rounded-lg shadow-xl shadow-brand/5 hover:opacity-90 transition-all">
                                       Call Stylist
                                   </button>
                               </div>
                           </motion.div>
                       ))
                   ) : (
                       <div className="bg-bg-surface p-12 rounded-2xl border border-border-muted text-center shadow-lg">
                           <Scissors className="w-10 h-10 text-[#222] mx-auto mb-4" />
                           <p className="text-[#555] font-black uppercase tracking-widest text-xs">No upcoming appointments</p>
                           <button className="mt-4 text-brand font-black uppercase tracking-widest text-[10px] hover:underline underline-offset-4">Find a stylist</button>
                       </div>
                   )}
                </div>

                {/* History */}
                <div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <h2 className="text-xl font-light text-white tracking-tight italic font-serif">Service <span className="text-brand">History</span></h2>
                        
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative group flex-1 md:flex-none">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#444] group-focus-within:text-brand transition-colors" />
                                <input 
                                    value={filters.searchPro}
                                    onChange={(e) => setFilters(prev => ({ ...prev, searchPro: e.target.value }))}
                                    placeholder="PROFESSIONAL..."
                                    className="w-full md:w-40 bg-bg-surface border border-border-muted rounded-lg pl-9 pr-4 py-2 text-[9px] font-black uppercase tracking-widest text-white outline-none focus:border-brand/50 transition-all"
                                />
                            </div>
                            
                            <select 
                                value={filters.serviceType}
                                onChange={(e) => setFilters(prev => ({ ...prev, serviceType: e.target.value }))}
                                className="bg-bg-surface border border-border-muted rounded-lg px-4 py-2 text-[9px] font-black uppercase tracking-widest text-white outline-none focus:border-brand/50 transition-all appearance-none cursor-pointer hover:border-brand/30"
                            >
                                {uniqueServices.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                            </select>

                            <button 
                                onClick={() => setFilters(prev => ({ ...prev, sortBy: prev.sortBy === 'date' ? 'rating' : 'date' }))}
                                className="p-2 bg-bg-surface border border-border-muted rounded-lg hover:border-brand/30 transition-all flex items-center gap-2 group"
                                title={`Sorting by ${filters.sortBy}`}
                            >
                                <ArrowUpDown className="w-4 h-4 text-[#444] group-hover:text-brand transition-colors" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-[#555] group-hover:text-white">
                                    {filters.sortBy}
                                </span>
                            </button>

                            <button 
                                onClick={() => setFilters(prev => ({ ...prev, sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' }))}
                                className="p-2 bg-bg-surface border border-border-muted rounded-lg hover:border-brand/30 transition-all text-[9px] font-black uppercase tracking-widest text-[#555] hover:text-white"
                            >
                                {filters.sortOrder}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="space-y-1">
                            <label className="text-[8px] font-black uppercase tracking-[0.2em] text-[#444] ml-1">From Date</label>
                            <input 
                                type="date"
                                value={filters.dateFrom}
                                onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                                className="w-full bg-bg-surface border border-border-muted rounded-lg p-2.5 text-[9px] font-black uppercase tracking-[0.2em] text-white outline-none focus:border-brand/50 transition-all [color-scheme:dark]"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[8px] font-black uppercase tracking-[0.2em] text-[#444] ml-1">To Date</label>
                            <input 
                                type="date"
                                value={filters.dateTo}
                                onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                                className="w-full bg-bg-surface border border-border-muted rounded-lg p-2.5 text-[9px] font-black uppercase tracking-[0.2em] text-white outline-none focus:border-brand/50 transition-all [color-scheme:dark]"
                            />
                        </div>
                    </div>

                    {(filters.searchPro || filters.serviceType !== 'All' || filters.dateFrom || filters.dateTo) && (
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-[8px] font-black uppercase tracking-widest text-[#444]">Active Filters:</span>
                            <button 
                                onClick={() => setFilters({
                                    searchPro: '',
                                    serviceType: 'All',
                                    dateFrom: '',
                                    dateTo: '',
                                    sortBy: 'date',
                                    sortOrder: 'desc'
                                })}
                                className="flex items-center gap-1.5 px-2.5 py-1 bg-brand/10 border border-brand/20 rounded-full text-[8px] font-black uppercase tracking-widest text-brand hover:bg-brand hover:text-bg-deep transition-all"
                            >
                                <X className="w-2.5 h-2.5" /> Clear All
                            </button>
                        </div>
                    )}

                    <div className="space-y-4">
                        {filteredAndSortedServices.map((s, i) => (
                            <div key={i} className="bg-bg-surface p-6 rounded-xl border border-border-muted shadow-sm flex items-center justify-between hover:border-brand/20 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-bg-deep rounded-lg flex items-center justify-center border border-border-muted">
                                        <History className="w-5 h-5 text-[#444] group-hover:text-brand transition-colors" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm tracking-tight">{s.service}</h4>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#555]">{s.pro} • {s.displayDate}</p>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-end gap-2">
                                    <p className="font-black text-white text-sm font-mono italic">{s.price}</p>
                                    {s.reviewed ? (
                                        <div className="flex items-center gap-1 justify-end mt-1">
                                            {[...Array(5)].map((_, j) => (
                                                <Star key={j} className={`w-2 h-2 ${j < s.rating ? 'text-brand fill-current shadow-brand' : 'text-[#222]'}`} />
                                            ))}
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => setReviewBooking(s)}
                                            className="px-3 py-1 bg-brand/10 text-brand text-[8px] font-black uppercase tracking-[0.2em] rounded-md border border-brand/20 hover:bg-brand hover:text-bg-deep transition-all italic font-serif"
                                        >
                                            Leave Review
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {filteredAndSortedServices.length === 0 && (
                            <div className="py-20 text-center border border-dashed border-border-muted rounded-2xl">
                                <Search className="w-8 h-8 text-[#222] mx-auto mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#444]">No services match your filters</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Sidebar */}
            <div className="space-y-8">
               <div className="bg-bg-sidebar rounded-2xl p-10 text-white relative overflow-hidden group border border-border-muted shadow-2xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-brand/10 transition-all duration-700" />
                  <h3 className="text-xl font-light mb-4 tracking-tight italic font-serif">Refer a <span className="text-brand">Friend</span></h3>
                  <p className="text-[#888] text-xs font-medium leading-relaxed mb-8">
                    Get <span className="text-white font-bold">₦1,000</span> for every friend who completes their first verified booking on BarbMe.
                  </p>
                  <button 
                    onClick={() => {
                        navigator.clipboard.writeText('https://barbme.app/ref/nate27');
                        alert('Referral link copied to clipboard!');
                    }}
                    className="w-full py-4 bg-brand text-bg-deep rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    Share Link <ChevronRight className="w-4 h-4" />
                  </button>
               </div>

               <div className="bg-bg-surface rounded-2xl p-8 border border-border-muted shadow-lg">
                  <h3 className="text-lg font-light text-white tracking-tight mb-8 italic font-serif">Quick <span className="text-brand">Settings</span></h3>
                  <div className="space-y-2">
                     {[
                        { label: 'Saved Professionals', icon: Star, tab: 'saved' as const },
                        { label: 'Privacy & Security', icon: ShieldCheck, tab: 'privacy' as const },
                        { label: 'Payment Methods', icon: Wallet, tab: 'payment' as const },
                        { label: 'Account Details', icon: Settings, tab: 'account' as const },
                        { label: 'Profile Customization', icon: Scissors, tab: 'profile' as const },
                     ].map((item, i) => (
                         <button 
                            key={i} 
                            onClick={() => setSettingsModal({ isOpen: true, initialTab: item.tab })}
                            className="w-full flex items-center justify-between p-4 hover:bg-bg-deep rounded-xl transition-all group border border-transparent hover:border-border-muted"
                         >
                            <div className="flex items-center gap-3">
                                <item.icon className="w-5 h-5 text-[#444] group-hover:text-brand transition-colors" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#555] group-hover:text-[#888] transition-colors">{item.label}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-[#222] group-hover:text-brand transition-colors" />
                         </button>
                     ))}
                  </div>
               </div>
            </div>

        </div>

      </div>
      <AnimatePresence>
        {activeChat && (
          <ChatWindow 
            recipient={activeChat.recipient} 
            bookingId={activeChat.bookingId} 
            onClose={() => setActiveChat(null)} 
          />
        )}
        {reviewBooking && (
          <ReviewModal
            isOpen={!!reviewBooking}
            onClose={() => setReviewBooking(null)}
            booking={reviewBooking}
            onSubmit={handleReviewSubmit}
          />
        )}
        <QuickSettingsModal 
          isOpen={settingsModal.isOpen}
          onClose={() => setSettingsModal(prev => ({ ...prev, isOpen: false }))}
          initialTab={settingsModal.initialTab}
        />
      </AnimatePresence>
    </div>
  );
};
