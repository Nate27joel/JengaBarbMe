import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scissors, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Clock, 
  ChevronRight,
  ArrowLeft,
  Zap,
  Tag,
  LayoutGrid,
  List as ListIcon,
  Eye,
  Check,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ServiceDetailsModal } from '../components/service/ServiceDetailsModal';
import { Service, Professional, User } from '../types';

export const ProfessionalServices = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Quick edit states
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editDuration, setEditDuration] = useState<number>(0);

  const startQuickEdit = (service: Service) => {
    setEditingServiceId(service.id);
    setEditPrice(service.price);
    setEditDuration(service.durationMinutes);
  };

  const cancelQuickEdit = () => {
    setEditingServiceId(null);
  };

  const saveQuickEdit = (id: string) => {
    setServices(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          price: Number(editPrice),
          durationMinutes: Number(editDuration)
        };
      }
      return s;
    }));
    setEditingServiceId(null);
  };

  const mockProUser: User = {
    id: 'u1',
    fullName: 'Boluwatife Adeyemi',
    email: 'bolu@example.com',
    phone: '08012345678',
    role: 'professional',
    isVerified: true,
    verificationStatus: 'verified',
    createdAt: new Date(),
    updatedAt: new Date(),
    avatarUrl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=100'
  };

  const mockProfessional: Professional & { user: User } = {
    id: '1',
    userId: 'u1',
    bio: 'Specialist in low fades and traditional Nigerian hairstyles.',
    categories: ['Barbers', 'Grooming'],
    yearsExperience: 5,
    serviceMode: 'both',
    latitude: 6.5244,
    longitude: 3.3792,
    avgRating: 4.9,
    totalReviews: 124,
    isAvailable: true,
    user: mockProUser
  };
  
  const [services, setServices] = useState<Service[]>([
    { id: 's1', professionalId: '1', category: 'mens_hair', name: 'Premium Fade', description: 'Experience the ultimate precision with our signature fade. Includes hot towel finish and line up.', price: 5500, durationMinutes: 45, isActive: true },
    { id: 's2', professionalId: '1', category: 'grooming', name: 'Beard Sculpture', description: 'Complete beard shaping, trimming, and conditioning with premium oils.', price: 3500, durationMinutes: 30, isActive: true },
    { id: 's3', professionalId: '1', category: 'mens_hair', name: 'Kids Haircut', description: 'Gentle and stylish haircuts for kids under 12.', price: 4000, durationMinutes: 30, isActive: true },
    { id: 's4', professionalId: '1', category: 'grooming', name: 'Executive Grooming', description: 'The works. Haircut, beard sculpture, facial, and scalp massage.', price: 12000, durationMinutes: 90, isActive: true },
  ]);

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pt-24 min-h-screen bg-bg-deep px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <button 
              onClick={() => navigate('/professional-dashboard')}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#444] hover:text-brand transition-colors mb-4 group"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </button>
            <h1 className="text-4xl font-light text-white tracking-tight italic font-serif">
              Service <span className="text-brand">Portfolio</span>
            </h1>
            <p className="text-[10px] text-[#555] font-black uppercase tracking-widest mt-2">
              Manage your offerings and pricing strategy
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-bg-surface p-1 rounded-xl border border-border-muted">
              <button 
                onClick={() => setView('grid')}
                className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-brand text-bg-deep' : 'text-[#444] hover:text-white'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setView('list')}
                className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-brand text-bg-deep' : 'text-[#444] hover:text-white'}`}
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
            <button className="flex items-center gap-3 px-6 py-3 bg-brand text-bg-deep rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-brand/20 hover:opacity-90 transition-all group active:scale-95">
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              Add New Service
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-bg-surface p-4 rounded-2xl border border-border-muted mb-8 flex flex-col md:flex-row gap-4">
           <div className="relative flex-1 group">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444] group-focus-within:text-brand transition-colors" />
             <input 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder="SEARCH SERVICES OR CATEGORIES..."
               className="w-full bg-bg-deep border border-border-muted rounded-xl pl-12 pr-4 py-3 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-brand/50 transition-all"
             />
           </div>
           <div className="flex gap-4">
              <button className="px-6 py-3 bg-bg-deep border border-border-muted rounded-xl text-[10px] font-black uppercase tracking-widest text-[#444] hover:text-white hover:border-brand/30 transition-all flex items-center gap-3">
                <Filter className="w-4 h-4" />
                Category
              </button>
              <button className="px-6 py-3 bg-bg-deep border border-border-muted rounded-xl text-[10px] font-black uppercase tracking-widest text-[#444] hover:text-white hover:border-brand/30 transition-all flex items-center gap-3">
                <Zap className="w-4 h-4" />
                Active Only
              </button>
           </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {view === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service, idx) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-bg-surface border border-border-muted rounded-3xl overflow-hidden group hover:border-brand/40 transition-all cursor-pointer"
                  onClick={() => setSelectedService(service)}
                >
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-bg-deep rounded-2xl border border-border-muted flex items-center justify-center group-hover:border-brand/20 transition-all">
                        <Scissors className="w-6 h-6 text-brand" />
                      </div>
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (editingServiceId === service.id) {
                              cancelQuickEdit();
                            } else {
                              startQuickEdit(service);
                            }
                          }}
                          className={`p-2 transition-colors ${editingServiceId === service.id ? 'text-brand' : 'text-[#444] hover:text-white'}`}
                          title="Quick Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setServices(prev => prev.filter(s => s.id !== service.id));
                          }}
                          className="p-2 text-[#444] hover:text-red-500 transition-colors"
                          title="Delete Service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-2">
                         <Tag className="w-3 h-3 text-[#333]" />
                         <span className="text-[9px] font-black text-[#555] uppercase tracking-widest">{service.category.replace('_', ' ')}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white tracking-tight mb-2 group-hover:text-brand transition-colors">{service.name}</h3>
                      
                      {editingServiceId === service.id ? (
                        <div className="space-y-3 mt-4 p-4 bg-bg-deep rounded-2xl border border-white/[0.03]" onClick={(e) => e.stopPropagation()}>
                          <div className="flex gap-3">
                            <div className="flex-1 space-y-1">
                              <label className="text-[8px] font-black text-[#666] uppercase tracking-widest pl-1">Duration</label>
                              <select 
                                value={editDuration}
                                onChange={(e) => setEditDuration(Number(e.target.value))}
                                className="w-full bg-[#0c0c0f] border border-white/[0.05] rounded-lg px-2 py-1.5 text-[10px] font-mono font-bold text-white outline-none focus:border-brand"
                              >
                                {[15, 30, 45, 60, 75, 90, 120, 150, 180].map(m => (
                                  <option key={m} value={m}>{m} Mins</option>
                                ))}
                              </select>
                            </div>
                            <div className="flex-1 space-y-1">
                              <label className="text-[8px] font-black text-[#666] uppercase tracking-widest pl-1">Price (₦)</label>
                              <input 
                                type="number"
                                value={editPrice}
                                onChange={(e) => setEditPrice(Number(e.target.value))}
                                className="w-full bg-[#0c0c0f] border border-white/[0.05] rounded-lg px-2 py-1.5 text-[10px] font-mono font-bold text-brand outline-none focus:border-brand"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.03]">
                            <button 
                              onClick={(e) => { e.stopPropagation(); cancelQuickEdit(); }}
                              className="px-3 py-1.5 bg-white/[0.02] border border-white/[0.04] text-[#888] hover:text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); saveQuickEdit(service.id); }}
                              className="px-3 py-1.5 bg-brand text-bg-deep font-black rounded-lg text-[9px] uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-1"
                            >
                              <Check className="w-3 h-3 stroke-[2.5]" /> Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[#666] text-xs leading-relaxed line-clamp-2 italic">"{service.description}"</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-border-muted" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                           <Clock className="w-3 h-3 text-[#444]" />
                           <span className="text-[10px] font-black text-white uppercase tracking-widest">
                             {editingServiceId === service.id ? editDuration : service.durationMinutes} MIN
                           </span>
                        </div>
                        <div className="flex items-center gap-4">
                           {editingServiceId === service.id ? (
                             <span className="text-[8px] font-black text-brand uppercase tracking-widest animate-pulse">
                               Editing Mode
                             </span>
                           ) : (
                             <span className="text-sm font-black text-brand uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1">
                                View <Eye className="w-3 h-3" />
                             </span>
                           )}
                           <span className="text-xl font-black text-white font-mono italic">
                             ₦{editingServiceId === service.id ? editPrice.toLocaleString() : service.price.toLocaleString()}
                           </span>
                        </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-bg-surface border border-border-muted rounded-3xl overflow-hidden">
               <table className="w-full text-left">
                  <thead>
                     <tr className="border-bottom border-border-muted bg-bg-deep/50">
                        <th className="px-8 py-4 text-[10px] font-black text-[#444] uppercase tracking-widest">Service</th>
                        <th className="px-8 py-4 text-[10px] font-black text-[#444] uppercase tracking-widest">Category</th>
                        <th className="px-8 py-4 text-[10px] font-black text-[#444] uppercase tracking-widest text-center">Duration</th>
                        <th className="px-8 py-4 text-[10px] font-black text-[#444] uppercase tracking-widest text-right">Price</th>
                        <th className="px-8 py-4 text-[10px] font-black text-[#444] uppercase tracking-widest text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody>
                      {filteredServices.map(service => (
                        <tr 
                          key={service.id} 
                          onClick={() => setSelectedService(service)}
                          className={`border-t border-border-muted transition-all group cursor-pointer ${editingServiceId === service.id ? 'bg-[#0f0f13]/80 border-brand/20' : 'hover:bg-bg-deep/30'}`}
                        >
                          <td className="px-8 py-6">
                             <span className="text-sm font-bold text-white block group-hover:text-brand transition-colors">{service.name}</span>
                             <span className="text-[9px] text-[#444] uppercase font-black truncate max-w-[200px] block mt-1">{service.description}</span>
                          </td>
                          <td className="px-8 py-6">
                             <span className="text-[10px] font-black text-[#555] uppercase tracking-widest">{service.category.replace('_', ' ')}</span>
                          </td>
                          <td className="px-8 py-6 text-center" onClick={(e) => e.stopPropagation()}>
                             {editingServiceId === service.id ? (
                               <select 
                                 value={editDuration}
                                 onChange={(e) => setEditDuration(Number(e.target.value))}
                                 className="bg-[#0c0c0f] border border-white/[0.05] rounded-lg px-2 py-1 text-[10px] font-mono font-bold text-white outline-none focus:border-brand inline-block w-20 text-center"
                               >
                                 {[15, 30, 45, 60, 75, 90, 120, 150, 180].map(m => (
                                   <option key={m} value={m}>{m}m</option>
                                 ))}
                               </select>
                             ) : (
                               <span className="text-[10px] font-black text-white uppercase tracking-widest">{service.durationMinutes}m</span>
                             )}
                          </td>
                          <td className="px-8 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                             {editingServiceId === service.id ? (
                               <div className="flex items-center justify-end gap-1">
                                 <span className="text-[#555] font-mono text-[10px]">₦</span>
                                 <input 
                                   type="number"
                                   value={editPrice}
                                   onChange={(e) => setEditPrice(Number(e.target.value))}
                                   className="bg-[#0c0c0f] border border-white/[0.05] rounded-l px-2 py-1 text-[10px] font-mono font-bold text-brand outline-none focus:border-brand w-20 text-right"
                                 />
                               </div>
                             ) : (
                               <span className="font-mono text-sm font-black text-white italic">₦{service.price.toLocaleString()}</span>
                             )}
                          </td>
                          <td className="px-8 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                             {editingServiceId === service.id ? (
                               <div className="flex justify-end gap-2">
                                 <button 
                                   onClick={(e) => { e.stopPropagation(); cancelQuickEdit(); }}
                                   className="px-2 py-1 bg-white/[0.02] border border-white/[0.04] text-[#888] hover:text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                                   title="Cancel"
                                 >
                                   Cancel
                                 </button>
                                 <button 
                                   onClick={(e) => { e.stopPropagation(); saveQuickEdit(service.id); }}
                                   className="px-2 py-1 bg-brand text-bg-deep font-black rounded-lg text-[9px] uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-1"
                                   title="Save Changes"
                                 >
                                   <Check className="w-2.5 h-2.5 stroke-[2.5]" /> Save
                                 </button>
                               </div>
                             ) : (
                               <div className="flex justify-end gap-3 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                                   <button 
                                     onClick={(e) => {
                                       e.stopPropagation();
                                       setSelectedService(service);
                                     }}
                                     className="p-2 text-[#444] hover:text-brand"
                                     title="View Details"
                                   >
                                     <Eye className="w-4 h-4" />
                                   </button>
                                   <button 
                                     onClick={(e) => {
                                       e.stopPropagation();
                                       startQuickEdit(service);
                                     }}
                                     className="p-2 text-[#444] hover:text-brand"
                                     title="Quick Edit"
                                   >
                                     <Edit2 className="w-4 h-4" />
                                   </button>
                                   <button 
                                     onClick={(e) => {
                                       e.stopPropagation();
                                       setServices(prev => prev.filter(s => s.id !== service.id));
                                     }}
                                     className="p-2 text-[#444] hover:text-red-500"
                                     title="Delete Service"
                                   >
                                     <Trash2 className="w-4 h-4" />
                                   </button>
                               </div>
                             )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
               </table>
            </div>
          )}
        </AnimatePresence>

        {filteredServices.length === 0 && (
          <div className="py-40 text-center border-2 border-dashed border-border-muted rounded-3xl">
             <Scissors className="w-12 h-12 text-[#222] mx-auto mb-6" />
             <h3 className="text-white font-bold text-xl mb-2">No services found</h3>
             <p className="text-[10px] text-[#444] font-black uppercase tracking-widest">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedService && (
          <ServiceDetailsModal
            isOpen={!!selectedService}
            onClose={() => setSelectedService(null)}
            service={selectedService}
            pro={mockProfessional}
            onBook={() => setSelectedService(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
