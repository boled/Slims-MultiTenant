import React from 'react';
import { ArrowRight, CheckCircle2, Search, User, Menu } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-primary-100/40 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-indigo-100/40 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-xs font-semibold uppercase tracking-wide mb-6">
              <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse"></span>
              Versi Multi-Tenant Terbaru
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
              Kelola Perpustakaan <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">
                Tanpa Ribet Server
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Platform SLiMS (Senayan Library Management System) berbasis cloud. 
              Satu akun, subdomain instan, tanpa instalasi manual. Fokus pada pustaka, biarkan kami urus teknologinya.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-all shadow-xl shadow-primary-600/20 flex items-center justify-center gap-2 group">
                Buat Perpustakaan
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-semibold transition-all flex items-center justify-center">
                Lihat Demo
              </button>
            </div>

            <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-sm text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-500" />
                <span>Setup Instan</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-500" />
                <span>Backup Otomatis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-500" />
                <span>Akses Mobile</span>
              </div>
            </div>
          </div>

          <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
            {/* Browser Mockup Window */}
            <div className="relative rounded-xl bg-white shadow-2xl border border-slate-200 overflow-hidden transform transition-transform hover:scale-[1.01] duration-500">
              {/* Browser Toolbar */}
              <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center gap-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 bg-white border border-slate-200 rounded-md py-1 px-3 text-xs text-slate-500 text-center font-mono flex items-center justify-center gap-2">
                  <span className="text-green-600">🔒</span>
                  https://sdn1jkt.cloudslims.id
                </div>
              </div>

              {/* SLiMS Interface Mockup */}
              <div className="bg-slate-50 min-h-[400px]">
                {/* SLiMS Header */}
                <div className="bg-slate-800 text-white px-6 py-3 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-serif font-bold italic">S</div>
                    <span className="font-semibold text-sm hidden sm:inline">Perpustakaan SDN 1 Jakarta</span>
                  </div>
                  <div className="flex gap-4 text-xs font-medium text-slate-300">
                    <span className="hover:text-white cursor-pointer hidden sm:inline">Beranda</span>
                    <span className="hover:text-white cursor-pointer hidden sm:inline">Informasi</span>
                    <span className="flex items-center gap-1 bg-blue-600 px-3 py-1 rounded-full text-white hover:bg-blue-500 cursor-pointer">
                      <User size={12} /> Login Pustakawan
                    </span>
                  </div>
                </div>

                {/* SLiMS Hero / Search Area */}
                <div className="bg-gradient-to-br from-blue-900 to-indigo-900 px-6 py-12 text-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                  <h3 className="text-white text-xl md:text-2xl font-bold mb-2 relative z-10">Selamat Datang di Perpustakaan Digital</h3>
                  <p className="text-blue-200 text-xs md:text-sm mb-6 relative z-10">Telusuri koleksi buku kami dengan mudah dan cepat</p>
                  
                  {/* Search Box - Signature SLiMS Feature */}
                  <div className="max-w-md mx-auto bg-white rounded-lg p-1.5 flex shadow-lg relative z-10">
                    <div className="hidden sm:flex items-center px-3 border-r border-slate-200 text-slate-500 text-xs gap-1 cursor-pointer hover:bg-slate-50">
                      <span>Semua</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                    <input 
                      type="text" 
                      placeholder="Judul, Pengarang, atau ISBN..." 
                      className="flex-1 px-3 py-2 text-sm text-slate-800 focus:outline-none"
                    />
                    <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded transition-colors">
                      <Search size={16} />
                    </button>
                  </div>
                </div>

                {/* SLiMS Content / Book Grid */}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-slate-700 text-sm border-l-4 border-blue-500 pl-2">Koleksi Terpopuler</h4>
                    <span className="text-xs text-blue-600 cursor-pointer">Lihat Semua</span>
                  </div>
                  
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                     {[1, 2, 3, 4].map((i) => (
                       <div key={i} className="group cursor-pointer">
                         <div className={`aspect-[2/3] rounded shadow-sm mb-2 relative overflow-hidden ${
                           i === 1 ? 'bg-orange-100' : i === 2 ? 'bg-blue-100' : i === 3 ? 'bg-green-100' : 'bg-purple-100'
                         }`}>
                            {/* Faux Book Cover Design */}
                            <div className="absolute inset-x-2 top-4 bottom-0 border-t-2 border-l border-r border-white/30 bg-black/5"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full px-2">
                              <div className="w-8 h-8 mx-auto mb-2 opacity-50 bg-slate-900/10 rounded-full"></div>
                              <div className="h-2 w-16 mx-auto bg-slate-900/10 rounded mb-1"></div>
                              <div className="h-2 w-10 mx-auto bg-slate-900/10 rounded"></div>
                            </div>
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                         </div>
                         <div className="h-3 w-full bg-slate-200 rounded mb-1"></div>
                         <div className="h-2 w-2/3 bg-slate-100 rounded"></div>
                       </div>
                     ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 md:-right-12 bg-white p-4 rounded-xl shadow-xl border border-slate-100 animate-bounce-slow hidden sm:block">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg text-green-600">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Sistem Aktif</p>
                  <p className="text-xs text-slate-500">Uptime 99.9%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;