import React from 'react';
import { ArrowRight, MessageCircle, Rocket } from 'lucide-react';

interface CallToActionProps {
  onRegister: () => void;
  onContact: () => void;
}

const CallToAction: React.FC<CallToActionProps> = ({ onRegister, onContact }) => {
  return (
    <section className="relative py-20 bg-gradient-to-br from-primary-600 to-indigo-800 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
        
        {/* Abstract Pattern */}
        <svg className="absolute top-10 right-10 text-white/10 w-32 h-32 transform rotate-12" fill="currentColor" viewBox="0 0 24 24">
           <path d="M12 0L14.5 9H24L16.5 14.5L19 24L12 18.5L5 24L7.5 14.5L0 9H9.5L12 0Z" />
        </svg>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          Siap Memodernisasi <br className="hidden md:block" />
          Perpustakaan Sekolah Anda?
        </h2>
        
        <p className="text-lg md:text-xl text-primary-100 mb-10 max-w-2xl mx-auto leading-relaxed">
          Jangan biarkan administrasi manual menghambat layanan perpustakaan. 
          Bergabunglah dengan ratusan sekolah yang telah beralih ke <strong>CloudSLiMS</strong> hari ini.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onRegister}
            className="w-full sm:w-auto px-8 py-4 bg-white text-primary-700 font-bold rounded-full shadow-xl hover:bg-slate-50 hover:scale-105 hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <Rocket size={20} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
            <span>Coba Gratis 14 Hari</span>
          </button>
          
          <button 
            onClick={onContact}
            className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm"
          >
            <MessageCircle size={20} />
            <span>Konsultasi Sales</span>
          </button>
        </div>

        <p className="mt-8 text-sm text-primary-200/80">
          Tanpa Kartu Kredit • Setup Instan • Batal Kapan Saja
        </p>
      </div>
    </section>
  );
};

export default CallToAction;