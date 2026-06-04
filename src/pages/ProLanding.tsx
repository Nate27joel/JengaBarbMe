import { motion } from 'motion/react';
import { Scissors, DollarSign, Clock, ShieldCheck, ArrowRight, Star, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProLanding = () => {
  return (
    <div className="pt-24 min-h-screen bg-bg-deep text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-24">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-brand/5 blur-[120px] rounded-full -z-10" />
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand/10 border border-brand/20 rounded-full text-brand text-[10px] font-black uppercase tracking-[0.2em] mb-12"
          >
            <Scissors className="w-4 h-4" /> 
            Professional Platform
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-light tracking-tight italic font-serif mb-8 leading-[1.1]"
          >
            Earn More. <span className="text-brand">Style Better.</span> <br/> 
            Work Smarter.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-xl mx-auto text-[#666] text-sm uppercase font-black tracking-widest leading-relaxed mb-12"
          >
            Join Nigeria's fastest growing community of verified hair professionals. Get booked, get paid, and grow your brand.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/auth" className="w-full sm:w-auto px-12 py-5 bg-brand text-bg-deep rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-brand/20 hover:scale-105 transition-transform flex items-center justify-center gap-2">
              Apply to Join <ArrowRight className="w-4 h-4" />
            </Link>
            <button className="w-full sm:w-auto px-12 py-5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-colors">
              How it works
            </button>
          </motion.div>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="max-w-7xl mx-auto px-6 py-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              icon: DollarSign,
              title: "Financial Control",
              p: "Set your own prices and get paid instantly. Our automated escrow keeps your payments secure."
            },
            {
              icon: Clock,
              title: "True Flexibility",
              p: "Work on your terms. Manage your own schedule, block out time, and define your service radius."
            },
            {
              icon: TrendingUp,
              title: "Growth Tools",
              p: "Access detailed analytics, client insights, and marketing tools built to scale your business."
            }
          ].map((item, idx) => (
             <motion.div
               key={idx}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: idx * 0.1 }}
               className="bg-bg-surface border border-border-muted p-12 rounded-[40px] hover:border-brand/30 transition-all group"
             >
               <div className="w-16 h-16 bg-brand/5 border border-brand/20 rounded-[24px] flex items-center justify-center mb-10 group-hover:bg-brand group-hover:scale-110 transition-all">
                 <item.icon className="w-8 h-8 text-brand group-hover:text-bg-deep transition-colors" />
               </div>
               <h3 className="text-3xl font-light italic font-serif mb-6">{item.title}</h3>
               <p className="text-xs font-black text-[#555] uppercase tracking-widest leading-loose">
                 {item.p}
               </p>
             </motion.div>
          ))}
        </div>
      </div>

      {/* Trust Section */}
      <div className="max-w-7xl mx-auto px-6 py-32 border-t border-border-muted overflow-hidden">
         <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2">
                <span className="text-brand text-[10px] font-black uppercase tracking-[0.2em] mb-4 block">The BarbMe Standard</span>
                <h2 className="text-5xl font-light italic font-serif text-white mb-8">Join the elite rank of <span className="text-brand">verified</span> professionals.</h2>
                <div className="space-y-6 mb-12">
                  {[
                    "Identity & Criminal Record Verification",
                    "Professional Certification Check",
                    "Portfolio & Style Auditing",
                    "Hygiene & Equipment Standards"
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <ShieldCheck className="w-5 h-5 text-brand" />
                      <span className="text-xs font-black uppercase tracking-widest text-[#888]">{text}</span>
                    </div>
                  ))}
                </div>
                <Link to="/auth" className="inline-flex items-center gap-2 px-10 py-4 bg-white text-bg-deep rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand transition-colors">
                  Start Application <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
            <div className="lg:w-1/2 relative">
                <div className="absolute inset-0 bg-brand/10 blur-[100px] rounded-full -z-10" />
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-4 pt-12">
                      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcrv08U8D8jcxwx7EnWv2WlsPvkw7BoUpUAw&s" className="w-full h-80 object-cover rounded-3xl grayscale" />
                      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWhSQXXACOMpOjxnzhQeZeDzFNgTsvZ5oqjg&s" className="w-full h-64 object-cover rounded-3xl" />
                   </div>
                   <div className="space-y-4">
                      <img src="data:image/jpeg;base64,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" className="w-full h-64 object-cover rounded-3xl grayscale-[0.5]" />
                      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1V6mEOY8QwmflH5glI6500XmTUaacUCX1Tg&s" className="w-full h-80 object-cover rounded-3xl" />
                   </div>
                </div>
                <div className="absolute -bottom-10 -left-10 bg-bg-surface border border-border-muted p-8 rounded-3xl shadow-2xl">
                    <div className="flex items-center gap-2 text-brand mb-2">
                        {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-brand" />)}
                    </div>
                    <p className="text-lg font-light italic font-serif text-white mb-2">"BarbMe doubled my monthly bookings in 3 months."</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand">— Marcus, Master Barber</p>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};
