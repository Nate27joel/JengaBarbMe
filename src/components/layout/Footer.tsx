import { Link } from 'react-router-dom';
import { Scissors, Phone, ChartArea, StepBack } from 'lucide-react';
import { ChatWindow } from '../chat/ChatWindow';

export const Footer = () => {
  return (
    <footer className="bg-[#050505] border-t border-[#121212] text-gray-400 py-16 px-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(196,164,124,0.15)]">
              <h1 className="text-bg-deep font-serif font-extrabold text-[30px] items-center">B</h1>
            </div>
              <span className="text-xl font-bold text-white tracking-tight">BarbMe</span>
            </Link>
            <p className="max-w-sm mb-6 leading-relaxed text-gray-400">
              Nigeria's  platform for verified hair professionals. Making hair services safe, accessible, and reliable and affordable for everyone.
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
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-xs flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 BarbMe. Built for Nigeria. Powered by JengaTech.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
