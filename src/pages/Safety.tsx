import { motion } from 'motion/react';
import { ShieldCheck, Lock, Eye, AlertCircle, CheckCircle2 } from 'lucide-react';

export const Safety = () => {
  return (
    <div className="pt-24 min-h-screen bg-bg-deep text-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <span className="text-brand text-[10px] font-black uppercase tracking-[0.2em] mb-4 block">Safety Center</span>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight italic font-serif mb-6">
            Your Safety is <span className="text-brand">Priority</span>
          </h1>
          <p className="text-[#666] text-sm uppercase font-black tracking-widest leading-relaxed max-w-2xl mx-auto">
            At BarbMe, we have built a secure environment for both clients and professionals.
          </p>
        </motion.div>

        <div className="space-y-8">
          {[
            {
              icon: ShieldCheck,
              title: "Verified Professionals",
              p: "Every barber and stylist is background-checked and identity-verified before they can accept bookings."
            },
            {
              icon: Lock,
              title: "Secure Payments",
              p: "Payments are held in escrow and only released to the professional after the service is successfully completed."
            },
            {
              icon: Eye,
              title: "Transparent Reviews",
              p: "Our double-blind review system ensures all feedback is genuine and helpful for the community."
            }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-start gap-8 p-10 bg-bg-surface border border-border-muted rounded-3xl"
            >
              <div className="w-14 h-14 bg-brand/5 border border-brand/20 rounded-2xl flex items-center justify-center shrink-0">
                <item.icon className="w-6 h-6 text-brand" />
              </div>
              <div>
                <h3 className="text-2xl font-light italic font-serif mb-4">{item.title}</h3>
                <p className="text-[11px] text-[#555] font-black uppercase tracking-widest leading-loose">
                  {item.p}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 border-t border-border-muted pt-20">
          <h2 className="text-3xl font-light italic font-serif mb-12 text-center">Safety Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-brand">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Do's</span>
              </div>
              <ul className="space-y-4 text-[10px] font-black text-[#555] uppercase tracking-widest">
                <li className="flex items-start gap-4 p-4 bg-bg-surface rounded-xl">01. Book through the platform for insurance</li>
                <li className="flex items-start gap-4 p-4 bg-bg-surface rounded-xl">02. Verify the professional's ID upon arrival</li>
                <li className="flex items-start gap-4 p-4 bg-bg-surface rounded-xl">03. Share your live location with a friend</li>
              </ul>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-red-500">
                <AlertCircle className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Don'ts</span>
              </div>
              <ul className="space-y-4 text-[10px] font-black text-[#555] uppercase tracking-widest">
                <li className="flex items-start gap-4 p-4 bg-red-500/5 rounded-xl">01. Never pay outside the BarbMe application</li>
                <li className="flex items-start gap-4 p-4 bg-red-500/5 rounded-xl">02. Don't share sensitive personal details</li>
                <li className="flex items-start gap-4 p-4 bg-red-500/5 rounded-xl">03. Don't ignore your intuition - report issues</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
