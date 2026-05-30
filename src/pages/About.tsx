import { motion } from 'motion/react';
import { Scissors, ShieldCheck, Star, Users } from 'lucide-react';

export const About = () => {
  return (
    <div className="pt-24 min-h-screen bg-bg-deep text-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <span className="text-brand text-[10px] font-black uppercase tracking-[0.2em] mb-4 block">Our Story</span>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight italic font-serif mb-6">
            Styling <span className="text-brand">Nigeria</span>
          </h1>
          <p className="text-[#666] text-sm uppercase font-black tracking-widest leading-relaxed max-w-2xl mx-auto">
            BarbMe is Nigeria's first premium marketplace connecting world-class hair professionals with clients who value precision and trust.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-bg-surface border border-border-muted p-10 rounded-3xl"
          >
            <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6 text-brand" />
            </div>
            <h3 className="text-2xl font-light italic font-serif mb-4">Verified Trust</h3>
            <p className="text-[11px] text-[#555] font-black uppercase tracking-widest leading-loose">
              Every professional on our platform undergoes a rigorous verification process. We check certifications, portfolios, and identity to ensure you're in safe hands.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-bg-surface border border-border-muted p-10 rounded-3xl"
          >
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-light italic font-serif mb-4">Community Focused</h3>
            <p className="text-[11px] text-[#555] font-black uppercase tracking-widest leading-loose">
              We're more than just a booking app. We're building a community of artists and clients who celebrate culture through style and grooming.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 p-12 bg-brand rounded-3xl text-bg-deep text-center"
        >
          <h2 className="text-3xl font-light italic font-serif mb-4">Join the Revolution</h2>
          <p className="text-xs font-black uppercase tracking-widest mb-8 opacity-80">
            Founded in Lagos, scaling across West Africa. Be part of the BarbMe journey.
          </p>
          <button className="px-10 py-4 bg-bg-deep text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">
            Get Started
          </button>
        </motion.div>
      </div>
    </div>
  );
};
