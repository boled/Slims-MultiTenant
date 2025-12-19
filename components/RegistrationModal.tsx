import React, { useState, useEffect } from 'react';
import { X, BookOpen, Loader2, ArrowRight, LogIn } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan?: string;
  initialMode?: 'login' | 'register';
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose, selectedPlan, initialMode = 'register' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (mode === 'register') {
        // 1. Sign Up
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (authError) throw authError;

        if (authData.user) {
          // 2. Create Profile
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([{
              id: authData.user.id,
              full_name: formData.name,
              institution: formData.institution,
              subdomain: formData.subdomain,
              phone: formData.phone,
              role: 'user' // Default role
            }]);

          if (profileError) throw profileError;

          // 3. Create Subscription Record
          let price = 0;
          if (formData.plan === 'Starter') price = 150000;
          if (formData.plan === 'Pro') price = 350000;

          const { error: subError } = await supabase
            .from('subscriptions')
            .insert([{
              user_id: authData.user.id,
              plan_name: formData.plan,
              price: price,
              status: 'pending'
            }]);

          if (subError) throw subError;

          alert("Registrasi berhasil! Silakan login.");
          setMode('login');
        }
      } else {
        // Login Logic
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        onClose(); // Parent App.tsx will detect session change
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up max-h-[90vh] overflow-y-auto">
        <div className="bg-primary-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <BookOpen size={20} />
            <span className="font-bold text-lg">{mode === 'register' ? 'Registrasi Akun' : 'Login Member'}</span>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-primary-500"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleAuth} className="p-6 space-y-4">
          {errorMsg && (
            <div className="bg-red-50 text-red-600 p-3 rounded text-sm border border-red-200">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input 
              type="email"
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password"
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                <input 
                  type="text"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Instansi</label>
                <input 
                  type="text"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none"
                  value={formData.institution}
                  onChange={(e) => setFormData({...formData, institution: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subdomain</label>
                <div className="flex">
                  <input 
                    type="text"
                    required
                    className="flex-1 px-4 py-2 rounded-l-lg border border-slate-300 border-r-0 focus:ring-2 focus:ring-primary-500 outline-none lowercase"
                    value={formData.subdomain}
                    onChange={(e) => setFormData({...formData, subdomain: e.target.value.replace(/[^a-z0-9-]/g, '')})}
                  />
                  <span className="bg-slate-100 border border-slate-300 px-3 py-2 text-slate-500 rounded-r-lg text-sm flex items-center">
                    .eslims.my.id
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp</label>
                <input 
                  type="tel"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Paket</label>
                <select 
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none"
                  value={formData.plan}
                  onChange={(e) => setFormData({...formData, plan: e.target.value})}
                >
                  <option value="Starter">Starter - Rp 150rb</option>
                  <option value="Pro">Pro - Rp 350rb</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>
            </>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all mt-4 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (mode === 'register' ? <ArrowRight size={20} /> : <LogIn size={20} />)}
            {mode === 'register' ? 'Daftar Sekarang' : 'Masuk Dashboard'}
          </button>
          
          <div className="text-center pt-2">
            <button 
              type="button"
              onClick={() => setMode(mode === 'register' ? 'login' : 'register')}
              className="text-sm text-primary-600 hover:underline"
            >
              {mode === 'register' ? 'Sudah punya akun? Login' : 'Belum punya akun? Daftar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationModal;