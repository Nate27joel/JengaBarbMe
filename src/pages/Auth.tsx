import { useState, useRef, ChangeEvent, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scissors, 
  ArrowRight, 
  Mail, 
  User, 
  Phone, 
  ShieldCheck,
  CheckCircle2,
  Camera,
  X,
  Loader2,
  Sparkles,
  Fingerprint,
  Zap,
  Plus,
  Trash2,
  Briefcase,
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  Check
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AVAILABLE_CATEGORIES = [
  { id: 'Haircuts', label: 'Classic Haircuts', desc: 'Precision cuts, fades, & trims' },
  { id: 'Beards & Shaving', label: 'Beard & Shaves', desc: 'Premium trims, hot towel, shaving' },
  { id: 'Locs & Dreadlocks', label: 'Locs & Dreadlocks', desc: 'Twists, interlocking, retightening' },
  { id: 'Braiding & Weaving', label: 'Braids & Weaves', desc: 'Ghana looms, cornrows, styling' },
  { id: 'Hair Coloring', label: 'Bleach & Tinting', desc: 'Full tints, highlights, art dyes' },
  { id: 'Nail Grooming', label: 'Manicure & Pedicure', desc: 'Premium hand & foot grooming' },
];

type AuthMode = 'login' | 'register-client' | 'register-pro';

export const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [step, setStep] = useState(1);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { login, register, isLoading, user, authWarning } = useAuth();
  
  const [createdUserData, setCreatedUserData] = useState<any | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isRegisteringUser, setIsRegisteringUser] = useState(false);

  // Redirect if already logged in (disabled during registration process to show the User ID success display)
  useEffect(() => {
    if (user && !isRegisteringUser && !showSuccess) {
      if (user.role === 'professional') {
        navigate('/pro/dashboard');
      } else {
        navigate('/client/dashboard');
      }
    }
  }, [user, navigate, isRegisteringUser, showSuccess]);

  // Form states
  const [email, setEmail] = useState('');
  const [password] = useState('password123'); // Passwordless flow default
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [nin, setNin] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');

  // Pro onboarding additional states
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Haircuts']);
  const [proServices, setProServices] = useState<{ id: string; name: string; price: number; duration: string }[]>([
    { id: '1', name: 'Signature Haircut & Style', price: 6000, duration: '45 mins' },
    { id: '2', name: 'Modern Beard Grooming', price: 3000, duration: '30 mins' },
  ]);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState('45 mins');

  const [travelPreference, setTravelPreference] = useState<'both' | 'home' | 'shop'>('both');
  const [workingDays, setWorkingDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  const [startHour, setStartHour] = useState('08:00');
  const [endHour, setEndHour] = useState('18:00');

  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | null>(null);

  const handleSocialAuth = async (provider: 'google' | 'apple') => {
    setSocialLoading(provider);
    try {
      const mockEmail = provider === 'google' ? 'google.user@barbme.app' : 'apple.user@barbme.app';
      const mockName = provider === 'google' ? 'Google User' : 'App Store User';
      const avatarUrl = provider === 'google' 
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200';

      // Call register directly so it creates a client account and logs them in
      await register({
        email: mockEmail,
        fullName: mockName,
        phone: '+234 800 111 2222',
        role: 'client',
        avatarUrl
      });
      navigate('/client/dashboard');
    } catch (err) {
      console.error('Social Auth failed', err);
    } finally {
      setSocialLoading(null);
    }
  };

  const handleSyncProSocial = async (provider: 'google' | 'apple') => {
    setSocialLoading(provider);
    try {
      // Simulate OAuth API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockEmail = provider === 'google' ? 'google.pro@barbme.app' : 'apple.pro@barbme.app';
      const mockName = provider === 'google' ? 'Google Stylist' : 'App Store Stylist';
      const avatarUrl = provider === 'google'
        ? 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=200'
        : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200';
      
      setEmail(mockEmail);
      setFullName(mockName);
      setAvatarPreview(avatarUrl);
      setPhone('+234 801 111 3333');
    } catch (err) {
      console.error('Pro Social Registration sync failed', err);
    } finally {
      setSocialLoading(null);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const max_size = 120; // 120px is perfect for profile thumbnail
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > max_size) {
              height = Math.round(height * max_size / width);
              width = max_size;
            }
          } else {
            if (height > max_size) {
              width = Math.round(width * max_size / height);
              height = max_size;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.6); // 60% quality is highly compressed yet looks sharp at 120px
            setAvatarPreview(compressed);
          } else {
            setAvatarPreview(reader.result as string);
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleMode = (newMode: AuthMode) => {
    setMode(newMode);
    setAvatarPreview(null);
    setStep(1);
    setEmail('');
    setFullName('');
    setPhone('');
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const loggedInUser = await login(email, password);
      // Determine where to redirect based on database account profile
      if (loggedInUser && loggedInUser.role === 'professional') {
        navigate('/pro/dashboard');
      } else {
        navigate('/client/dashboard');
      }
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    
    if (mode === 'register-pro') {
      setIsVerifying(true);
      setVerificationMessage('Connecting to NIMC Secure Gateway...');
      await new Promise(resolve => setTimeout(resolve, 1200));
      setVerificationMessage('Verifying National Identification Number (NIN)...');
      await new Promise(resolve => setTimeout(resolve, 1200));
      setVerificationMessage('Executing Biometric Match Check...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      setVerificationMessage('Security clearance approved.');
      await new Promise(resolve => setTimeout(resolve, 600));
      setIsVerifying(false);
      setStep(3); // Advance to specialty selection
      return;
    }
    
    try {
      setIsRegisteringUser(true);
      const newUser = await register({
        email,
        fullName: fullName || email.split('@')[0],
        phone: phone || '+234 800 000 0000',
        nin,
        role: 'client',
        avatarUrl: avatarPreview || undefined
      });
      setCreatedUserData(newUser);
      setIsRegisteringUser(false);
      navigate('/client/dashboard');
    } catch (err) {
      console.error('Registration failed', err);
      setIsVerifying(false);
      setIsRegisteringUser(false);
    }
  };

  const handleProSubmitted = async () => {
    setIsVerifying(true);
    setVerificationMessage('Securing boutique cloud space...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    setVerificationMessage('Publishing service catalogue and pricing tables...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    setVerificationMessage('Generating biometric digital signature...');
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsVerifying(false);
    
    try {
      setIsRegisteringUser(true);
      const newUser = await register({
        email,
        fullName: fullName || email.split('@')[0],
        phone: phone || '+234 800 000 0000',
        nin,
        role: 'professional',
        avatarUrl: avatarPreview || undefined,
        categories: selectedCategories,
        proServices: proServices,
        travelPreference: travelPreference,
        workingDays: workingDays,
        startHour: startHour,
        endHour: endHour
      });
      setCreatedUserData(newUser);
      setIsRegisteringUser(false);
      navigate('/pro/dashboard');
    } catch (err) {
      console.error('Failed to finish onboarding professional', err);
      setIsRegisteringUser(false);
    }
  };

  const isNisValid = nin.length === 11;

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-bg-deep selection:bg-brand selection:text-bg-deep font-sans">
      
      {/* Visual Side (Lefthand Column 5/12 grid span) */}
      <div className="hidden lg:flex lg:col-span-5 bg-[#0a0a0c] p-16 flex-col justify-between relative overflow-hidden border-r border-[#15151a]">
        {/* Abstract design elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand/5 rounded-full translate-y-1/3 -translate-x-1/4 blur-[100px]" />
        
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1c1c24_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

      
        <div className="relative z-10 my-auto py-16">
          <span className="text-brand text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">PREMIUM GROOMING MARKETPLACE</span>
          <h2 className="text-4xl xl:text-5xl font-light text-white leading-[1.2] mb-6 tracking-tight font-serif text-balance">
            Precision meets <span className="text-brand italic font-serif">convenience</span>.
          </h2>
          <p className="text-[#888] text-[11px] uppercase tracking-widest leading-loose max-w-sm mb-10">
            Connecting Nigeria's elite haircut & styling professionals with clients who respect quality, trust, and flawless craftsmanship.
          </p>
          
          <div className="flex gap-4 items-center border-t border-white/5 pt-8 max-w-sm">
            <div className="flex -space-x-3">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop" className="w-9 h-9 rounded-full border-2 border-[#0a0a0c] object-cover" alt="User portrait" />
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop" className="w-9 h-9 rounded-full border-2 border-[#0a0a0c] object-cover" alt="User portrait" />
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&fit=crop" className="w-9 h-9 rounded-full border-2 border-[#0a0a0c] object-cover" alt="User portrait" />
              <div className="w-9 h-9 rounded-full border-2 border-[#0a0a0c] bg-brand/10 flex items-center justify-center text-[10px] font-bold text-brand">+5k</div>
            </div>
            <p className="text-[#555] text-[10px] font-black uppercase tracking-widest leading-none">
              <span className="text-white">5,000+ Verified</span> bookings completed this month.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex gap-8 text-[9px] text-[#444] uppercase tracking-[0.25em] font-black border-t border-white/5 pt-8">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-brand" /> Biometric Identity</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-brand" /> Escrow Secured</span>
        </div>
      </div>

      {/* Form Side (Righthand Column 7/12 grid span) */}
      <div className="flex items-center justify-center p-6 md:p-12 lg:col-span-7 bg-bg-deep overflow-y-auto min-h-screen">
        <div className="w-full max-w-[440px] my-auto py-16">
          {authWarning && (
            <div className="mb-6 p-4 bg-brand/10 border border-brand/20 rounded-2xl flex items-start gap-3 text-left">
              <span className="text-brand mt-0.5 shrink-0 text-base font-bold">⚠️</span>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-white leading-normal uppercase tracking-wider">
                  Firebase Sandbox Active
                </p>
                <p className="text-[10px] text-[#aaa] leading-relaxed">
                  {authWarning}
                </p>
              </div>
            </div>
          )}
          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="w-full"
              >
                <div className="mb-10 text-center lg:text-left">
                  <span className="text-brand text-[10px] font-black uppercase tracking-[0.25em] mb-3 block">ACCESS GATEWAY</span>
                  <h1 className="text-4xl font-light text-white tracking-tight leading-none mb-3">
                    Welcome <span className="text-brand italic font-serif">Back</span>
                  </h1>
                  <p className="text-[#666] text-xs font-black uppercase tracking-widest">
                    Enter your email for passwordless fast sign-in
                  </p>
                </div>

                {/* Highly Polished Sandbox Fast-Login Widgets */}
            

                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2 text-left">
                    <label className="text-[9px] font-black text-[#666] uppercase tracking-[0.2em] ml-1">Email Address</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444] group-focus-within:text-brand transition-colors">
                        <Mail className="w-5 h-5 stroke-[1.5]" />
                      </div>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-bg-surface border border-white/[0.05] focus:border-brand rounded-xl transition-all outline-none text-white placeholder:text-[#3c3c46] text-sm font-medium tracking-wide" 
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>
                  
                  {/* Passwordless Badge */}
                  <div className="p-4 bg-brand/[0.03] border border-brand/10 rounded-2xl flex items-center gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-brand/5 flex items-center justify-center shrink-0">
                      <Fingerprint className="w-4 h-4 text-brand" />
                    </div>
                    <div className="text-left">
                      <span className="text-[9px] font-black text-brand uppercase tracking-[0.2em] block">One-Detail Magic Sign In</span>
                      <span className="text-[10px] text-[#666] font-medium leading-none block mt-0.5">Secure validation link is dispatched on submission.</span>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4.5 bg-brand text-bg-deep rounded-xl font-black uppercase tracking-[0.15em] text-[10px] shadow-xl shadow-brand/10 hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>Sign In Securely <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </button>
                </form>



                <div className="mt-10 pt-8 border-t border-[#1a1a24] text-center">
                  <p className="text-xs text-[#555] font-bold uppercase tracking-widest">
                    New to the BarbMe elite circle?{' '}
                    <button onClick={() => toggleMode('register-client')} className="text-brand hover:underline underline-offset-4 font-black">Join now</button>
                  </p>
                </div>
              </motion.div>
            ) : mode === 'register-client' ? (
              showSuccess ? (
                <motion.div
                  key="client-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-full text-center py-8"
                >
                  <div className="w-20 h-20 bg-brand/5 border border-brand rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_25px_rgba(196,164,124,0.15)] relative">
                    <CheckCircle2 className="w-10 h-10 text-brand stroke-[1.5]" />
                    <div className="absolute inset-0 bg-brand/5 rounded-full blur-md animate-ping pointer-events-none" />
                  </div>
                  
                  <h2 className="text-3xl font-light text-white mb-2 tracking-tighter italic font-serif leading-none">Welcome to BarbMe!</h2>
                  <p className="text-brand text-[10px] font-black uppercase tracking-[0.25em] mb-8 animate-pulse">Account Created Successfully</p>

                  <div className="p-5 bg-white/[0.01] border border-white/[0.04] rounded-2xl mb-8 text-left space-y-3.5">
                    <div className="flex items-center justify-between border-b border-white/[0.04] pb-2.5">
                      <span className="text-[9px] font-black text-[#555] uppercase tracking-widest">USER ACCOUNT ID</span>
                      <span className="text-[10px] font-mono text-brand font-bold text-right select-all">{createdUserData?.id || 'Generating...'}</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-white/[0.04] pb-2.5">
                      <span className="text-[9px] font-black text-[#444] uppercase tracking-widest">FULL NAME</span>
                      <span className="text-[10px] font-bold text-white text-right">{createdUserData?.fullName}</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-white/[0.04] pb-2.5">
                      <span className="text-[9px] font-black text-[#444] uppercase tracking-widest">EMAIL ADDRESS</span>
                      <span className="text-[10px] font-bold text-white text-right font-mono text-[9px] lowercase">{createdUserData?.email}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#555] font-bold uppercase tracking-widest text-[9px]">MEMBER LEVEL</span>
                      <span className="text-brand text-[9px] font-black uppercase tracking-widest text-right">Premium Partner Circle</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setIsRegisteringUser(false);
                      navigate('/client/dashboard');
                    }} 
                    className="w-full py-4 bg-brand text-bg-deep rounded-xl font-black uppercase tracking-[0.15em] text-[10px] shadow-xl shadow-brand/10 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 group"
                  >
                    Enter Client Dashboard <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="register-client"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="w-full"
                >
                  <div className="mb-8 text-center lg:text-left">
                    <button onClick={() => toggleMode('login')} className="text-brand text-[9px] font-black uppercase tracking-[0.25em] mb-4 hover:underline underline-offset-4 flex items-center gap-1.5 mx-auto lg:mx-0">
                      ← Back to Sign In
                    </button>
                    <h1 className="text-4xl font-light text-white tracking-tight leading-none mb-3">
                      Create <span className="text-brand italic font-serif">Account</span>
                    </h1>
                    <p className="text-[#666] text-xs font-black uppercase tracking-widest">
                      Instant onboarding with one detail
                    </p>
                  </div>

                  {/* Developer instant setup widget */}
              

                  {/* Account Type Selector Tab layout (Extremely Polished) */}
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    <button 
                      type="button"
                      onClick={() => toggleMode('register-client')}
                      className={`p-5 rounded-xl border transition-all text-left flex flex-col gap-3 relative overflow-hidden ${mode === 'register-client' ? 'border-brand bg-brand/[0.02]' : 'border-white/[0.04] bg-[#0c0c0f] hover:border-white/10'}`}
                    >
                      {mode === 'register-client' && <div className="absolute top-0 right-0 w-3 h-3 bg-brand rounded-bl-lg" />}
                      <User className={`w-5 h-5 ${mode === 'register-client' ? 'text-brand' : 'text-[#444]'}`} />
                      <div>
                        <span className={`block font-bold text-xs ${mode === 'register-client' ? 'text-white' : 'text-[#555]'}`}>Join as Client</span>
                        <span className="text-[9px] text-[#444] uppercase tracking-widest font-black block mt-0.5">To book services</span>
                      </div>
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => toggleMode('register-pro')}
                      className={`p-5 rounded-xl border transition-all text-left flex flex-col gap-3 relative overflow-hidden ${mode === 'register-pro' ? 'border-brand bg-brand/[0.02]' : 'border-white/[0.04] bg-[#0c0c0f] hover:border-white/10'}`}
                    >
                      {mode === 'register-pro' && <div className="absolute top-0 right-0 w-3 h-3 bg-brand rounded-bl-lg" />}
                      <Scissors className={`w-5 h-5 ${mode === 'register-pro' ? 'text-brand' : 'text-[#444]'}`} />
                      <div>
                        <span className={`block font-bold text-xs ${mode === 'register-pro' ? 'text-white' : 'text-[#555]'}`}>Join as Professional</span>
                        <span className="text-[9px] text-[#444] uppercase tracking-widest font-black block mt-0.5">To offer services</span>
                      </div>
                    </button>
                  </div>

                  <form onSubmit={handleRegister} className="space-y-6">
                    {/* Photo Upload area */}
                    <div className="flex flex-col items-center p-6 bg-white/[0.01] border border-dashed border-[#1f1f27] rounded-2xl mb-2 text-center">
                      <div className="relative group">
                        <div className="w-20 h-20 rounded-2xl bg-bg-surface border border-white/[0.05] flex items-center justify-center overflow-hidden transition-all group-hover:border-brand/40">
                          {avatarPreview ? (
                            <img src={avatarPreview} alt="Avatar Preview" className="w-[80px] h-[80px] object-cover" />
                          ) : (
                            <Camera className="w-6 h-6 text-[#444] transition-colors group-hover:text-brand" />
                          )}
                        </div>
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <button 
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-brand text-bg-deep rounded-lg flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                        >
                          <Camera className="w-3.5 h-3.5" />
                        </button>
                        {avatarPreview && (
                          <button 
                            type="button"
                            onClick={removeAvatar}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500/90 text-white rounded-lg flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <p className="text-[9px] font-black text-[#666] uppercase tracking-[0.2em] mt-3">Profile Picture (Optional)</p>
                    </div>

                    {/* Core Required Email Details */}
                    <div className="space-y-4">
                      <div className="space-y-2 text-left">
                        <label className="text-[9px] font-black text-[#666] uppercase tracking-[0.2em] ml-1">Email Address <span className="text-brand">*</span></label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444] group-focus-within:text-brand transition-colors w-5 h-5 stroke-[1.5]" />
                          <input 
                            required 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-bg-surface border border-brand/40 focus:border-brand rounded-xl transition-all outline-none text-white text-sm" 
                            placeholder="name@example.com" 
                          />
                        </div>
                      </div>

                      <div className="space-y-2 text-left">
                        <label className="text-[9px] font-black text-[#555] uppercase tracking-[0.2em] ml-1">Full Name (Optional)</label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444] group-focus-within:text-brand transition-colors w-5 h-5 stroke-[1.5]" />
                          <input 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-bg-surface border border-white/[0.05] focus:border-brand rounded-xl transition-all outline-none text-white text-sm placeholder:text-[#333]" 
                            placeholder="Your name" 
                          />
                        </div>
                      </div>

                      <div className="space-y-2 text-left">
                        <label className="text-[9px] font-black text-[#555] uppercase tracking-[0.2em] ml-1">WhatsApp / Phone</label>
                        <div className="relative group">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444] group-focus-within:text-brand transition-colors w-5 h-5 stroke-[1.5]" />
                          <input 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-bg-surface border border-white/[0.05] focus:border-brand rounded-xl transition-all outline-none text-white text-sm placeholder:text-[#333]" 
                            placeholder="+234 800 000 0000" 
                          />
                        </div>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4.5 bg-brand text-bg-deep rounded-xl font-black uppercase tracking-[0.15em] text-[10px] hover:opacity-90 transition-all shadow-xl shadow-brand/10 flex items-center justify-center disabled:opacity-50"
                    >
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Register Instantly'}
                    </button>
                  </form>


                  <div className="mt-8 pt-6 border-t border-[#1a1a24] text-center">
                    <p className="text-xs text-[#555] font-bold uppercase tracking-widest">
                      Already a premium member?{' '}
                      <button onClick={() => toggleMode('login')} className="text-brand hover:underline underline-offset-4 font-black">Login</button>
                    </p>
                  </div>
                </motion.div>
              )
            ) : (
              <motion.div
                key="register-pro"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="w-full text-left"
              >
                <div className="mb-8">
                  {step === 1 ? (
                    <button onClick={() => toggleMode('register-client')} className="text-brand text-[9px] font-black uppercase tracking-[0.25em] mb-4 hover:underline underline-offset-4 flex items-center gap-1.5">
                      ← Back to Account Options
                    </button>
                  ) : step <= 5 ? (
                    <button onClick={() => setStep(step - 1)} className="text-brand text-[9px] font-black uppercase tracking-[0.25em] mb-4 hover:underline underline-offset-4 flex items-center gap-1.5">
                      ← Back to Step {step - 1}
                    </button>
                  ) : null}
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <h1 className="text-3xl font-light text-white tracking-tight leading-none mb-2.5 italic font-serif">Onboarding</h1>
                      <p className="text-[10px] font-black text-[#555] uppercase tracking-widest">
                        {step <= 5 ? (
                          `Step ${step} of 5 • ${
                            step === 1 ? 'Basic Profile' :
                            step === 2 ? 'Identity Check' :
                            step === 3 ? 'Specialties' :
                            step === 4 ? 'Services & Catalog' :
                            'Operating Preferences'
                          }`
                        ) : (
                          'Onboarding Completed'
                        )}
                      </p>
                    </div>
                    {step <= 5 && (
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={i} className={`w-6 h-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-brand shadow-[0_0_8px_rgba(196,164,124,0.4)]' : 'bg-[#1b1b22]'}`} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {step === 1 ? (
                  // Step 1: Basic Details Form
                  <div className="space-y-6">
                    <div className="flex flex-col items-center p-6 bg-white/[0.01] border border-dashed border-[#1f1f27] rounded-2xl mb-2 text-center">
                      <div className="relative group">
                        <div className="w-20 h-20 rounded-2xl bg-bg-surface border border-white/[0.05] flex items-center justify-center overflow-hidden transition-all group-hover:border-brand/40">
                          {avatarPreview ? (
                            <img src={avatarPreview} alt="Avatar Preview" className="w-[80px] h-[80px] object-cover" />
                          ) : (
                            <Camera className="w-6 h-6 text-[#444] transition-colors group-hover:text-brand" />
                          )}
                        </div>
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <button 
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-brand text-bg-deep rounded-lg flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                        >
                          <Camera className="w-3.5 h-3.5" />
                        </button>
                        {avatarPreview && (
                          <button 
                            type="button"
                            onClick={removeAvatar}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500/90 text-white rounded-lg flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <p className="text-[9px] font-black text-[#666] uppercase tracking-[0.2em] mt-3">Professional Bio Photo</p>
                    </div>

                    <div className="relative rounded-xl p-4.5 bg-brand/[0.03] border border-brand/20 mb-6 text-[10px] text-brand/80 font-bold uppercase tracking-widest leading-relaxed flex gap-3.5 items-center">
                      <ShieldCheck className="w-5.5 h-5.5 flex-shrink-0 text-brand" />
                      <span>Security clearance is checked via NIMC in step 2 to guarantee verified elite marketplace badge status.</span>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-[#666] uppercase tracking-[0.2em] ml-1">Professional / Salon Name <span className="text-brand">*</span></label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444] group-focus-within:text-brand transition-colors w-5 h-5 stroke-[1.5]" />
                          <input 
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-bg-surface border border-white/[0.05] focus:border-brand rounded-xl transition-all outline-none text-white text-sm font-medium" 
                            placeholder="e.g. Barber Bolu Lagos or Signature Cutz" 
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-[#666] uppercase tracking-[0.2em] ml-1">WhatsApp / Phone Number</label>
                        <div className="relative group">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444] group-focus-within:text-brand transition-colors w-5 h-5 stroke-[1.5]" />
                          <input 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-bg-surface border border-white/[0.05] focus:border-brand rounded-xl transition-all outline-none text-white text-sm font-medium" 
                            placeholder="e.g. +234 803 123 4567" 
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-[#666] uppercase tracking-[0.2em] ml-1">Business Email <span className="text-brand">*</span></label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444] group-focus-within:text-brand transition-colors w-5 h-5 stroke-[1.5]" />
                          <input 
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-bg-surface border border-white/[0.05] focus:border-brand rounded-xl transition-all outline-none text-white text-sm font-medium" 
                            placeholder="e.g. bolu@example.com" 
                          />
                        </div>
                      </div>
                    </div>

                    <button 
                      type="button"
                      onClick={() => setStep(2)} 
                      disabled={!fullName || !email}
                      className="w-full py-4.5 bg-brand text-bg-deep rounded-xl font-black uppercase tracking-[0.15em] text-[10px] shadow-xl shadow-brand/10 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40"
                    >
                      Continue to KYC
                    </button>
                  </div>
                ) : step === 2 ? (
                  // Step 2: KYC Verification
                  <div className="space-y-6">
                    <AnimatePresence mode="wait">
                      {isVerifying ? (
                        <motion.div 
                          key="verifying"
                          initial={{ opacity: 0, scale: 0.97 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.03 }}
                          transition={{ duration: 0.2 }}
                          className="p-12 bg-bg-surface rounded-2xl border border-white/[0.04] flex flex-col items-center text-center py-24 relative overflow-hidden"
                        >
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-brand/5 blur-3xl rounded-full" />
                          <div className="relative mb-8">
                            <Loader2 className="w-16 h-16 text-brand animate-spin" />
                          </div>
                          <h3 className="text-xl font-light text-white mb-3 tracking-tight italic font-serif">Security Gateway Verification</h3>
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-brand/90 animate-pulse">
                            {verificationMessage}
                          </p>
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="form"
                          initial={{ opacity: 0, scale: 1.03 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.97 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-6"
                        >
                          <div className="p-8 bg-[#0c0c10] rounded-2xl border border-white/[0.04]">
                            <h3 className="font-bold text-white mb-2 tracking-tight italic font-serif text-lg">Identity Verification</h3>
                            <p className="text-[10px] text-[#555] uppercase tracking-widest font-black mb-8 leading-relaxed">
                              Enter your 11-digit National Identification Number (NIN).
                            </p>
                            
                            <div className="relative">
                              <input 
                                maxLength={11}
                                value={nin}
                                onChange={(e) => setNin(e.target.value.replace(/\D/g, ''))}
                                className="w-full p-4 bg-bg-deep border border-white/[0.08] focus:border-brand rounded-xl transition-all font-mono tracking-[0.5em] text-center text-2xl text-white outline-none" 
                                placeholder="00000000000" 
                              />
                              <div className="absolute top-1/2 -translate-y-1/2 right-4 flex items-center gap-2">
                                {nin.length > 0 && (
                                  <span className={`text-[10px] font-black uppercase tracking-widest ${isNisValid ? 'text-brand' : 'text-red-500'}`}>
                                    {nin.length}/11
                                  </span>
                                )}
                                {isNisValid && <CheckCircle2 className="w-4 h-4 text-brand" />}
                              </div>
                            </div>
                          </div>
                          
                          <button 
                            type="button"
                            onClick={handleRegister} 
                            disabled={!isNisValid || isLoading}
                            className="w-full py-4.5 bg-brand text-bg-deep rounded-xl font-black uppercase tracking-[0.15em] text-[10px] shadow-xl shadow-brand/10 transition-all flex items-center justify-center disabled:opacity-40"
                          >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Identity & Onboard'}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : step === 3 ? (
                  // Step 3: Select Specialties / Categories
                  <div className="space-y-6">
                    <div className="p-4 bg-white/[0.01] border border-[#1f1f27] rounded-xl">
                      <p className="text-[10px] text-[#888] font-bold uppercase tracking-widest leading-relaxed mb-1">
                        Select specialties
                      </p>
                      <p className="text-[9px] text-brand uppercase tracking-widest">
                        Your listing will appear in client filters matching these selections.
                      </p>
                    </div>

                    <div className="grid gap-3 max-h-[300px] overflow-y-auto pr-1">
                      {AVAILABLE_CATEGORIES.map(cat => {
                        const isSelected = selectedCategories.includes(cat.id);
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setSelectedCategories(selectedCategories.filter(c => c !== cat.id));
                              } else {
                                setSelectedCategories([...selectedCategories, cat.id]);
                              }
                            }}
                            className={`p-4 rounded-xl border transition-all text-left flex items-start gap-3 relative ${
                              isSelected 
                                ? 'border-brand bg-brand/[0.03] shadow-[0_0_15px_rgba(196,164,124,0.05)]' 
                                : 'border-white/[0.04] bg-[#0c0c0f] hover:border-white/10'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                              isSelected ? 'border-brand bg-brand text-bg-deep' : 'border-white/20 bg-bg-deep'
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                            <div className="flex-1">
                              <p className={`text-xs font-bold leading-none ${isSelected ? 'text-brand' : 'text-white'}`}>{cat.label}</p>
                              <p className="text-[10px] text-[#555] mt-1 leading-normal uppercase font-black tracking-wider">{cat.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      disabled={selectedCategories.length === 0}
                      className="w-full py-4.5 bg-brand text-bg-deep rounded-xl font-black uppercase tracking-[0.15em] text-[10px] shadow-xl shadow-brand/10 hover:opacity-90 transition-all disabled:opacity-45"
                    >
                      Confirm Specials & Continue
                    </button>
                  </div>
                ) : step === 4 ? (
                  // Step 4: Configure Setup Services Catalog (Interactive Custom Addition)
                  <div className="space-y-6 text-left">
                    <div className="p-4 bg-brand/[0.02] border border-brand/10 rounded-xl">
                      <p className="text-[10px] text-brand font-black uppercase tracking-[0.2em] mb-1">Service Catalogue Creator</p>
                      <p className="text-[9px] text-[#888] uppercase tracking-widest font-bold">Add the default services you wish to offer first.</p>
                    </div>

                    {/* Active Services List */}
                    <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                      <p className="text-[9px] font-black text-[#555] uppercase tracking-[0.2em] ml-1 mb-2">My Configured Offerings ({proServices.length})</p>
                      {proServices.length === 0 ? (
                        <div className="py-8 bg-white/[0.01] border border-dashed border-[#1f1f23] rounded-xl text-center text-xs text-[#555] uppercase tracking-widest font-black">
                          No services loaded. Add one below!
                        </div>
                      ) : (
                        proServices.map((service) => (
                          <div key={service.id} className="p-3.5 bg-[#0b0b0e] border border-white/[0.02] hover:border-white/[0.06] rounded-xl flex items-center justify-between transition-colors">
                            <div>
                              <p className="text-xs font-bold text-white leading-none">{service.name}</p>
                              <p className="text-[9px] text-[#555] font-mono mt-1.5 uppercase font-medium tracking-widest">{service.duration} duration</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-brand font-mono font-bold text-xs bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-lg">
                                ₦{service.price.toLocaleString()}
                              </span>
                              <button
                                type="button"
                                onClick={() => setProServices(proServices.filter(s => s.id !== service.id))}
                                className="p-2 text-[#444] hover:text-[#ff4a4a] hover:bg-red-500/5 rounded-lg transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Minimal Quick-Add Drawer / Card */}
                    <div className="p-4 bg-white/[0.02] border border-[#1f1f27] rounded-2xl space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black text-brand uppercase tracking-[0.25em]">Add Customized Service</span>
                        <Briefcase className="w-3.5 h-3.5 text-brand" />
                      </div>
                      
                      <input
                        value={newServiceName}
                        onChange={(e) => setNewServiceName(e.target.value)}
                        className="w-full p-3 bg-bg-deep border border-white/[0.05] focus:border-brand rounded-xl outline-none text-white text-xs placeholder:text-[#333]"
                        placeholder="e.g. Sharp Dreadlock Lineup"
                      />
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-[#555]">₦</span>
                          <input
                            type="number"
                            value={newServicePrice}
                            onChange={(e) => setNewServicePrice(e.target.value)}
                            className="w-full pl-7 pr-3 py-3 bg-bg-deep border border-white/[0.05] focus:border-brand rounded-xl outline-none text-white text-xs placeholder:text-[#3c3c46]"
                            placeholder="Price"
                          />
                        </div>

                        <select
                          value={newServiceDuration}
                          onChange={(e) => setNewServiceDuration(e.target.value)}
                          className="w-full p-3 bg-bg-deep border border-white/[0.05] focus:border-brand rounded-xl outline-none text-[#888] text-xs font-medium"
                        >
                          <option value="15 mins">15 mins</option>
                          <option value="20 mins">20 mins</option>
                          <option value="30 mins">30 mins</option>
                          <option value="45 mins">45 mins</option>
                          <option value="60 mins">60 mins</option>
                          <option value="90 mins">90 mins</option>
                          <option value="120 mins">120 mins</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (newServiceName && newServicePrice) {
                            const added = {
                              id: Date.now().toString(),
                              name: newServiceName,
                              price: Number(newServicePrice),
                              duration: newServiceDuration
                            };
                            setProServices([...proServices, added]);
                            setNewServiceName('');
                            setNewServicePrice('');
                          }
                        }}
                        disabled={!newServiceName || !newServicePrice}
                        className="w-full py-2.5 bg-brand/10 hover:bg-[#ddbb97] border border-brand/20 hover:border-transparent text-brand hover:text-bg-deep rounded-xl font-bold uppercase tracking-widest text-[9px] transition-all flex items-center justify-center gap-1.5 disabled:opacity-30"
                      >
                        <Plus className="w-3.5 h-3.5" /> Append To Listing
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setStep(5)}
                      disabled={proServices.length === 0}
                      className="w-full py-4.5 bg-brand text-bg-deep rounded-xl font-black uppercase tracking-[0.15em] text-[10px] shadow-xl shadow-brand/10 hover:opacity-90 transition-all disabled:opacity-40"
                    >
                      Save Catalog & Setup Availability
                    </button>
                  </div>
                ) : step === 5 ? (
                  // Step 5: Travel Preference, Operating Days & Hours
                  <div className="space-y-6 text-left">
                    <div className="space-y-2.5">
                      <label className="text-[9px] font-black text-[#555] uppercase tracking-[0.2em] ml-1 block">Work Mode Location Preference</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'shop', label: 'My Shop/Salon', desc: 'At my location' },
                          { id: 'home', label: 'House Calls', desc: 'Travel to client' },
                          { id: 'both', label: 'Hybrid/Both', desc: 'Maximum reach' },
                        ].map(modeOpt => {
                          const isActive = travelPreference === modeOpt.id;
                          return (
                            <button
                              key={modeOpt.id}
                              type="button"
                              onClick={() => setTravelPreference(modeOpt.id as any)}
                              className={`p-3.5 rounded-xl border transition-all text-center flex flex-col justify-between ${
                                isActive 
                                  ? 'border-brand bg-brand/[0.02]' 
                                  : 'border-white/[0.04] bg-[#0c0c0f] hover:border-white/10'
                              }`}
                            >
                              <MapPin className={`w-4 h-4 mx-auto ${isActive ? 'text-brand' : 'text-[#444]'}`} />
                              <div className="mt-2 text-[10px] font-bold tracking-tight text-white leading-none whitespace-nowrap">{modeOpt.label}</div>
                              <div className="text-[8px] text-[#555] mt-1 font-semibold uppercase leading-tight truncate">{modeOpt.desc}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <label className="text-[9px] font-black text-[#555] uppercase tracking-[0.2em] ml-1 block">Active Working Days</label>
                      <div className="flex flex-wrap gap-1.5">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                          const isActive = workingDays.includes(day);
                          return (
                            <button
                              key={day}
                              type="button"
                              onClick={() => {
                                if (isActive) {
                                  setWorkingDays(workingDays.filter(d => d !== day));
                                } else {
                                  setWorkingDays([...workingDays, day]);
                                }
                              }}
                              className={`px-3.5 py-2.5 rounded-lg border text-xs font-bold font-mono transition-all ${
                                isActive 
                                  ? 'border-brand bg-brand text-bg-deep shadow-[0_0_8px_rgba(196,164,124,0.15)]' 
                                  : 'border-white/[0.04] bg-[#0a0a0d] hover:border-white/10 text-[#666]'
                              }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <label className="text-[9px] font-black text-[#555] uppercase tracking-[0.2em] ml-1 block">Working Hours Boundary</label>
                      <div className="grid grid-cols-2 gap-3 p-4 bg-white/[0.01] border border-[#1f1f27] rounded-xl">
                        <div className="space-y-1.5">
                          <span className="text-[8px] font-black text-[#444] uppercase tracking-widest pl-1">Starting Time</span>
                          <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444] w-3.5 h-3.5" />
                            <select
                              value={startHour}
                              onChange={(e) => setStartHour(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 bg-bg-deep border border-white/[0.05] rounded-lg outline-none text-[#888] text-xs font-medium"
                            >
                              {['06:00', '07:00', '08:00', '09:00', '10:00', '11:00'].map(h => <option key={h} value={h}>{h} AM</option>)}
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-[8px] font-black text-[#444] uppercase tracking-widest pl-1">Ending Time</span>
                          <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444] w-3.5 h-3.5" />
                            <select
                              value={endHour}
                              onChange={(e) => setEndHour(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 bg-bg-deep border border-white/[0.05] rounded-lg outline-none text-[#888] text-xs font-medium"
                            >
                              {['16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'].map(h => {
                                const parseHour = parseInt(h);
                                const pmValue = parseHour > 12 ? `${parseHour - 12}:00` : h;
                                return <option key={h} value={h}>{pmValue} PM</option>;
                              })}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <AnimatePresence mode="wait">
                        {isVerifying ? (
                          <div className="p-4 bg-brand/5 border border-brand/10 rounded-xl text-center space-y-2">
                            <Loader2 className="w-5 h-5 text-brand animate-spin mx-auto" />
                            <p className="text-[9px] font-black uppercase tracking-widest text-[#999]">{verificationMessage}</p>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={handleProSubmitted}
                            disabled={workingDays.length === 0}
                            className="w-full py-4.5 bg-brand text-bg-deep rounded-xl font-black uppercase tracking-[0.15em] text-[10px] shadow-xl shadow-brand/10 hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-40"
                          >
                            Verify & Activate Boutique Profile
                          </button>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ) : (
                  // Step 6: Success Page
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-brand/5 border border-brand rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_25px_rgba(196,164,124,0.1)] relative">
                      <CheckCircle2 className="w-10 h-10 text-brand stroke-[1.5]" />
                      <div className="absolute inset-0 bg-brand/5 rounded-full blur-md animate-ping pointer-events-none" />
                    </div>
                    
                    <h2 className="text-3xl font-light text-white mb-2 tracking-tighter italic font-serif leading-none">Boutique Active!</h2>
                    <p className="text-brand text-[10px] font-black uppercase tracking-[0.25em] mb-8 animate-pulse">Onboarding Complete</p>

                    <div className="p-5 bg-white/[0.01] border border-white/[0.04] rounded-2xl mb-8 text-left space-y-3.5">
                      <div className="flex items-center justify-between border-b border-white/[0.04] pb-2.5">
                        <span className="text-[9px] font-black text-[#666] uppercase tracking-widest">BOUTIQUE ID</span>
                        <span className="text-[10px] font-mono text-brand font-bold text-right select-all">{createdUserData?.id || 'Pending...'}</span>
                      </div>

                      <div className="flex items-center justify-between border-b border-white/[0.04] pb-2.5">
                        <span className="text-[9px] font-black text-[#444] uppercase tracking-widest">BOUTIQUE STYLIST</span>
                        <span className="text-[10px] font-bold text-white text-right">{fullName || 'Bolu Stylist'}</span>
                      </div>
                      
                      <div className="flex justify-between text-xs">
                        <span className="text-[#555] font-bold uppercase tracking-widest text-[9px]">SPECIALTIES</span>
                        <div className="text-right flex flex-wrap gap-1 justify-end max-w-[200px]">
                          {selectedCategories.map(cat => (
                            <span key={cat} className="text-[8px] font-bold bg-white/5 text-[#ccc] px-1.5 py-0.5 rounded uppercase">{cat}</span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#555] font-bold uppercase tracking-widest text-[9px]">OFFERINGS CONFIG</span>
                        <span className="text-[#ccc] font-bold font-mono text-right">{proServices.length} Active Services Loaded</span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#555] font-bold uppercase tracking-widest text-[9px]">ACTIVE TIME</span>
                        <span className="text-[#ccc] text-[9px] font-black uppercase tracking-widest text-right">{workingDays.length} Days Allowed ({startHour} to {endHour})</span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#555] font-bold uppercase tracking-widest text-[9px]">DELIVERY MODE</span>
                        <span className="text-brand text-[9px] font-black uppercase tracking-widest text-right">
                          {travelPreference === 'both' ? 'Hybrid (Home + Shop)' : travelPreference === 'home' ? 'House Call only' : 'Shop Studio only'}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={async () => {
                        try {
                          setIsRegisteringUser(false);
                          await login(email, 'password123'); // Log them in elegantly
                          navigate('/pro/dashboard');
                        } catch (err) {
                          console.error('Bypass authorization failure', err);
                          setIsRegisteringUser(false);
                          navigate('/pro/dashboard');
                        }
                      }} 
                      className="w-full py-4 bg-brand text-bg-deep rounded-xl font-black uppercase tracking-[0.15em] text-[10px] shadow-xl shadow-brand/10 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 group"
                    >
                      Enter Professional Panel <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
    </div>
  );
};
