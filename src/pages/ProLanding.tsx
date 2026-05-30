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
                      <img src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=400" className="w-full h-80 object-cover rounded-3xl grayscale" />
                      <img src="https://images.unsplash.com/photo-1503910358245-42d57b39b173?q=80&w=400" className="w-full h-64 object-cover rounded-3xl" />
                   </div>
                   <div className="space-y-4">
                      <img src="https://images.unsplash.com/photo-1506794778242-aff80849ba61?q=80&w=400" className="w-full h-64 object-cover rounded-3xl grayscale-[0.5]" />
                      <img src="https://images.unsplash.com/photo-1593032465175-481ac7f40197?q=80&w=400" className="w-full h-80 object-cover rounded-3xl" />
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
