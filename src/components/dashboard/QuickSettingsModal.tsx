import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  User, 
  ShieldCheck, 
  Wallet, 
  Settings, 
  Star,
  ChevronRight, 
  MapPin, 
  Bell, 
  Moon, 
  Globe,
  LogOut,
  CreditCard,
  Lock,
  Eye,
  Scissors
} from 'lucide-react';
import { useFavorites } from '../../contexts/FavoritesContext';
import { MOCK_BARBERS } from '../../constants/mockData';
import { useAuth } from '../../contexts/AuthContext';

interface QuickSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'account' | 'profile' | 'privacy' | 'payment' | 'saved';
}

export const QuickSettingsModal: React.FC<QuickSettingsModalProps> = ({ 
  isOpen, 
  onClose,
  initialTab = 'account'
}) => {
  const { favoriteIds, toggleFavorite } = useFavorites();
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'account' | 'profile' | 'privacy' | 'payment' | 'saved'>(initialTab);

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const savedPros = MOCK_BARBERS.filter(pro => favoriteIds.includes(pro.id));

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  React.useEffect(() => {
    if (isOpen && user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setLocation(user.location || '');
      setBio(user.bio || '');
    }
  }, [isOpen, user]);

  const handleSaveAll = async () => {
    if (!updateUser) return;
    setIsSaving(true);
    try {
      await updateUser({
        fullName,
        phone,
        location,
        bio
      });
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Failed to save profile changes:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const settingsItems = [
    { id: 'account', label: 'Account Details', icon: User },
    { id: 'profile', label: 'Profile Customization', icon: Scissors },
    { id: 'saved', label: 'Saved Professionals', icon: Star },
    { id: 'privacy', label: 'Privacy & Security', icon: ShieldCheck },
    { id: 'payment', label: 'Payment Methods', icon: Wallet },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-bg-deep/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-bg-surface border border-border-muted rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[600px]"
          >
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-bg-deep/50 border-r border-border-muted p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight uppercase">Settings</h3>
                    <p className="text-[10px] font-black text-[#444] uppercase tracking-widest">Configuration</p>
                  </div>
                </div>

                <nav className="space-y-2">
                  {settingsItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group ${
                        activeTab === item.id 
                          ? 'bg-brand text-bg-deep' 
                          : 'text-[#555] hover:bg-bg-sidebar hover:text-white'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <button className="flex items-center gap-3 p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                <LogOut className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Logout</span>
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col">
              <div className="p-6 border-b border-border-muted flex items-center justify-between">
                <h2 className="text-xl font-light text-white tracking-tight italic font-serif">
                  {settingsItems.find(i => i.id === activeTab)?.label}
                </h2>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-bg-sidebar rounded-lg transition-colors group"
                >
                  <X className="w-5 h-5 text-[#444] group-hover:text-white" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {activeTab === 'account' && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-6 pb-8 border-b border-border-muted">
                        <div className="w-20 h-20 rounded-2xl bg-bg-deep border border-border-muted overflow-hidden relative group">
                            <img src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'User')}&background=c4a47c&color=0d0d0d`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div>
                            <h4 className="text-white font-bold tracking-tight mb-1">{fullName || 'User'}</h4>
                            <p className="text-[10px] font-black text-[#555] uppercase tracking-widest">
                              {user?.role === 'professional' ? 'Professional Account' : 'Client Member'}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-[#444] uppercase tracking-widest ml-1">Full Name</label>
                            <input 
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-bg-deep border border-border-muted rounded-xl p-3 text-[10px] font-black text-white uppercase tracking-widest outline-none focus:border-brand/50 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-[#444] uppercase tracking-widest ml-1">Email Address</label>
                            <input 
                                value={email}
                                disabled
                                className="w-full bg-bg-deep border border-border-muted rounded-xl p-3 text-[10px] font-black text-[#444] uppercase tracking-widest outline-none opacity-60 cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-[#444] uppercase tracking-widest ml-1">Phone Number</label>
                            <input 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-bg-deep border border-border-muted rounded-xl p-3 text-[10px] font-black text-white uppercase tracking-widest outline-none focus:border-brand/50 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-[#444] uppercase tracking-widest ml-1">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand" />
                                <input 
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full bg-bg-deep border border-border-muted rounded-xl pl-10 pr-3 p-3 text-[10px] font-black text-white uppercase tracking-widest outline-none focus:border-brand/50 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                  </div>
                )}

                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-[#444] uppercase tracking-widest ml-1">Profile Biography</label>
                      <textarea 
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={6}
                        required
                        className="w-full bg-bg-deep border border-border-muted rounded-xl p-4 text-[11px] font-medium text-white outline-none focus:border-brand/50 transition-all resize-none leading-relaxed"
                        placeholder={user?.role === 'professional' 
                          ? "Share your styling story, experience level, and hairstyle specialties for client viewers..."
                          : "Enter some details about yourself, hair type, style preferences, or anything that helps professionals serve you better..."
                        }
                      />
                    </div>
                    <div className="p-4 bg-brand/[0.02] border border-brand/10 rounded-xl space-y-1">
                      <h4 className="text-[10px] font-black text-brand uppercase tracking-widest">About Your Bio</h4>
                      <p className="text-[9px] text-[#555] leading-relaxed">
                        Your biography description is displayed publicly on your profile page. Keeping this up-to-date helps others in the BarbMe network know more about you.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'saved' && (
                  <div className="space-y-4">
                    {savedPros.length > 0 ? (
                      savedPros.map((pro, i) => (
                        <div key={pro.id} className="flex items-center justify-between p-4 bg-bg-deep border border-border-muted rounded-2xl group hover:border-brand/30 transition-all">
                          <div className="flex items-center gap-4">
                            <img src={pro.user.avatarUrl} className="w-12 h-12 rounded-xl object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all" referrerPolicy="no-referrer" />
                            <div>
                              <h4 className="text-white font-bold tracking-tight text-sm">{pro.user.fullName}</h4>
                              <p className="text-[10px] font-black text-[#444] uppercase tracking-widest">{pro.categories[0]} Specialist</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                             <div className="mr-4 text-right">
                                <div className="flex items-center gap-1 text-brand mb-1">
                                    <Star className="w-3 h-3 fill-brand" />
                                    <span className="text-[10px] font-mono leading-none">{pro.avgRating}</span>
                                </div>
                                <p className="text-[8px] font-black text-[#333] uppercase tracking-tighter">{pro.totalReviews} REVIEWS</p>
                             </div>
                             <button 
                                onClick={() => toggleFavorite(pro.id)}
                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                             >
                                <X className="w-4 h-4" />
                             </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-20 text-center border-2 border-dashed border-border-muted rounded-3xl">
                        <Star className="w-12 h-12 text-[#222] mx-auto mb-4" />
                        <h4 className="text-sm font-bold text-white tracking-tight italic">No professionals saved yet</h4>
                        <p className="text-[9px] font-black text-[#444] uppercase tracking-widest mt-2 max-w-[200px] mx-auto">Click the heart icon on a profile to save them for quick access.</p>
                      </div>
                    )}
                    <button 
                      onClick={onClose}
                      className="w-full py-4 border border-dashed border-border-muted rounded-2xl text-[10px] font-black text-[#333] uppercase tracking-widest hover:text-white hover:border-brand/20 transition-all"
                    >
                      Find More Professionals
                    </button>
                  </div>
                )}

                {activeTab === 'privacy' && (
                  <div className="space-y-6">
                    <div className="bg-bg-deep p-6 rounded-2xl border border-border-muted space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-brand/10 rounded-lg">
                                    <Bell className="w-4 h-4 text-brand" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white tracking-tight">Push Notifications</h4>
                                    <p className="text-[9px] font-black text-[#444] uppercase tracking-widest mt-1">Bookings, reminders & updates</p>
                                </div>
                            </div>
                            <div className="w-10 h-5 bg-brand rounded-full relative shadow-inner">
                                <div className="absolute right-1 top-1 w-3 h-3 bg-bg-deep rounded-full shadow-lg" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-brand/10 rounded-lg">
                                    <Eye className="w-4 h-4 text-brand" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white tracking-tight">Profile Visibility</h4>
                                    <p className="text-[9px] font-black text-[#444] uppercase tracking-widest mt-1">Show history to professionals</p>
                                </div>
                            </div>
                            <div className="w-10 h-5 bg-[#111] rounded-full relative shadow-inner">
                                <div className="absolute left-1 top-1 w-3 h-3 bg-[#333] rounded-full shadow-lg" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-brand/10 rounded-lg">
                                    <Lock className="w-4 h-4 text-brand" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white tracking-tight">Two-Factor Auth</h4>
                                    <p className="text-[9px] font-black text-[#444] uppercase tracking-widest mt-1">Secure your account with 2FA</p>
                                </div>
                            </div>
                            <button className="text-[8px] font-black text-brand underline underline-offset-4 tracking-widest uppercase">Enable</button>
                        </div>
                    </div>
                  </div>
                )}

                {activeTab === 'payment' && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-bg-sidebar to-bg-deep p-8 rounded-2xl border border-border-muted relative overflow-hidden group">
                        <CreditCard className="absolute -bottom-4 -right-4 w-32 h-32 text-brand/5 rotate-12 group-hover:scale-110 transition-transform duration-700" />
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-12">
                                <span className="text-[10px] font-black text-brand uppercase tracking-widest">Primary Card</span>
                                <div className="w-10 h-6 bg-white/10 rounded-md" />
                            </div>
                            <div className="space-y-4">
                                <p className="text-xl font-light text-white tracking-[0.2em] font-mono italic">**** **** **** 4242</p>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[8px] font-black text-[#444] uppercase tracking-widest mb-1">Card Holder</p>
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest">{fullName ? fullName.toUpperCase() : 'MEMBER'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[8px] font-black text-[#444] uppercase tracking-widest mb-1">Expires</p>
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest">12/26</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button className="w-full py-4 bg-bg-deep border border-dashed border-border-muted rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black text-[#444] uppercase tracking-widest hover:border-brand/50 hover:text-white transition-all group">
                        <Plus className="w-4 h-4 group-hover:text-brand" /> Add New Payment Method
                    </button>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-border-muted bg-bg-deep flex items-center justify-between gap-4">
                 {saveSuccess && (
                   <span className="text-[10px] font-black uppercase tracking-widest text-[#d9f99d] italic animate-pulse">
                     Changes saved successfully!
                   </span>
                 )}
                 <div className="flex gap-4 ml-auto">
                   <button 
                    onClick={onClose}
                    disabled={isSaving}
                    className="px-6 py-3 border border-border-muted rounded-xl text-[10px] font-black text-[#555] uppercase tracking-widest hover:text-white transition-colors disabled:opacity-50"
                   >
                     Cancel
                   </button>
                   <button 
                    onClick={handleSaveAll}
                    disabled={isSaving}
                    className="px-8 py-3 bg-brand text-bg-deep rounded-xl text-[10px] font-black text-bg-deep uppercase tracking-widest shadow-xl shadow-brand/10 hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
                   >
                     {isSaving ? 'Saving...' : 'Save Changes'}
                   </button>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Plus = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5v14"/>
  </svg>
);
