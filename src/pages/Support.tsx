import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, MessageCircle, Phone, HelpCircle, ChevronDown } from 'lucide-react';

export const Support = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs = [
    {
      q: "How do I cancel my appointment?",
      a: "You can cancel your appointment up to 24 hours before the scheduled time through your Client Dashboard under the 'Bookings' section. Cancellations made within 24 hours may be subject to a partial fee determined by the hair professional's policy."
    },
    {
      q: "What is the late arrival policy?",
      a: "We recommend arriving or being ready 5–10 minutes before your scheduled appointment. Professionals generally allow a 15-minute grace period. If you are running later than 15 minutes, please message the professional directly via the chat feature on your dashboard."
    },
    {
      q: "Are home visits safe?",
      a: "Absolutely. Safety is our top priority. All professionals undergo thorough background & identity verification (NIN) and portfolio vetting before joining the platform. Both clients and professionals can view ratings, past reviews, and communicate safely directly through our built-in chat system."
    },
    {
      q: "How do I become a verified professional?",
      a: "To become a verified Barber or Stylist, sign up as a Professional through our Onboarding portal. You will need to provide valid identity verification (NIN), a portfolio of your recent work, details about your workspace or travel preferences, and complete our virtual verification screening."
    },
    {
      q: "Is my payment information secure?",
      a: "Yes. All transactions are securely processed through our end-to-end industry standard payment gateway. We never store your full card details on our servers, and payment is only released to the professional after the booking has been successfully completed and confirmed by you."
    }
  ];

  return (
    <div className="pt-24 min-h-screen bg-bg-deep text-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <span className="text-brand text-[10px] font-black uppercase tracking-[0.2em] mb-4 block">Help Center</span>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight italic font-serif mb-6">
            We're here to <span className="text-brand">Help</span>
          </h1>
          <p className="text-[#666] text-sm uppercase font-black tracking-widest leading-relaxed max-w-2xl mx-auto">
            Need assistance with a booking or account? Our support team is available 24/7.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            { icon: MessageCircle, label: "Live Chat", value: "Response: 5m", color: "brand" },
            { icon: Mail, label: "Email Support", value: "hello@barbme.app", color: "white" },
            { icon: Phone, label: "Call Us", value: "+234 800 BARBME", color: "white" }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-bg-surface border border-border-muted p-8 rounded-3xl text-center hover:border-brand/30 transition-all cursor-pointer group"
            >
              <div className={`w-12 h-12 bg-${item.color === 'brand' ? 'brand' : 'white'}/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                <item.icon className={`w-6 h-6 text-${item.color === 'brand' ? 'brand' : 'white'}`} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-[#444]">{item.label}</p>
              <p className="text-sm font-bold text-white">{item.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-bg-surface border border-border-muted rounded-3xl overflow-hidden mb-20">
          <div className="p-10 border-b border-border-muted">
             <h2 className="text-2xl font-light italic font-serif text-white">Frequently Asked Questions</h2>
          </div>
          <div className="divide-y divide-border-muted">
            {faqs.map((faq, i) => {
              const isOpen = openIdx === i;
              return (
                <div key={i} className="hover:bg-white/[0.01] transition-colors">
                  <button 
                    onClick={() => setOpenIdx(isOpen ? null : i)}
                    className="w-full flex items-center justify-between p-8 text-left group"
                  >
                    <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isOpen ? 'text-brand' : 'text-[#666] group-hover:text-white'}`}>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'text-brand rotate-180' : 'text-[#333] group-hover:text-white'}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-8 pb-8 text-xs text-[#a0a0b2] leading-relaxed font-light font-sans max-w-3xl">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center p-12 bg-white/5 rounded-3xl border border-white/5">
           <HelpCircle className="w-10 h-10 text-brand mx-auto mb-6" />
           <h3 className="text-xl font-light italic font-serif mb-4 text-white">Still have questions?</h3>
           <p className="text-[10px] font-black text-[#555] uppercase tracking-widest mb-8">Send us a message and we'll get back to you immediately.</p>
           <button className="px-10 py-4 bg-brand text-bg-deep rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand/10">
              Submit a Ticket
           </button>
        </div>
      </div>
    </div>
  );
};
