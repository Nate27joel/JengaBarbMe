import { Search, Clock, Scissors } from 'lucide-react';

export const Features = () => {
  const steps = [
    {
      title: "Discover Nearby",
      desc: "Browse a catalog of verified high-end professionals in your immediate area.",
      icon: Search,
      number: "01"
    },
    {
      title: "Secure Booking",
      desc: "Select your preferred service and secure your slot with instant confirmation.",
      icon: Clock,
      number: "02"
    },
    {
      title: "Premium Service",
      desc: "Elite grooming directly at your location or in a luxury studio setting.",
      icon: Scissors,
      number: "03"
    }
  ];

  return (
    <section className="py-24 bg-bg-deep relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20">
          <span className="text-brand text-[10px] font-black uppercase tracking-widest mb-3 block">Process</span>
          <h2 className="text-4xl font-light text-white mb-6 tracking-tight italic font-serif">The <span className="text-brand">BarbMe</span> Experience</h2>
          <p className="text-[#888] text-sm font-medium uppercase tracking-[0.2em] max-w-xl">A seamless connection to premium hair care, designed for the modern lifestyle.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-1px bg-border-muted border border-border-muted rounded-2xl overflow-hidden">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-bg-sidebar p-12 group hover:bg-bg-surface transition-colors duration-500 relative">
              <span className="absolute top-8 right-8 text-4xl font-light text-white/5 font-serif italic group-hover:text-brand/10 transition-colors">{step.number}</span>
              <div className="w-16 h-16 bg-bg-deep border border-border-muted rounded-2xl flex items-center justify-center mb-10 group-hover:border-brand/30 transition-colors shadow-2xl">
                <step.icon className="w-6 h-6 text-brand" />
              </div>
              <h3 className="text-xl font-light text-white mb-4 tracking-tight italic font-serif">{step.title}</h3>
              <p className="text-[#555] leading-relaxed text-sm font-medium uppercase tracking-widest text-[10px] group-hover:text-[#888] transition-colors">{step.desc}</p>
              
              <div className="mt-10 h-[1px] w-0 bg-brand group-hover:w-full transition-all duration-700" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
