import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Store, 
  Calendar as CalendarIcon, 
  CreditCard,
  Scissors,
  CheckCircle2,
  ShieldCheck,
  ChevronLeft,
  Wallet,
  Building,
  Lock
} from 'lucide-react';
import { Professional, User, ServiceCategory } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface BookingFlowProps {
  pro: (Professional & { user: User });
  isOpen: boolean;
  onClose: () => void;
}

export const BookingFlow = ({ pro, isOpen, onClose }: BookingFlowProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [mode, setMode] = useState<'shop' | 'home_visit'>('shop');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Secure Funding Source Selection State
  const [fundingSource, setFundingSource] = useState<'card' | 'bank' | 'wallet'>('card');

  // Client Details Form State
  const [clientName, setClientName] = useState(() => user?.fullName || '');
  const [clientPhone, setClientPhone] = useState(() => user?.phone || '');
  const [clientAddress, setClientAddress] = useState('');
  const [clientNotes, setClientNotes] = useState('');

  // Sync with auth user safely
  useEffect(() => {
    if (user) {
      setClientName(prev => prev || user.fullName || '');
      setClientPhone(prev => prev || user.phone || '');
    }
  }, [user?.id]);

  // Load custom services configured by professional or fallback
  const servicesList = useMemo(() => {
    const rawServices = pro.user.proServices || [];
    if (rawServices.length > 0) {
      return rawServices.map((s: any) => ({
        id: s.id || `pro-service-${Math.random()}`,
        name: s.name,
        price: `₦${Number(s.price).toLocaleString()}`,
        duration: s.duration || '45 mins'
      }));
    }
    return [
      { id: 's1', name: 'Standard Fade', price: '₦5,500', duration: '45 mins' },
      { id: 's2', name: 'Beard Grooming', price: '₦2,500', duration: '30 mins' },
      { id: 's3', name: 'Hair Coloring', price: '₦8,000', duration: '60 mins' },
    ];
  }, [pro.user.proServices]);

  const activeServiceObj = useMemo(() => {
    return servicesList.find(s => s.id === selectedService);
  }, [servicesList, selectedService]);

  const dates = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  }), []);

  const availableSlots = useMemo(() => {
    if (!pro.availability) return ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
    
    const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const dayConfig = pro.availability[dayName];
    
    if (!dayConfig || !dayConfig.isOpen) return [];
    
    // Simple slot generation for demo
    const slots: string[] = [];
    dayConfig.slots.forEach(slot => {
      let current = parseInt(slot.start.split(':')[0]);
      const end = parseInt(slot.end.split(':')[0]);
      while (current < end) {
        slots.push(`${current.toString().padStart(2, '0')}:00`);
        current++;
      }
    });
    return slots;
  }, [selectedDate, pro.availability]);

  const [isProcessing, setIsProcessing] = useState(false);

  const isStepInvalid = useMemo(() => {
    if (step === 1) return !selectedService;
    if (step === 3) return !selectedTime;
    if (step === 4) {
      if (!clientName.trim()) return true;
      if (!clientPhone.trim()) return true;
      if (mode === 'home_visit' && !clientAddress.trim()) return true;
    }
    return false;
  }, [step, selectedService, selectedTime, clientName, clientPhone, mode, clientAddress]);

  if (!isOpen) return null;

  const handleNext = async () => {
    if (step === 5) {
      setIsProcessing(true);
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsProcessing(false);
    }
    
    if (step === 3 && mode === 'shop') {
      setStep(5);
    } else {
      setStep(prev => prev + 1);
    }
  };
  const handleBack = () => {
    if (step === 5 && mode === 'shop') {
      setStep(3);
    } else {
      setStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" 
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-xl bg-bg-deep rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden border border-border-muted"
      >
        {/* Header */}
        <div className="bg-bg-sidebar px-8 py-6 border-b border-border-muted flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg overflow-hidden shadow-sm border border-border-muted">
                <img src={pro.user.avatarUrl} className="w-full h-full object-cover grayscale-[0.2]" />
             </div>
             <div>
                <h2 className="font-bold text-white tracking-tight">{pro.user.fullName}</h2>
                <p className="text-[10px] font-black text-[#555] uppercase tracking-widest leading-none mt-1">Booking Appointment</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-bg-surface rounded-lg transition-colors">
            <X className="w-5 h-5 text-[#555]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[70vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <h3 className="text-xl font-light text-white mb-6 tracking-tight">Select a <span className="text-brand italic font-serif">Service</span></h3>
                <div className="space-y-3">
                    {servicesList.map(s => (
                        <motion.button 
                            key={s.id}
                            onClick={() => setSelectedService(s.id)}
                            whileHover={{ scale: 1.01 }}
                            whileActive={{ scale: 0.99 }}
                            className={`w-full p-6 rounded-xl border transition-all flex items-center justify-between ${selectedService === s.id ? 'border-brand bg-brand/5 shadow-inner' : 'border-border-muted bg-bg-surface hover:border-border-highlight'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedService === s.id ? 'bg-brand/10' : 'bg-bg-deep'}`}>
                                    <Scissors className={`w-5 h-5 ${selectedService === s.id ? 'text-brand' : 'text-[#444]'}`} />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-white text-sm">{s.name}</p>
                                    <p className="text-[10px] uppercase font-bold text-[#555] tracking-widest">{s.duration}</p>
                                </div>
                            </div>
                            <span className="font-black text-white font-mono italic text-sm">{s.price}</span>
                        </motion.button>
                    ))}
                </div>
              </motion.div>
            ) : step === 2 ? (
                <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                    <h3 className="text-xl font-light text-white mb-6 tracking-tight">How do you <span className="text-brand italic font-serif">prefer</span> it?</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => setMode('shop')}
                            className={`p-10 rounded-2xl border transition-all flex flex-col items-center gap-4 ${mode === 'shop' ? 'border-brand bg-brand/5 text-brand' : 'border-border-muted bg-bg-surface text-[#444] hover:border-border-highlight'}`}
                        >
                            <Store className="w-10 h-10" />
                            <span className="font-black uppercase text-[10px] tracking-widest">In-Shop</span>
                        </button>
                        <button 
                            onClick={() => setMode('home_visit')}
                            className={`p-10 rounded-2xl border transition-all flex flex-col items-center gap-4 ${mode === 'home_visit' ? 'border-brand bg-brand/5 text-brand' : 'border-border-muted bg-bg-surface text-[#444] hover:border-border-highlight'}`}
                        >
                            <MapPin className="w-10 h-10" />
                            <span className="font-black uppercase text-[10px] tracking-widest">Home Visit</span>
                        </button>
                    </div>
                </motion.div>
            ) : step === 3 ? (
              <motion.div key="step3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <h3 className="text-xl font-light text-white mb-6 tracking-tight">Pick <span className="text-brand italic font-serif">Date & Time</span></h3>
                
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none mb-6">
                  {dates.map((date, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(date)}
                      className={`flex-shrink-0 w-16 h-20 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${selectedDate.toDateString() === date.toDateString() ? 'border-brand bg-brand/10 text-brand' : 'border-border-muted bg-bg-surface text-[#555]'}`}
                    >
                      <span className="text-[10px] uppercase font-black tracking-widest">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                      <span className="text-lg font-bold">{date.getDate()}</span>
                    </button>
                  ))}
                </div>

                {availableSlots.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {availableSlots.map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${selectedTime === time ? 'border-brand bg-brand/5 text-brand' : 'border-border-muted bg-bg-surface text-white'}`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-bg-surface rounded-2xl border border-border-muted">
                    <Clock className="w-10 h-10 text-[#222] mx-auto mb-4" />
                    <p className="text-[10px] font-black text-[#555] uppercase tracking-widest">No slots available for this date</p>
                  </div>
                )}
              </motion.div>
            ) : step === 4 ? (
              <motion.div key="step4" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <h3 className="text-xl font-light text-white mb-6 tracking-tight">Submit Your <span className="text-brand italic font-serif">Details</span></h3>
                
                <div className="space-y-4 text-left">
                  {/* Client Name Input */}
                  <div>
                    <label className="text-[9px] font-black text-[#666] uppercase tracking-[0.2em] ml-1 block mb-2">Your Full Name</label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="E.g. John Doe"
                      className="w-full bg-[#0b0b0e] border border-border-muted rounded-xl px-4 py-3.5 text-xs text-white outline-none focus:border-brand/40 transition-all placeholder:text-[#333]"
                      required
                    />
                  </div>

                  {/* Client Phone Input */}
                  <div>
                    <label className="text-[9px] font-black text-[#666] uppercase tracking-[0.2em] ml-1 block mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="E.g. +234 803 123 4567"
                      className="w-full bg-[#0b0b0e] border border-border-muted rounded-xl px-4 py-3.5 text-xs text-white outline-none focus:border-brand/40 transition-all placeholder:text-[#333]"
                      required
                    />
                  </div>

                  {/* Client Address Input */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-[9px] font-black text-[#666] uppercase tracking-[0.2em] ml-1 block">
                        {mode === 'home_visit' ? 'Home Visit Address' : 'Address / Landmark'}
                      </label>
                      {mode === 'home_visit' ? (
                        <span className="text-[8px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-widest">Required</span>
                      ) : (
                        <span className="text-[8px] bg-white/5 text-[#555] px-1.5 py-0.5 rounded font-bold uppercase tracking-widest">Optional</span>
                      )}
                    </div>
                    <textarea
                      value={clientAddress}
                      onChange={(e) => setClientAddress(e.target.value)}
                      placeholder={mode === 'home_visit' ? "Enter your physical home address in full details..." : "Enter billing address or landmark details (optional)..."}
                      rows={2}
                      className="w-full bg-[#0b0b0e] border border-border-muted rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-brand/40 transition-all placeholder:text-[#333] resize-none"
                      required={mode === 'home_visit'}
                    />
                  </div>

                  {/* Special Notes / Instructions Input */}
                  <div>
                    <label className="text-[9px] font-black text-[#666] uppercase tracking-[0.2em] ml-1 block mb-2">Special Notes & Instructions (Optional)</label>
                    <textarea
                      value={clientNotes}
                      onChange={(e) => setClientNotes(e.target.value)}
                      placeholder="E.g. gate code instructions, preferred styling details or warnings..."
                      rows={2}
                      className="w-full bg-[#0b0b0e] border border-border-muted rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-brand/40 transition-all placeholder:text-[#333] resize-none"
                    />
                  </div>
                </div>
              </motion.div>
            ) : step === 5 ? (
                <motion.div key="step5" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="text-center py-6">
                    <div className="w-20 h-20 bg-brand/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-brand/10">
                        <CreditCard className="w-10 h-10 text-brand" />
                    </div>
                    <h3 className="text-2xl font-light text-white mb-2 tracking-tight">Payment & <span className="text-brand italic font-serif">Escrow</span></h3>
                    <p className="text-[#888] text-sm max-w-xs mx-auto mb-6 leading-relaxed font-medium">
                        Funds will be held in escrow via <span className="text-white font-bold tracking-tight">Paystack</span> and only released when you mark the service as complete.
                    </p>

                    {/* Select Secure Funding Source Section */}
                    <div className="text-left mb-6">
                      <div className="flex items-center gap-1.5 mb-3">
                        <Lock className="w-3.5 h-3.5 text-brand" />
                        <label className="text-[9px] font-black text-[#666] uppercase tracking-[0.2em]">Select Secure Funding Source</label>
                      </div>
                      <div className="grid grid-cols-1 gap-2.5">
                        {/* Option 1: Credit / Debit Card */}
                        <button
                          type="button"
                          onClick={() => setFundingSource('card')}
                          className={`p-3.5 rounded-xl border flex items-center justify-between text-left transition-all ${fundingSource === 'card' ? 'border-brand bg-brand/5' : 'border-border-muted bg-[#0b0b0e] hover:border-white/10'}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${fundingSource === 'card' ? 'bg-brand/10 text-brand' : 'bg-white/5 text-[#555]'}`}>
                              <CreditCard className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white">Debit / Credit Card</p>
                              <p className="text-[9px] text-[#555] font-mono uppercase tracking-widest mt-0.5">Pay with Visa, Mastercard, Verve</p>
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${fundingSource === 'card' ? 'border-brand' : 'border-[#444]'}`}>
                            {fundingSource === 'card' && <div className="w-2 h-2 rounded-full bg-brand" />}
                          </div>
                        </button>

                        {/* Option 2: Instant Bank Transfer */}
                        <button
                          type="button"
                          onClick={() => setFundingSource('bank')}
                          className={`p-3.5 rounded-xl border flex items-center justify-between text-left transition-all ${fundingSource === 'bank' ? 'border-brand bg-brand/5' : 'border-border-muted bg-[#0b0b0e] hover:border-white/10'}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${fundingSource === 'bank' ? 'bg-brand/10 text-brand' : 'bg-white/5 text-[#555]'}`}>
                              <Building className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white">Instant Bank Transfer</p>
                              <p className="text-[9px] text-[#555] font-mono uppercase tracking-widest mt-0.5">Secure Escrow Transfer via Providus Bank</p>
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${fundingSource === 'bank' ? 'border-brand' : 'border-[#444]'}`}>
                            {fundingSource === 'bank' && <div className="w-2 h-2 rounded-full bg-brand" />}
                          </div>
                        </button>

                        {/* Option 3: BarbMe Wallet Escrow */}
                        <button
                          type="button"
                          onClick={() => setFundingSource('wallet')}
                          className={`p-3.5 rounded-xl border flex items-center justify-between text-left transition-all ${fundingSource === 'wallet' ? 'border-brand bg-brand/5' : 'border-border-muted bg-[#0b0b0e] hover:border-white/10'}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${fundingSource === 'wallet' ? 'bg-brand/10 text-brand' : 'bg-white/5 text-[#555]'}`}>
                              <Wallet className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white">BarbMe Wallet Escrow</p>
                              <p className="text-[9px] text-[#555] font-mono uppercase tracking-widest mt-0.5">Balance: ₦0.00 (Insufficient Funds)</p>
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${fundingSource === 'wallet' ? 'border-brand' : 'border-[#444]'}`}>
                            {fundingSource === 'wallet' && <div className="w-2 h-2 rounded-full bg-brand" />}
                          </div>
                        </button>
                      </div>

                      {fundingSource === 'wallet' && (
                        <div className="mt-2.5 p-3.5 bg-red-500/5 border border-red-500/10 rounded-xl text-[10px] text-red-400 font-medium leading-relaxed">
                          ⚠️ Insufficient balance to fund escrow. Fallback billing via Paystack card gateway will activate during securement.
                        </div>
                      )}
                    </div>

                    <div className="bg-bg-surface p-6 rounded-2xl border border-border-muted mb-8 text-left space-y-4">
                        <div>
                            <p className="text-[8px] font-black text-[#444] uppercase tracking-widest mb-1.5">Selected Offer</p>
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                <span className="text-[#a1a1a1] italic font-serif lowercase normal-case text-sm">{activeServiceObj?.name || 'Service'}</span>
                                <span className="text-white">{activeServiceObj?.price || '₦5,500'}</span>
                            </div>
                        </div>

                        <div>
                            <p className="text-[8px] font-black text-[#444] uppercase tracking-widest mb-1.5">Schedule</p>
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                <span className="text-[#a1a1a1]">Appointment</span>
                                <span className="text-white">{selectedDate.toLocaleDateString()} @ {selectedTime}</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mt-1">
                                <span className="text-[#a1a1a1]">Delivery mode</span>
                                <span className="text-brand">{mode === 'home_visit' ? 'Home Visit' : 'In-Shop'}</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mt-1">
                                <span className="text-[#a1a1a1]">Funding source</span>
                                <span className="text-brand">SECURE: {fundingSource === 'card' ? 'Debit/Credit Card' : fundingSource === 'bank' ? 'Bank Transfer' : 'Escrow Wallet'}</span>
                            </div>
                        </div>

                        {(mode === 'home_visit' || (clientName || clientPhone)) && (
                            <div className="border-t border-border-muted pt-3">
                                <p className="text-[8px] font-black text-[#444] uppercase tracking-widest mb-1.5">Client Information</p>
                                <div className="space-y-1">
                                    {(clientName || clientPhone) && (
                                        <div className="flex justify-between text-[10px] font-medium text-[#ccc]">
                                            <span>{clientName || 'Guest'}</span>
                                            <span>{clientPhone || 'N/A'}</span>
                                        </div>
                                    )}
                                    {mode === 'home_visit' && clientAddress && (
                                        <div className="text-[9px] text-[#888] italic break-all leading-relaxed bg-[#0b0b0e] p-2 rounded-lg border border-white/[0.02] mt-1">
                                            <MapPin className="w-3 h-3 inline-block shrink-0 mr-1 text-brand -mt-0.5" /> {clientAddress}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between text-sm border-t border-border-muted pt-3 font-black">
                            <span className="text-white tracking-tight italic font-serif">Total Amount</span>
                            <span className="text-brand">{activeServiceObj?.price || '₦5,500'}</span>
                        </div>
                    </div>
                    
                    <div className="bg-brand/5 border border-brand/20 rounded-xl p-4 flex gap-3 text-left">
                        <ShieldCheck className="w-5 h-5 text-brand shrink-0" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-brand mb-1">Cancellation Policy</p>
                            <p className="text-[9px] text-brand/70 font-medium leading-relaxed">
                                Free cancellation up to 2 hours before the appointment. After that, a 50% fee applies.
                            </p>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                   <div className="w-24 h-24 bg-brand/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-brand/10">
                       <CheckCircle2 className="w-12 h-12 text-brand" />
                   </div>
                   <h2 className="text-3xl font-light text-white mb-4 tracking-tighter italic font-serif">Booking Received!</h2>
                   <p className="text-[#888] text-sm mb-12 max-w-xs mx-auto leading-relaxed font-medium">
                        The professional has <span className="text-white font-bold">15 minutes</span> to confirm your request. You'll be notified via app and SMS.
                   </p>
                   <button onClick={onClose} className="w-full py-5 bg-brand text-bg-deep rounded-xl font-bold uppercase tracking-widest text-sm shadow-2xl">
                     Confirm & Close
                   </button>
                </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        {step < 6 && (
            <div className="px-8 py-6 bg-bg-sidebar border-t border-border-muted flex items-center justify-between">
                <div>
                  {step > 1 ? (
                    <button onClick={handleBack} className="p-3 text-[#555] hover:text-white transition-colors">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  ) : (
                    <p className="text-[10px] font-black text-[#555] uppercase tracking-widest">
                        Step {mode === 'shop' && step === 5 ? 4 : step} of {mode === 'shop' ? 4 : 5}
                    </p>
                  )}
                </div>
                <button 
                    disabled={isStepInvalid || isProcessing}
                    onClick={handleNext}
                    className="flex items-center gap-2 px-8 py-3 bg-brand text-bg-deep rounded-xl font-bold uppercase tracking-widest text-[10px] hover:opacity-90 transition-all shadow-lg shadow-brand/10 disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95"
                >
                    {isProcessing ? (
                      <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      >
                        <Clock className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <>{step === 5 ? 'Pay Now' : 'Continue'} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                    )}
                </button>
            </div>
        )}
      </motion.div>
    </div>
  );
};
