import React from 'react';
import { motion } from 'motion/react';
import { X, DollarSign, TrendingUp, Scissors, User, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface EarningsBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalEarnings: string;
}

export const EarningsBreakdownModal: React.FC<EarningsBreakdownModalProps> = ({ isOpen, onClose, totalEarnings }) => {
  if (!isOpen) return null;

  const earningsByService = [
    { service: 'Premium Fade', amount: 15500, count: 3 },
    { service: 'Beard Sculpture', amount: 7000, count: 2 },
    { service: 'Traditional Braids', amount: 12000, count: 1 },
    { service: 'Hair Coloring', amount: 10500, count: 1 },
  ];

  const recentTransactions = [
    { id: 't1', date: 'Today, 10:45 AM', client: 'Adesola Bello', service: 'Fade + Beard Trim', amount: 5500, status: 'Success' },
    { id: 't2', date: 'Yesterday, 04:20 PM', client: 'Chidi Nwosu', service: 'Traditional Braids', amount: 12000, status: 'Success' },
    { id: 't3', date: '10 May, 02:15 PM', client: 'Tunde Raji', service: 'Hair Coloring', amount: 8500, status: 'Success' },
    { id: 't4', date: '09 May, 06:00 PM', client: 'Grace E.', service: 'Silk Press', amount: 15000, status: 'Payout' },
  ];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-bg-deep/90 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-bg-surface rounded-3xl border border-border-muted overflow-hidden shadow-2xl"
      >
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-2xl font-light text-white tracking-tight italic font-serif">Earnings <span className="text-brand">Breakdown</span></h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#555] mt-2 flex items-center gap-2">
                This Week • <span className="text-brand">{totalEarnings} Total</span>
              </p>
            </div>
            <button onClick={onClose} className="p-2 text-[#444] hover:text-white transition-colors bg-bg-deep/50 rounded-full backdrop-blur-md">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Left: Service Breakdown */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#444] italic">Revenue by Service</h4>
              <div className="space-y-4">
                {earningsByService.map((s, idx) => (
                  <div key={idx} className="bg-bg-deep p-4 rounded-2xl border border-border-muted group hover:border-brand/20 transition-all">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        < Scissors className="w-3 h-3 text-brand" />
                        <span className="text-xs font-bold text-white tracking-tight">{s.service}</span>
                      </div>
                      <span className="font-mono text-xs font-black text-white italic">₦{s.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-black text-[#444] uppercase tracking-widest">{s.count} Bookings</span>
                      <div className="w-24 h-1 bg-bg-sidebar rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand" 
                          style={{ width: `${(s.amount / 45000) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Quick Stats & Filter */}
            <div className="space-y-8">
                <div className="bg-brand/5 border border-brand/10 p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <TrendingUp className="w-5 h-5 text-brand" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand">Growth Insights</span>
                    </div>
                    <p className="text-[#888] text-xs leading-relaxed italic">
                        "Your revenue is up 12% compared to last week. Weekends remain your most profitable period, accounting for 62% of your income."
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-bg-deep p-4 rounded-xl border border-border-muted">
                        <p className="text-[8px] font-black text-[#444] uppercase tracking-widest mb-1">Avg. Job</p>
                        <p className="text-lg font-black text-white font-mono italic">₦1,607</p>
                    </div>
                    <div className="bg-bg-deep p-4 rounded-xl border border-border-muted">
                        <p className="text-[8px] font-black text-[#444] uppercase tracking-widest mb-1">Tax Est.</p>
                        <p className="text-lg font-black text-white font-mono italic">₦3,375</p>
                    </div>
                </div>
            </div>
          </div>

          <div>
             <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#444] italic mb-6">Recent Transactions</h4>
             <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {recentTransactions.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-4 bg-bg-sidebar/30 border border-border-muted rounded-xl hover:border-brand/20 transition-all">
                    <div className="flex items-center gap-4">
                       <div className={`p-2 rounded-lg ${t.status === 'Payout' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                          {t.status === 'Payout' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                       </div>
                       <div>
                          <p className="text-xs font-bold text-white tracking-tight">{t.status === 'Payout' ? 'Wallet Withdrawal' : t.client}</p>
                          <p className="text-[8px] font-black text-[#444] uppercase tracking-widest mt-0.5">{t.date}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className={`text-xs font-black font-mono italic ${t.status === 'Payout' ? 'text-red-500' : 'text-green-500'}`}>
                          {t.status === 'Payout' ? '-' : '+'}₦{t.amount.toLocaleString()}
                       </p>
                       <span className="text-[8px] font-black text-[#333] uppercase tracking-widest">{t.status}</span>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
