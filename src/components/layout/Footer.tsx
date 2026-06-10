import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

export const Footer = () => {
  const [modalType, setModalType] = useState(null); // 'privacy' | 'terms' | null

  // --- Legal Content Data ---
  const legalContent = {
    privacy: {
      title: "Privacy Policy",
      lastUpdated: "January 2025",
      sections: [
        {
          heading: "1. Information We Collect",
          body: "We collect information you provide directly to us when you create an account, such as your name, phone number, and location. We also collect professional details from barbers including certifications and shop locations."
        },
        {
          heading: "2. How We Use Information",
          body: "Information is used to facilitate bookings, verify professional credentials, and ensure the safety of both clients and service providers on the BarbMe platform."
        },
        {
          heading: "3. Data Sharing",
          body: "We do not sell your personal data. We share information between clients and barbers only to the extent necessary to complete a service appointment."
        }
      ]
    },
    terms: {
      title: "Terms of Service",
      lastUpdated: "January 2025",
      sections: [
        {
          heading: "1. Acceptance of Terms",
          body: "By accessing BarbMe, you agree to be bound by these terms. Our platform serves as a marketplace connecting hair professionals with clients."
        },
        {
          heading: "2. User Responsibilities",
          body: "Clients must provide accurate booking information. Barbers must provide verified professional services. Any misconduct may lead to immediate account suspension."
        },
        {
          heading: "3. Payments & Cancellations",
          body: "BarbMe facilitates safe connections. Cancellation policies are set by individual barbers. Payments made through the platform are subject to our processing partner's terms."
        }
      ]
    }
  };

  return (
    <footer className="bg-[#050505] border-t border-[#121212] text-gray-400 py-16 px-4 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(196,164,124,0.15)]">
              <h1 className="text-bg-deep font-serif font-extrabold text-[30px] items-center">B</h1>
            </div>
            <span className="text-2xl font-light tracking-tight text-white">Barb<span className="text-brand italic font-serif ml-0.5">Me</span></span>
          </Link>
            <p className="max-w-sm mb-6 leading-relaxed text-gray-400">
              Nigeria's platform for verified hair professionals. Making hair services safe, accessible, reliable, and affordable for everyone.
            </p>
          </div>
          
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-6 italic">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/pro" className="hover:text-white transition-colors">Become a Barber</Link></li>
              <li><Link to="/safety" className="hover:text-white transition-colors">Safety Center</Link></li>
              <li><Link to="/support" className="hover:text-white transition-colors">Contact Support</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 italic">Top Cities</h4>
            <ul className="space-y-4 text-sm font-sans uppercase tracking-widest text-[10px] opacity-60">
              <li>Lagos</li>
              <li>Abuja</li>
              <li>Port Harcourt</li>
              <li>Enugu</li>
              <li>Aba</li>
              <li>Kano</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-xs flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500">© 2025 BarbMe. Built for Nigeria. Powered by JengaTech.</p>
          
          <div className="flex gap-8">
            <button 
              onClick={() => setModalType('privacy')}
              className="hover:text-white transition-colors uppercase tracking-widest font-bold text-[10px] cursor-pointer"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => setModalType('terms')}
              className="hover:text-white transition-colors uppercase tracking-widest font-bold text-[10px] cursor-pointer"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>

      {/* --- Legal Modal Overlay --- */}
      {modalType && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setModalType(null)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-[#121212] border border-white/10 w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="sticky top-0 bg-[#121212] border-b border-white/5 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">{legalContent[modalType].title}</h2>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Last Updated: {legalContent[modalType].lastUpdated}</p>
              </div>
              <button 
                onClick={() => setModalType(null)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              {legalContent[modalType].sections.map((section, idx) => (
                <div key={idx}>
                  <h3 className="text-white font-bold mb-3 italic">{section.heading}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{section.body}</p>
                </div>
              ))}
              
              <div className="pt-8 border-t border-white/5 text-[10px] text-gray-600 text-center uppercase tracking-widest">
                End of {legalContent[modalType].title}
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;