import React from 'react';
import { Search, User, BookOpen, Globe, ArrowRight, KeyRound, Sparkles } from 'lucide-react';

interface HeroProps {
  onRegister: () => void;
}

const Hero: React.FC<HeroProps> = ({ onRegister }) => {
  return (
    <section className="relative pt-24 pb-12 bg-slate-100 min-h-screen flex flex-col">
      {/* SLiMS Classic Header Strip mimicking the top navigation bar */}
      <div className="bg-slate-800 text-slate-300 py-2 px-4 sm:px-8 text-xs font-medium flex justify-between items-center border-b border-slate-700">
        <div className="flex gap-4">
          <span className="hover:text-white cursor-pointer">Information</span>
          <span className="hover:text-white cursor-pointer">News</span>
          <span className="hover:text-white cursor-pointer">Help</span>
          <span className="hover:text-white cursor-pointer">Librarian</span>
        </div>
        <div className="flex gap-2 items-center">
          <Globe size={12} />
          <span>English</span>
          <span>|</span>
          <span className="text-white">Indonesian</span>
        </div>
      </div>

      {/* Main Banner / Search Area - Mimicking SLiMS Header */}
      <div className="bg-gradient-to-r from-blue-800 to-cyan-700 pt-16 pb-24 px-4 sm:px-8 shadow-lg relative overflow-hidden">
        {/* Abstract Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
          {/* Logo Simulation */}
          <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 border-2 border-white/20 shadow-xl">
             <BookOpen size={32} className="text-white" />
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 font-serif tracking-wide text-shadow-sm animate-fade-in-up">
            Senayan Library Management System
          </h1>
          <p className="text-blue-100 text-lg md:text-xl font-light mb-10 max-w-2xl">
            (Cloud Edition) - Multi-Tenant Library Automation
          </p>

          {/* SLiMS Classic Search Bar */}
          <div className="w-full max-w-3xl bg-white/10 p-2 rounded-lg backdrop-blur-md border border-white/20 shadow-2xl mb-8">
            <div className="flex flex-col sm:flex-row bg-white rounded-md overflow-hidden">
              <div className="hidden sm:flex items-center px-4 bg-slate-50 border-r border-slate-200 text-slate-500 text-sm font-medium">
                <select className="bg-transparent outline-none cursor-pointer">
                  <option>Judul</option>
                  <option>Pengarang</option>
                  <option>ISBN</option>
                  <option>Subjek</option>
                </select>
              </div>
              <input 
                type="text" 
                placeholder="Kata kunci pencarian..." 
                className="flex-1 px-6 py-4 text-slate-800 focus:outline-none placeholder:text-slate-400"
              />
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 font-bold flex items-center justify-center gap-2 transition-colors">
                <Search size={20} />
                <span>CARI</span>
              </button>
            </div>
            <div className="text-left mt-2 px-2 text-xs text-blue-200 flex gap-4">
              <span className="cursor-pointer hover:text-white underline decoration-dotted">Pencarian Spesifik</span>
              <span className="cursor-pointer hover:text-white underline decoration-dotted">Riwayat Pencarian</span>
            </div>
          </div>

          {/* New Prominent CTA */}
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-white/10 hover:bg-white/15 p-1.5 pr-6 pl-6 rounded-full backdrop-blur-md border border-white/20 transition-all animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
             <div className="flex items-center gap-2 text-blue-100 text-sm font-medium">
                <Sparkles size={16} className="text-yellow-400" />
                <span>Ingin punya website perpustakaan seperti ini?</span>
             </div>
             <button 
               onClick={onRegister}
               className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold px-6 py-2 rounded-full shadow-lg transition-all hover:scale-105 hover:shadow-yellow-400/20 flex items-center gap-2 text-sm"
             >
               Coba Gratis Sekarang <ArrowRight size={16} />
             </button>
          </div>
        </div>
      </div>

      {/* Main Content Split - Classic Layout (Info Left, Sidebar Right) */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left: Collections / Welcome (70%) */}
          <div className="flex-1 bg-white rounded-lg shadow-md border-t-4 border-blue-600 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-700 flex items-center gap-2">
                <BookOpen size={18} className="text-blue-600" />
                Koleksi Terpopuler & Terbaru
              </h3>
              <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">Lihat Selengkapnya</span>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                   <div key={i} className="group cursor-pointer">
                     <div className={`aspect-[2/3] rounded-md shadow-sm mb-3 relative overflow-hidden transition-transform group-hover:-translate-y-1 ${
                       i === 1 ? 'bg-orange-100' : i === 2 ? 'bg-indigo-100' : i === 3 ? 'bg-emerald-100' : 'bg-rose-100'
                     }`}>
                        {/* Faux Cover */}
                        <div className="absolute inset-y-0 left-0 w-2 bg-black/10 z-10"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="h-2 w-12 bg-black/10 mb-2 rounded-sm"></div>
                          <div className="h-16 w-full bg-white/40 backdrop-blur-sm rounded p-2">
                             <div className="h-2 w-full bg-slate-800/20 mb-1 rounded-sm"></div>
                             <div className="h-2 w-2/3 bg-slate-800/20 rounded-sm"></div>
                          </div>
                        </div>
                     </div>
                     <h4 className="font-bold text-slate-800 text-sm leading-tight mb-1 group-hover:text-blue-600">
                        {i === 1 ? "Laskar Pelangi" : i === 2 ? "Bumi Manusia" : i === 3 ? "Negeri 5 Menara" : "Pulang"}
                     </h4>
                     <p className="text-xs text-slate-500">Tere Liye</p>
                   </div>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-100 flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1">
                  <h4 className="font-bold text-blue-900 mb-2 text-lg">Selamat Datang di CloudSLiMS</h4>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    Solusi SLiMS berbasis cloud yang memudahkan sekolah mengelola perpustakaan. 
                    Tanpa ribet instalasi server, data aman, dan bisa diakses dari mana saja.
                  </p>
                  <div className="flex gap-2">
                     <span className="text-xs bg-white px-2 py-1 rounded border border-blue-200 text-blue-600 font-medium">#DigitalLibrary</span>
                     <span className="text-xs bg-white px-2 py-1 rounded border border-blue-200 text-blue-600 font-medium">#OpenSource</span>
                  </div>
                </div>
                <button 
                   onClick={onRegister}
                   className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-blue-600/20 transition-all text-sm whitespace-nowrap"
                >
                  Daftar Akun Baru
                </button>
              </div>
            </div>
          </div>

          {/* Right: Member Login Sidebar Simulation (30%) */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-lg shadow-md border-t-4 border-green-500 overflow-hidden sticky top-24">
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                  <User size={18} className="text-green-600" />
                  Area Anggota
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                   <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto flex items-center justify-center mb-2 text-slate-400">
                        <User size={32} />
                      </div>
                      <p className="text-xs text-slate-500">Silahkan login untuk reservasi buku.</p>
                   </div>
                   
                   <div className="space-y-3">
                     <div className="relative">
                       <input type="text" disabled placeholder="ID Anggota" className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded text-sm disabled:opacity-60" />
                       <User size={16} className="absolute left-3 top-2.5 text-slate-400" />
                     </div>
                     <div className="relative">
                       <input type="password" disabled placeholder="Kata Sandi" className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded text-sm disabled:opacity-60" />
                       <KeyRound size={16} className="absolute left-3 top-2.5 text-slate-400" />
                     </div>
                   </div>

                   <button 
                    onClick={onRegister}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition-colors text-sm shadow-md"
                   >
                     Login / Buat Akun
                   </button>
                   
                   <div className="text-center pt-2 border-t border-slate-100 mt-2">
                      <p className="text-xs text-slate-500 mb-2">Belum punya perpustakaan?</p>
                      <button 
                        onClick={onRegister}
                        className="text-xs font-bold text-green-600 hover:underline flex items-center justify-center gap-1 w-full"
                      >
                        DAFTAR CLOUDSLIMS <ArrowRight size={12} />
                      </button>
                   </div>
                </div>
              </div>
            </div>

            {/* Additional Sidebar Widget: Library Info */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-slate-200 p-4 hidden lg:block">
               <h4 className="font-bold text-slate-700 text-sm mb-3 border-b pb-2">Jam Layanan</h4>
               <ul className="text-sm text-slate-600 space-y-2">
                 <li className="flex justify-between"><span>Senin - Kamis</span> <span className="font-medium">08:00 - 16:00</span></li>
                 <li className="flex justify-between"><span>Jumat</span> <span className="font-medium">08:00 - 14:00</span></li>
                 <li className="flex justify-between text-red-500"><span>Sabtu - Minggu</span> <span className="font-medium">Tutup</span></li>
               </ul>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;