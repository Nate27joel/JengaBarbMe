import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Scissors, Menu, X, LogOut, ChevronDown, User, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { QuickSettingsModal } from '../dashboard/QuickSettingsModal';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    setIsProfileOpen(false);
    navigate('/');
  };

  return (
    <nav className="fixed w-full z-50 bg-bg-deep/80 backdrop-blur-md border-b border-border-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(196,164,124,0.15)]">
              <h1 className="text-bg-deep font-serif font-extrabold text-[30px] items-center">B</h1>
            </div>
            <span className="text-2xl font-light tracking-tight text-white">Barb<span className="text-brand italic font-serif ml-0.5">Me</span></span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link to="/discover" className="text-xs uppercase tracking-widest font-medium text-[#888] hover:text-brand transition-colors">Discover</Link>
            <Link to="/barbers" className="text-xs uppercase tracking-widest font-medium text-[#888] hover:text-brand transition-colors">Barbers</Link>
            <Link to="/offers" className="text-xs uppercase tracking-widest font-medium text-[#888] hover:text-brand transition-colors">Offers</Link>
            {user && (
              <Link 
                to={user.role === 'professional' ? '/pro/dashboard' : '/client/dashboard'} 
                className="text-xs uppercase tracking-widest font-medium text-brand hover:text-brand/80 transition-colors"
              >
                Dashboard
              </Link>
            )}
            
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 pl-3 pr-2 py-1.5 bg-bg-sidebar border border-border-muted rounded-full hover:border-brand/40 transition-all"
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden border border-border-muted">
                    <img src={user.avatarUrl} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{user.fullName.split(' ')[0]}</span>
                  <ChevronDown className={`w-3 h-3 text-[#444] transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 bg-bg-sidebar border border-border-muted rounded-2xl shadow-2xl p-2 z-[60]"
                    >
                      <Link 
                        to={user.role === 'professional' ? '/pro/dashboard' : '/client/dashboard'}
                        className="flex items-center gap-3 p-3 text-[#888] hover:text-white hover:bg-bg-surface rounded-xl transition-all group"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="w-4 h-4 group-hover:text-brand" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Dashboard</span>
                      </Link>
                      {user.role === 'professional' && (
                        <Link 
                          to="/pro/services"
                          className="flex items-center gap-3 p-3 text-[#888] hover:text-white hover:bg-bg-surface rounded-xl transition-all group"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Scissors className="w-4 h-4 group-hover:text-brand" />
                          <span className="text-[10px] font-black uppercase tracking-widest">My Services</span>
                      </Link>
                      )}
                      <button 
                        onClick={() => {
                          setShowSettings(true);
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-3 p-3 text-[#888] hover:text-white hover:bg-bg-surface rounded-xl transition-all group"
                      >
                        <Settings className="w-4 h-4 group-hover:text-brand" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Settings</span>
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-500/5 rounded-xl transition-all group"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/auth" className="px-6 py-2 bg-brand text-bg-deep rounded-md text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-lg shadow-brand/10">
                Sign In
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-[#888]">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-bg-sidebar border-b border-border-muted overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              <Link to="/discover" className="block text-sm uppercase tracking-widest font-medium text-white" onClick={() => setIsOpen(false)}>Discover</Link>
              <Link to="/barbers" className="block text-sm uppercase tracking-widest font-medium text-white" onClick={() => setIsOpen(false)}>Barbers</Link>
              <Link to="/offers" className="block text-sm uppercase tracking-widest font-medium text-white" onClick={() => setIsOpen(false)}>Offers</Link>
              {user && (
                <Link 
                  to={user.role === 'professional' ? '/pro/dashboard' : '/client/dashboard'} 
                  className="block text-sm uppercase tracking-widest font-medium text-brand" 
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              
              {user ? (
                <button 
                  onClick={handleLogout}
                  className="w-full py-4 bg-red-500/10 text-red-500 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              ) : (
                <Link to="/auth" className="w-full py-4 bg-brand text-bg-deep rounded-xl font-bold uppercase tracking-widest flex items-center justify-center" onClick={() => setIsOpen(false)}>
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <QuickSettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        initialTab="account"
      />
    </nav>
  );
};
