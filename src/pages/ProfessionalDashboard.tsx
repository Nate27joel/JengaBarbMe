import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Calendar, 
  DollarSign, 
  Clock, 
  User, 
  Settings, 
  Power, 
  ChevronRight,
  TrendingUp,
  MoreVertical,
  Scissors,
  ShieldAlert,
  Info,
  MessageSquare,
  ChevronDown,
  Plus,
  Trash2,
  ChevronUp,
  Star as StarIcon,
  ShieldCheck,
  Zap,
  Check
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChatWindow } from '../components/chat/ChatWindow';
import { ServiceDetailsModal } from '../components/service/ServiceDetailsModal';
import { EarningsBreakdownModal } from '../components/professional/EarningsBreakdownModal';
import { BookingsSummaryModal } from '../components/professional/BookingsSummaryModal';
import { QuickSettingsModal } from '../components/dashboard/QuickSettingsModal';
import { User as UserType, Availability, DayAvailability, Professional, Service } from '../types';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { RequestPayoutModal } from '../components/professional/RequestPayoutModal';

const EARNINGS_DATA = [
  { day: 'Mon', amount: 12000 },
  { day: 'Tue', amount: 18000 },
  { day: 'Wed', amount: 15000 },
  { day: 'Thu', amount: 25000 },
  { day: 'Fri', amount: 32000 },
  { day: 'Sat', amount: 45000 },
  { day: 'Sun', amount: 38000 },
];

