import React, { useState, useEffect } from 'react';
import { X, Send, BookOpen } from 'lucide-react';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan?: string;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose, selectedPlan }) => {
  const [formData, setFormData] = useState({
    name: '',
    institution: '',
    subdomain: '',
    phone: '',
    plan: 'Starter'
  });

  useEffect(() => {
    if (selectedPlan) {
      setFormData(prev => ({ ...prev, plan: selectedPlan }));
    }
  }, [selectedPlan]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const message = `Halo Admin CloudSLiMS, saya ingin mendaftar layanan:
    
👤 *Nama*: ${formData.name}
🏫 *Instansi*: ${formData.institution}
🌐 *Subdomain*: ${formData.subdomain}.cloudslims.id
📱 *No. WA*: ${formData.phone}
📦 *Paket*: ${formData.plan}

Mohon info selanjutnya. Terima kasih.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/6285647818779?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        <div className="bg-primary-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <BookOpen size={20} />
            <span className="font-bold text-lg">Form Registrasi</span>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-primary-500"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
            <input 
              type="text"
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              placeholder="Contoh: Budi Santoso"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Instansi / Sekolah</label>
            <input 
              type="text"
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              placeholder="Contoh: SDN 1 Jakarta"
              value={formData.institution}
              onChange={(e) => setFormData({...formData, institution: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Subdomain (Alamat Website)</label>
            <div className="flex">
              <input 
                type="text"
                required
                className="flex-1 px-4 py-2 rounded-l-lg border border-slate-300 border-r-0 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all lowercase"
                placeholder="namasekolah"
                value={formData.subdomain}
                onChange={(e) => setFormData({...formData, subdomain: e.target.value.replace(/[^a-z0-9-]/g, '')})}
              />
              <span className="bg-slate-100 border border-slate-300 px-3 py-2 text-slate-500 rounded-r-lg text-sm flex items-center">
                .cloudslims.id
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Hanya huruf kecil, angka, dan strip (-).</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nomor WhatsApp</label>
            <input 
              type="tel"
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              placeholder="085xxx"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Paket</label>
            <select 
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              value={formData.plan}
              onChange={(e) => setFormData({...formData, plan: e.target.value})}
            >
              <option value="Starter">Starter - Rp 150rb/tahun</option>
              <option value="Pro">Pro - Rp 350rb/tahun</option>
              <option value="Enterprise">Enterprise - Hubungi Kami</option>
            </select>
          </div>

          <button 
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 transition-all mt-4 hover:scale-[1.02]"
          >
            <Send size={18} />
            Daftar Sekarang via WhatsApp
          </button>
          
          <p className="text-center text-xs text-slate-400 mt-2">
            Anda akan diarahkan ke WhatsApp Admin CloudSLiMS.
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegistrationModal;