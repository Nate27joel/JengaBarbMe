import React from 'react';
import { motion } from 'motion/react';
import { Quote, Star } from 'lucide-react';

const TESTIMONIALS = [
   {
    name: "GodsPower",
    role: "Regular Client",
    text: "The home visit service is a game changer for my busy schedule. Quality is top-notch every single time.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100"
  },
  {
    name: "Sarah Alabi",
    role: "Fashion Stylist",
    text: "Finally a platform that verifies pros. I found my regular braider here and she is absolutely talented.",
    image: "https://images.unsplash.com/photo-1507152832244-10d45c7eda57?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YmxhY2slMjBwZXJzb258ZW58MHx8MHx8fDA%3D"
  },
  {
    name: "Dayo Johnson",
    role: "Professional Barber",
    text: "As a pro, BarbMe has helped me reach clients I never would have found otherwise. The app is seamless.",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100"
  }
];

export const Testimonials = () => {
  return (
    <section className="py-32 bg-bg-deep border-t border-border-muted overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <span className="text-brand text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Testimonials</span>
          <h2 className="text-5xl font-light text-white tracking-tight italic font-serif">What our <span className="text-brand">Community</span> says.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-bg-sidebar p-10 rounded-2xl border border-border-muted relative group hover:border-brand/30 transition-all duration-500 shadow-2xl"
            >
              <div className="absolute -top-6 left-10 w-12 h-12 bg-brand rounded-xl flex items-center justify-center shadow-xl shadow-brand/20">
                <Quote className="text-bg-deep w-6 h-6" />
              </div>
              
              <div className="mb-8 flex gap-1">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-brand fill-current" />)}
              </div>

              <p className="text-white text-lg font-light leading-relaxed mb-10 italic font-serif opacity-90">"{t.text}"</p>
              
              <div className="flex items-center gap-4 border-t border-border-muted pt-8">
                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-xl object-cover border border-border-muted" />
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight leading-none mb-1">{t.name}</h4>
                  <p className="text-[9px] font-black text-brand uppercase tracking-widest">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