export const ProfessionalDashboard = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [isOnline, setIsOnline] = useState(true);
  const [showRequestPayout, setShowRequestPayout] = useState(false);
  const [payoutsList, setPayoutsList] = useState<any[]>([]);
  const [availableBalance, setAvailableBalance] = useState<number>(45000);

  // Load payouts list from Firestore securely under verified user check
  useEffect(() => {
    if (!user?.id) return;
    
    const payoutsPath = 'payouts';
    const q = query(
      collection(db, payoutsPath),
      where('professionalId', '==', user.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loaded: any[] = [];
      snapshot.forEach((doc) => {
        loaded.push(doc.data());
      });
      // Sort by status or createdAt
      loaded.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      setPayoutsList(loaded);

      // Deduct pending or processed payouts from availableBalance to make it dynamic and real-time!
      const totalPaidOut = loaded
        .filter(p => p.status === 'pending' || p.status === 'processed' || p.status === 'approved')
        .reduce((sum, p) => sum + (p.amount || 0), 0);
      
      setAvailableBalance(Math.max(0, 45000 - totalPaidOut));
    }, (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, payoutsPath);
      } catch (err) {
        console.warn("Failed to listen to payouts:", err);
      }
    });

    return () => unsubscribe();
  }, [user?.id]);
  const [activeChat, setActiveChat] = useState<{ recipient: UserType; bookingId: string } | null>(null);
  const [availability, setAvailability] = useState<Availability>({
    monday: { day: 'Monday', isOpen: true, slots: [{ start: '09:00', end: '18:00' }] },
    tuesday: { day: 'Tuesday', isOpen: true, slots: [{ start: '09:00', end: '18:00' }] },
    wednesday: { day: 'Wednesday', isOpen: true, slots: [{ start: '09:00', end: '18:00' }] },
    thursday: { day: 'Thursday', isOpen: true, slots: [{ start: '09:00', end: '18:00' }] },
    friday: { day: 'Friday', isOpen: true, slots: [{ start: '09:00', end: '18:00' }] },
    saturday: { day: 'Saturday', isOpen: true, slots: [{ start: '10:00', end: '16:00' }] },
    sunday: { day: 'Sunday', isOpen: false, slots: [] },
  });

  const toggleDay = (day: string) => {
    setAvailability(prev => ({
      ...prev,
      [day.toLowerCase()]: {
        ...prev[day.toLowerCase()],
        isOpen: !prev[day.toLowerCase()].isOpen,
        slots: prev[day.toLowerCase()].isOpen ? [] : [{ start: '09:00', end: '18:00' }]
      }
    }));
  };

  const updateSlot = (day: string, index: number, field: 'start' | 'end', value: string) => {
    setAvailability(prev => {
      const dayKey = day.toLowerCase();
      const newSlots = [...prev[dayKey].slots];
      newSlots[index] = { ...newSlots[index], [field]: value };
      return {
        ...prev,
        [dayKey]: { ...prev[dayKey], slots: newSlots }
      };
    });
  };

  const addSlot = (day: string) => {
    setAvailability(prev => {
      const dayKey = day.toLowerCase();
      return {
        ...prev,
        [dayKey]: {
          ...prev[dayKey],
          slots: [...prev[dayKey].slots, { start: '09:00', end: '18:00' }]
        }
      };
    });
  };

  const removeSlot = (day: string, index: number) => {
    setAvailability(prev => {
      const dayKey = day.toLowerCase();
      return {
        ...prev,
        [dayKey]: {
          ...prev[dayKey],
          slots: prev[dayKey].slots.filter((_, i) => i !== index)
        }
      };
    });
  };

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Profile management states
  const [settingsTab, setSettingsTab] = useState<'hours' | 'profile'>('hours');
  const [profileName, setProfileName] = useState('Boluwatife Adeyemi');
  const [profilePhone, setProfilePhone] = useState('08012345678');
  const [profileBio, setProfileBio] = useState('Specialist in low fades and traditional Nigerian hairstyles.');
  const [profileExperience, setProfileExperience] = useState<number>(5);
  const [profileCategories, setProfileCategories] = useState<string[]>(['Haircuts', 'Beards & Shaving']);
  const [profileServiceMode, setProfileServiceMode] = useState<'both' | 'home' | 'shop'>('both');
  const [profileAvatar, setProfileAvatar] = useState('https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=100');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      await updateUser({
        fullName: profileName,
        phone: profilePhone,
        avatarUrl: profileAvatar,
        categories: profileCategories,
        travelPreference: profileServiceMode,
        bio: profileBio
      });
      setProfileSaveSuccess(true);
      setTimeout(() => setProfileSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save profile customizations:", err);
    } finally {
      setProfileSaving(false);
    }
  };

  const mockProUser: UserType = {
    id: user?.id || 'u1',
    fullName: profileName,
    email: user?.email || 'bolu@example.com',
    phone: profilePhone,
    role: 'professional',
    isVerified: true,
    verificationStatus: 'verified',
    createdAt: new Date(),
    updatedAt: new Date(),
    avatarUrl: profileAvatar
  };

  const mockProfessional: Professional & { user: UserType } = {
    id: '1',
    userId: user?.id || 'u1',
    bio: profileBio,
    categories: profileCategories,
    yearsExperience: profileExperience,
    serviceMode: profileServiceMode === 'both' ? 'both' : (profileServiceMode === 'home' ? 'home_visit' : 'shop'),
    latitude: 6.5244,
    longitude: 3.3792,
    avgRating: 4.9,
    totalReviews: 124,
    isAvailable: true,
    user: mockProUser
  };

  const [myServices, setMyServices] = useState<Service[]>([
    { id: 's1', professionalId: '1', category: 'mens_hair', name: 'Premium Fade', description: 'Experience the ultimate precision with our signature fade. Includes hot towel finish and line up.', price: 5500, durationMinutes: 45, isActive: true },
    { id: 's2', professionalId: '1', category: 'grooming', name: 'Beard Sculpture', description: 'Complete beard shaping, trimming, and conditioning with premium oils.', price: 3500, durationMinutes: 30, isActive: true },
    { id: 's3', professionalId: '1', category: 'mens_hair', name: 'Kids Haircut', description: 'Gentle and stylish haircuts for kids under 12.', price: 4000, durationMinutes: 30, isActive: true },
  ]);

  useEffect(() => {
    if (user && user.role === 'professional') {
      setProfileName(user.fullName || 'Stylist');
      setProfilePhone(user.phone || '');
      setProfileAvatar(user.avatarUrl || 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=100');
      if (user.bio) {
        setProfileBio(user.bio);
      }
      if (user.categories && user.categories.length > 0) {
        setProfileCategories(user.categories);
      }
      if (user.travelPreference) {
        setProfileServiceMode(user.travelPreference as any);
      }
      if (user.proServices && user.proServices.length > 0) {
        const formattedServices = user.proServices.map((s: any, idx: number) => ({
          id: s.id || `s-${idx}`,
          professionalId: '1',
          category: 'mens_hair' as const,
          name: s.name,
          description: s.description || 'Professional customized haircut setup services provided by verified stylist.',
          price: typeof s.price === 'string' ? parseFloat(s.price.replace(/\D/g, '')) : s.price,
          durationMinutes: typeof s.duration === 'string' ? parseInt(s.duration) || 45 : s.duration || 45,
          isActive: true
        }));
        setMyServices(formattedServices);
      }
    }
  }, [user]);

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showEarningsBreakdown, setShowEarningsBreakdown] = useState(false);
  const [showBookingsSummary, setShowBookingsSummary] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleSaveAvailability = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const stats = [
    { label: 'Weekly Earnings', value: `₦${availableBalance.toLocaleString()}`, change: '+12%', icon: DollarSign, color: 'blue' },
    { label: 'Total Bookings', value: '28', change: '+5', icon: Scissors, color: 'purple' },
    { label: 'Avg. Rating', value: '4.9', change: '★', icon: TrendingUp, color: 'green' },
  ];

  const todayBookings = [
    { id: 'b1', time: '10:00 AM', clientId: 'u11', client: 'Adesola Bello', clientAvatar: 'https://images.unsplash.com/photo-1544717297-fa154daaf544?q=80&w=100', service: 'Fade + Beard Trim', status: 'In Progress', price: '₦5,500' },
    { id: 'b2', time: '01:30 PM', clientId: 'u12', client: 'Chidi Nwosu', clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100', service: 'Traditional Braids', status: 'Confirmed', price: '₦12,000' },
    { id: 'b3', time: '04:00 PM', clientId: 'u13', client: 'Tunde Raji', clientAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100', service: 'Hair Coloring', status: 'Confirmed', price: '₦8,500' },
  ];

  const handleOpenChat = (booking: any) => {
    setActiveChat({
      recipient: {
        id: booking.clientId,
        fullName: booking.client,
        avatarUrl: booking.clientAvatar,
        email: '',
        phone: '',
        role: 'client',
        isVerified: true,
        verificationStatus: 'verified',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      bookingId: booking.id
    });
  };

  return (
    <div className="pt-20 min-h-screen bg-bg-deep">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-bg-surface border border-border-muted shadow-2xl relative group">
                <img src={profileAvatar} className="grayscale-[0.1] object-cover w-full h-full" referrerPolicy="no-referrer" />
              </div>
              <div>
                <h1 className="text-3xl font-light text-white tracking-tight">Morning, <span className="text-brand italic font-serif">{profileName.split(' ')[0]}</span></h1>
                <div className="flex flex-wrap items-center gap-3 mt-1.5">
                  <p className="text-[10px] text-[#555] font-black uppercase tracking-[0.2em]">
                    Lagos Island • {profileExperience} Years Exp • {profileServiceMode === 'both' ? 'Hybrid (Home + Shop)' : profileServiceMode === 'home' ? 'House Calls' : 'Shop/Studio'}
                  </p>
                  <span id="pro-user-id-badge" className="text-[9px] font-mono text-brand/60 px-2 py-0.5 bg-brand/5 border border-brand/10 rounded-md">
                    ID: {user?.id || 'u1_pro'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-bg-sidebar px-5 py-2.5 rounded-xl border border-border-muted shadow-sm">
              <span className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)] ${isOnline ? 'bg-green-500' : 'bg-[#333]'}`} />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#888]">{isOnline ? 'Online' : 'Offline'}</span>
              <button 
                onClick={() => setIsOnline(!isOnline)}
                className={`relative w-12 h-6 rounded-full transition-all duration-500 ${isOnline ? 'bg-brand' : 'bg-bg-deep'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-500 ${isOnline ? 'left-7 bg-white shadow-lg' : 'left-1 bg-[#444]'}`} />
              </button>
            </div>
            <button 
              onClick={() => setShowSettings(true)}
              className="p-3 bg-bg-surface border border-border-muted rounded-xl shadow-sm hover:border-brand/30 transition-colors"
            >
              <Settings className="w-5 h-5 text-[#555]" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileActive={{ scale: 0.98 }}
              onClick={() => {
                if (stat.label === 'Weekly Earnings') setShowEarningsBreakdown(true);
                if (stat.label === 'Total Bookings') setShowBookingsSummary(true);
              }}
              className="bg-bg-surface p-8 rounded-2xl border border-border-muted shadow-sm group hover:border-brand/20 transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-brand/5 border border-brand/10 rounded-xl group-hover:bg-brand/10 transition-all">
                    <stat.icon className="w-6 h-6 text-brand" />
                </div>
                <span className="text-[10px] font-black tracking-widest px-2 py-1 bg-brand/10 text-brand rounded shadow-sm">
                  {stat.change}
                </span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-[#555] uppercase tracking-widest mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-light text-white font-mono italic">{stat.value}</h3>
                </div>
                {stat.label === 'Weekly Earnings' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowRequestPayout(true);
                    }}
                    className="ml-auto px-4 py-2 border border-brand/20 bg-brand/5 text-brand rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-brand hover:text-bg-deep transition-all shadow-md shadow-brand/10"
                  >
                    Request Payout
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Revenue Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-bg-surface p-8 rounded-2xl border border-border-muted shadow-sm mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-light text-white tracking-tight italic font-serif">Revenue <span className="text-brand">Overview</span></h3>
              <p className="text-[9px] text-[#555] font-black uppercase tracking-widest mt-1">Net earnings over the last 7 days</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-deep rounded-lg border border-border-muted">
                <div className="w-2 h-2 rounded-full bg-brand" />
                <span className="text-[9px] font-black text-white uppercase tracking-widest">Earnings</span>
              </div>
            </div>
          </div>
          
          <div className="h-[300px] w-full font-mono text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={EARNINGS_DATA}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d9f99d" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#d9f99d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1a1a1a" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#444' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#444' }}
                  tickFormatter={(val) => `₦${val/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0a0a0a', 
                    border: '1px solid #1a1a1a',
                    borderRadius: '12px',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                  }}
                  itemStyle={{ color: '#d9f99d' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#d9f99d" 
                  fillOpacity={1} 
                  fill="url(#colorAmt)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Today's Schedule & Availability */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Today's Schedule */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-light text-white tracking-tight italic font-serif">Today's <span className="text-brand">Schedule</span></h2>
                <button className="text-[10px] font-black uppercase tracking-widest text-brand hover:underline underline-offset-4">View Calendar</button>
              </div>

              <div className="space-y-4">
                {todayBookings.map((booking, idx) => (
                  <div key={idx} className="group bg-bg-surface p-6 rounded-xl border border-border-muted shadow-sm hover:border-brand/30 transition-all flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="text-center min-w-[80px]">
                        <p className="text-sm font-black text-white">{booking.time.split(' ')[0]}</p>
                        <p className="text-[10px] font-black text-[#555] uppercase tracking-[0.2em]">{booking.time.split(' ')[1]}</p>
                      </div>
                      <div className="h-10 w-[1px] bg-border-muted" />
                      <div>
                        <h4 className="font-bold text-white mb-0.5 group-hover:text-brand transition-colors tracking-tight">{booking.client}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-[#555] uppercase font-black tracking-widest">
                          <Scissors className="w-3" />
                          <span>{booking.service}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-8">
                      <div className="hidden sm:block text-right">
                         <p className="font-black text-white font-mono italic text-sm">{booking.price}</p>
                         <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${booking.status === 'In Progress' ? 'bg-brand/10 text-brand px-2 border border-brand/20' : 'bg-bg-deep text-[#444] border border-border-muted'}`}>
                          {booking.status}
                         </span>
                      </div>
                      <div className="flex items-center gap-2">
                          <button 
                              onClick={() => handleOpenChat(booking)}
                              className="p-2.5 bg-bg-deep text-[#888] hover:text-brand border border-border-muted rounded-lg transition-colors group/msg"
                          >
                              <MessageSquare className="w-4 h-4 group-hover/msg:scale-110 transition-transform" />
                          </button>
                          <button className="p-2 text-[#444] hover:text-brand transition-colors">
                              <MoreVertical className="w-5" />
                          </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* My Services Quick View */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-light text-white tracking-tight italic font-serif">Service <span className="text-brand">Portfolio</span></h2>
                  <p className="text-[9px] text-[#555] font-black uppercase tracking-widest mt-1">Quick look at your active offerings</p>
                </div>
                <button 
                  onClick={() => navigate('/pro/services')}
                  className="flex items-center gap-2 px-6 py-3 bg-bg-surface border border-border-muted rounded-xl text-[10px] font-black text-[#555] uppercase tracking-widest hover:text-white hover:border-brand/30 transition-all group"
                >
                  Manage All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {myServices.slice(0, 3).map((service) => (
                  <div 
                    key={service.id} 
                    onClick={() => setSelectedService(service)}
                    className="bg-bg-surface p-6 rounded-2xl border border-border-muted hover:border-brand/30 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2.5 bg-bg-deep rounded-xl border border-border-muted group-hover:border-brand/20 transition-all">
                        <Scissors className="w-5 h-5 text-brand" />
                      </div>
                      <span className="font-mono text-sm font-black text-white italic">₦{service.price.toLocaleString()}</span>
                    </div>
                    <h4 className="text-white font-bold tracking-tight mb-2 group-hover:text-brand transition-colors truncate">{service.name}</h4>
                    <p className="text-[#555] text-[10px] uppercase font-black tracking-widest">{service.durationMinutes}m duration</p>
                  </div>
                ))}
                {myServices.length > 3 && (
                   <button 
                    onClick={() => navigate('/pro/services')}
                    className="bg-bg-deep/30 border border-dashed border-border-muted rounded-2xl flex flex-col items-center justify-center p-6 hover:border-brand/50 transition-all group gap-2"
                   >
                      <Plus className="w-6 h-6 text-[#222] group-hover:text-brand transition-all" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#444] group-hover:text-white">View {myServices.length - 3} more</span>
                   </button>
                )}
              </div>
            </div>
              {/* Boutique Operating Details and Profile Settings Control Center */}
            <motion.div
              id="operating-settings-panel"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-bg-surface p-8 rounded-2xl border border-border-muted shadow-sm scroll-mt-24"
            >
              {/* Tab Header System */}
              <div className="flex border-b border-white/[0.04] mb-8 pb-px">
                <button
                  type="button"
                  onClick={() => setSettingsTab('hours')}
                  className={`pb-4 px-4 text-xs font-black uppercase tracking-widest transition-all relative ${
                    settingsTab === 'hours' ? 'text-brand' : 'text-[#555] hover:text-[#888]'
                  }`}
                >
                  Working Hours
                  {settingsTab === 'hours' && (
                    <motion.div 
                      layoutId="settingsActiveTabLine" 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand"
                    />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setSettingsTab('profile')}
                  className={`pb-4 px-4 text-xs font-black uppercase tracking-widest transition-all relative ${
                    settingsTab === 'profile' ? 'text-brand' : 'text-[#555] hover:text-[#888]'
                  }`}
                >
                  Profile Customization
                  {settingsTab === 'profile' && (
                    <motion.div 
                      layoutId="settingsActiveTabLine" 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand"
                    />
                  )}
                </button>
              </div>

              {settingsTab === 'profile' ? (
                /* Profile Settings Form Tab */
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex items-center gap-6 pb-6 border-b border-white/[0.04]">
                    <div className="relative group shrink-0">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-bg-deep border border-white/[0.08] relative">
                        <img 
                          src={profileAvatar} 
                          className="w-full h-full object-cover grayscale-[0.2]" 
                          referrerPolicy="no-referrer"
                        />
                        <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[9px] text-[#ccc] font-black uppercase tracking-widest cursor-pointer transition-opacity">
                          Upload
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleAvatarChange} 
                            className="hidden" 
                          />
                        </label>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white text-xs font-bold leading-none mb-1.5">Boutique & Bio Photo</h4>
                      <p className="text-[9px] text-[#555] uppercase tracking-widest leading-loose">
                        Hover/tap on the avatar preview to select a custom file image.
                      </p>
                    </div>
                  </div>

                  {/* Core Details Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Professional Name */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-[#555] uppercase tracking-[0.2em] ml-1">Professional / Salon Name</label>
                      <input 
                        type="text"
                        required
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full px-4 py-3 bg-bg-deep border border-white/[0.05] focus:border-brand rounded-xl transition-all outline-none text-white text-xs font-medium" 
                        placeholder="e.g. Boluwatife Adeyemi"
                      />
                    </div>

                    {/* WhatsApp Phone */}
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-[#555] uppercase tracking-[0.2em] ml-1">WhatsApp / Phone Number</label>
                       <input 
                        type="text"
                        required
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="w-full px-4 py-3 bg-bg-deep border border-white/[0.05] focus:border-brand rounded-xl transition-all outline-none text-white text-xs font-medium" 
                        placeholder="e.g. +234 801 234 5678"
                      />
                    </div>

                    {/* Years of Experience select trigger */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-[#555] uppercase tracking-[0.2em] ml-1">Years of Experience</label>
                      <select
                        value={profileExperience}
                        onChange={(e) => setProfileExperience(Number(e.target.value))}
                        className="w-full px-4 py-3 bg-bg-deep border border-white/[0.05] focus:border-brand rounded-xl outline-none text-[#888] text-xs font-medium"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map(y => (
                          <option key={y} value={y}>{y} Year{y > 1 ? 's' : ''} Experience</option>
                        ))}
                      </select>
                    </div>

                    {/* Delivery / Service delivery preference */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-[#555] uppercase tracking-[0.2em] ml-1">Service Delivery Options</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'shop', label: 'Shop/Salon' },
                          { id: 'home', label: 'House Calls' },
                          { id: 'both', label: 'Hybrid/Both' },
                        ].map(opt => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setProfileServiceMode(opt.id as any)}
                            className={`py-3 px-1 border rounded-xl text-center text-[9px] font-black uppercase tracking-widest transition-all ${
                              profileServiceMode === opt.id 
                                ? 'border-brand bg-brand/10 text-brand shadow-[0_0_8px_rgba(196,164,124,0.1)]' 
                                : 'border-white/[0.05] bg-bg-deep hover:border-white/10 text-[#555]'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bio Description Area */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#555] uppercase tracking-[0.2em] ml-1">Professional Biography</label>
                    <textarea 
                      required
                      rows={3}
                      value={profileBio}
                      onChange={(e) => setProfileBio(e.target.value)}
                      className="w-full px-4 py-3 bg-bg-deep border border-white/[0.05] focus:border-brand rounded-xl transition-all outline-none text-white text-xs font-medium resize-none leading-relaxed" 
                      placeholder="Share your style details and specialty styling with client viewers..."
                    />
                  </div>

                  {/* Service Categories selections */}
                  <div className="space-y-2.5">
                    <label className="text-[9px] font-black text-[#555] uppercase tracking-[0.2em] ml-1 block">Active Specialty Layout Categories</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {[
                        { id: 'Haircuts', label: 'Classic Haircuts' },
                        { id: 'Beards & Shaving', label: 'Beards & Shaving' },
                        { id: 'Locs & Dreadlocks', label: 'Locs & Dreadlocks' },
                        { id: 'Braiding & Weaving', label: 'Braids & Weaves' },
                        { id: 'Hair Coloring', label: 'Hair Coloring' },
                        { id: 'Nail Grooming', label: 'Nail Grooming' },
                      ].map(cat => {
                        const isSelected = profileCategories.includes(cat.id);
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setProfileCategories(profileCategories.filter(c => c !== cat.id));
                              } else {
                                setProfileCategories([...profileCategories, cat.id]);
                              }
                            }}
                            className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                              isSelected 
                                ? 'border-brand bg-brand/[0.02] text-brand shadow-[0_0_12px_rgba(196,164,124,0.03)]' 
                                : 'border-white/[0.04] bg-[#0c0c0f] text-[#555] hover:border-white/10'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                              isSelected ? 'border-brand bg-brand text-bg-deep' : 'border-white/20'
                            }`}>
                              {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                            <span className="text-[10px] font-bold tracking-tight">{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Profile Edit Actions Row */}
                  <div className="pt-6 border-t border-white/[0.04] flex justify-end items-center gap-4">
                    {profileSaveSuccess && (
                      <motion.span 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-[10px] font-black uppercase tracking-widest text-[#d9f99d] italic"
                      >
                        Profile updated successfully!
                      </motion.span>
                    )}
                    <button 
                      type="submit"
                      disabled={profileSaving || profileCategories.length === 0}
                      className="px-8 py-4 bg-brand text-bg-deep rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand/10 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {profileSaving ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                          <Clock className="w-4 h-4" />
                        </motion.div>
                      ) : 'Save Profile Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                /* Availability Scheduler Tab Content */
                <>
                  <div className="flex items-center justify-between mb-10">
                    <div>
                      <h2 className="text-xl font-light text-white tracking-tight italic font-serif">Working <span className="text-brand">Hours</span></h2>
                      <p className="text-[9px] text-[#555] font-black uppercase tracking-widest mt-1">Manage your weekly schedule</p>
                    </div>
                    <div className="p-3 bg-brand/5 border border-brand/10 rounded-xl">
                      <Clock className="w-5 h-5 text-brand" />
                    </div>
                  </div>

                  <div className="space-y-6">
                    {(Object.entries(availability) as [string, DayAvailability][]).map(([key, dayData]) => (
                      <div key={key} className="flex flex-col md:flex-row md:items-start gap-4 pb-6 border-b border-border-muted last:border-0">
                        <div className="w-32 flex items-center gap-3">
                          <button 
                            type="button"
                            onClick={() => toggleDay(dayData.day)}
                            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${dayData.isOpen ? 'bg-brand/10 border-brand/40 text-brand' : 'bg-bg-deep border-border-muted text-[#444]'}`}
                          >
                            <Power className="w-4 h-4" />
                          </button>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${dayData.isOpen ? 'text-white' : 'text-[#444]'}`}>
                            {dayData.day.substring(0, 3)}
                          </span>
                        </div>

                        <div className="flex-1 space-y-3">
                          {dayData.isOpen ? (
                            <div className="space-y-3">
                              {dayData.slots.map((slot, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                  <div className="flex items-center gap-2 bg-bg-deep border border-border-muted rounded-xl p-3">
                                    <input 
                                      type="time" 
                                      value={slot.start}
                                      onChange={(e) => updateSlot(dayData.day, idx, 'start', e.target.value)}
                                      className="bg-transparent text-white font-mono text-[10px] outline-none [color-scheme:dark]"
                                    />
                                    <span className="text-[#444] text-[10px]">—</span>
                                    <input 
                                      type="time" 
                                      value={slot.end}
                                      onChange={(e) => updateSlot(dayData.day, idx, 'end', e.target.value)}
                                      className="bg-transparent text-white font-mono text-[10px] outline-none [color-scheme:dark]"
                                    />
                                  </div>
                                  {idx > 0 && (
                                    <button 
                                      type="button"
                                      onClick={() => removeSlot(dayData.day, idx)}
                                      className="p-3 text-red-500/50 hover:text-red-500 transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              ))}
                              <button 
                                type="button"
                                onClick={() => addSlot(dayData.day)}
                                className="flex items-center gap-2 text-[9px] font-black text-brand uppercase tracking-widest hover:bg-brand/10 px-4 py-2 rounded-lg transition-all border border-dashed border-brand/30"
                              >
                                <Plus className="w-3 h-3" /> Add Time Slot
                              </button>
                            </div>
                          ) : (
                            <div className="h-10 flex items-center">
                              <span className="text-[10px] font-black text-[#333] uppercase tracking-widest italic">Closed for business</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 pt-8 border-t border-border-muted flex justify-end items-center gap-4">
                    {saveSuccess && (
                      <motion.span 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-[10px] font-black uppercase tracking-widest text-green-500 italic"
                      >
                        Settings updated successfully
                      </motion.span>
                    )}
                    <button 
                      type="button"
                      onClick={handleSaveAvailability}
                      disabled={isSaving}
                      className="px-8 py-4 bg-brand text-bg-deep rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand/10 hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSaving ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                          <Clock className="w-4 h-4" />
                        </motion.div>
                      ) : 'Save Availability'}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>

          {/* Quick Actions / Activity */}
          <div className="space-y-8">
             <div>
                <h2 className="text-xl font-light text-white tracking-tight mb-8 italic font-serif">Quick <span className="text-brand">Actions</span></h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Add Service', icon: Scissors, url: '/pro/services' },
                    { label: 'Payout', icon: DollarSign, url: null },
                    { label: 'Edit Profile', icon: User, tab: 'profile' },
                    { label: 'Schedule', icon: Calendar, tab: 'hours' },
                  ].map((action, i) => (
                    <button 
                      key={i} 
                      onClick={() => {
                        if (action.url) {
                          navigate(action.url);
                        } else if (action.tab) {
                          setSettingsTab(action.tab as any);
                          const el = document.getElementById('operating-settings-panel');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        } else if (action.label === 'Payout') {
                          setShowRequestPayout(true);
                        }
                      }}
                      className="flex flex-col items-center justify-center p-6 bg-brand text-bg-deep rounded-xl shadow-lg shadow-brand/5 hover:opacity-90 transition-all active:scale-95 group text-center"
                    >
                      <action.icon className="w-6 h-6 mb-3 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-black uppercase tracking-widest leading-none">{action.label}</span>
                    </button>
                  ))}
                </div>
             </div>

             {/* Payout History / Requests List */}
             <div className="bg-bg-surface p-8 rounded-2xl border border-border-muted shadow-sm">
                <div className="flex items-center justify-between mb-6">
                   <div>
                     <h3 className="text-lg font-light text-white tracking-tight italic font-serif">Payout <span className="text-brand">History</span></h3>
                     <p className="text-[8px] text-[#555] font-black uppercase tracking-widest mt-1">Status of your funds transfers</p>
                   </div>
                   <div className="p-2.5 bg-brand/5 border border-brand/10 rounded-xl">
                     <DollarSign className="w-5 h-5 text-brand" />
                   </div>
                </div>

                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                   {payoutsList.length === 0 ? (
                     <div className="text-center py-8 bg-bg-deep rounded-xl border border-dashed border-border-muted">
                       <p className="text-[9px] text-[#444] font-black uppercase tracking-widest">No requested payouts yet</p>
                     </div>
                   ) : (
                     payoutsList.map((p, idx) => (
                       <div key={p.id || idx} className="p-4 bg-bg-deep border border-border-muted rounded-xl flex items-center justify-between">
                         <div>
                           <p className="text-xs font-bold text-white tracking-tight">₦{p.amount.toLocaleString()}</p>
                           <p className="text-[8px] text-[#444] font-black uppercase tracking-widest mt-1">{p.bankName} • {p.accountNumber}</p>
                         </div>
                         <div className="text-right">
                           <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${
                             p.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                             p.status === 'processed' ? 'bg-green-500/10 text-brand' :
                             p.status === 'approved' ? 'bg-blue-500/10 text-blue-400' :
                             'bg-red-500/10 text-red-400'
                           }`}>
                             {p.status}
                           </span>
                           <p className="text-[7px] text-[#333] font-mono mt-1">SECURED</p>
                         </div>
                       </div>
                     ))
                   )}
                </div>
             </div>

             <div className="bg-[#050505] p-8 rounded-2xl text-white overflow-hidden relative group border border-border-muted">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-brand/10 transition-colors" />
                <h3 className="text-lg font-bold mb-2 tracking-tight italic font-serif">BarbMe <span className="text-brand">Pro Tip</span></h3>
                <p className="text-[#888] text-xs font-medium leading-relaxed mb-6">
                  Keep your availability updated to rank higher in client searches. Browsing starts early in Nigeria!
                </p>
                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand hover:underline underline-offset-4 transition-colors">
                  Learn More <ChevronRight className="w-4 h-4" />
                </button>
             </div>

             <div className="bg-bg-surface p-8 rounded-2xl border border-border-muted shadow-sm relative overflow-hidden group">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-brand/5 rounded-lg border border-brand/10">
                    <ShieldAlert className="w-5 h-5 text-brand" />
                  </div>
                  <h3 className="text-lg font-light text-white tracking-tight italic font-serif">Cancellation <span className="text-brand">Policy</span></h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest border-b border-border-muted pb-3">
                    <span className="text-[#555]">Grace Period</span>
                    <span className="text-white">2 Hours</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest border-b border-border-muted pb-3">
                    <span className="text-[#555]">Cancellation Fee</span>
                    <span className="text-brand">50% OF COST</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest border-b border-border-muted pb-3">
                    <span className="text-[#555]">Late Arrival</span>
                    <span className="text-white">15 Minutes</span>
                  </div>
                </div>

                <p className="text-[9px] text-[#444] font-medium leading-relaxed mt-6 mb-6">
                  Strict enforcement helps maintain a fair marketplace. Clients will see this policy during the booking flow.
                </p>

                <button className="w-full py-4 border border-brand/20 bg-brand/5 text-brand rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand hover:text-bg-deep transition-all">
                  Update Policy
                </button>
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
        {selectedService && (
          <ServiceDetailsModal
            isOpen={!!selectedService}
            onClose={() => setSelectedService(null)}
            service={selectedService}
            pro={mockProfessional}
            onBook={() => setSelectedService(null)}
          />
        )}
        {showEarningsBreakdown && (
          <EarningsBreakdownModal
            isOpen={showEarningsBreakdown}
            onClose={() => setShowEarningsBreakdown(false)}
            totalEarnings="₦45,000"
          />
        )}
        {showBookingsSummary && (
          <BookingsSummaryModal
            isOpen={showBookingsSummary}
            onClose={() => setShowBookingsSummary(false)}
          />
        )}
        <QuickSettingsModal 
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          initialTab="account"
        />
        {showRequestPayout && (
          <RequestPayoutModal
            isOpen={showRequestPayout}
            onClose={() => setShowRequestPayout(false)}
            user={user}
            availableBalance={availableBalance}
            onSuccess={() => {}}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
