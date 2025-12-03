import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import AiLibrarian from './components/AiLibrarian';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import RegistrationModal from './components/RegistrationModal';

const App: React.FC = () => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('Starter');

  const openRegistration = (plan: string = 'Starter') => {
    setSelectedPlan(plan);
    setIsRegisterOpen(true);
  };

  // Mitra Data Structure
  const partners = [
    { 
      name: "LP Ma'arif Purwokerto", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/6/62/Logo_Lembaga_Pendidikan_Ma%27arif_Nahdlatul_Ulama.png" 
    },
    { 
      name: "LP Ma'arif Cilacap", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/6/62/Logo_Lembaga_Pendidikan_Ma%27arif_Nahdlatul_Ulama.png" 
    },
    { 
      name: "Yayasan Bakii Kesugihan", 
      // Using a generated placeholder that looks like a logo since public URL might be unstable
      logo: "https://ui-avatars.com/api/?name=YB&background=2563eb&color=fff&size=128&bold=true&rounded=true"
    },
    { 
      name: "Kampus UNUGHA Cilacap", 
      // Using a generated placeholder that looks like a logo since public URL might be unstable
      logo: "https://ui-avatars.com/api/?name=UNU&background=16a34a&color=fff&size=128&bold=true&rounded=true" 
    }
  ];

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, name: string) => {
    const parent = e.currentTarget.parentElement;
    if (parent) {
      e.currentTarget.style.display = 'none';
      parent.innerText = name.charAt(0);
      parent.className = "h-16 w-16 mb-3 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500 text-xl";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar onRegister={() => openRegistration('Starter')} />
      <main>
        <Hero onRegister={() => openRegistration('Starter')} />
        <Features />
        <AiLibrarian />
        <Pricing onRegister={openRegistration} />
        
        {/* Mitra Section - Infinite Scrolling Marquee */}
        <section className="py-12 bg-white border-t border-slate-100 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
             <div className="text-center">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Dipercaya Oleh</h2>
            </div>
          </div>
          
          <div className="relative flex overflow-x-hidden group">
             {/* Gradient Masks for Smooth Fade In/Out */}
             <div className="absolute top-0 bottom-0 left-0 w-24 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
             <div className="absolute top-0 bottom-0 right-0 w-24 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>

             <div className="flex animate-infinite-scroll group-hover:paused w-max">
               {/* First Loop */}
               {partners.map((mitra, idx) => (
                 <div key={`p1-${idx}`} className="mx-8 flex flex-col items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100 cursor-pointer">
                    <div className="h-16 w-16 mb-3 relative flex items-center justify-center">
                      <img 
                        src={mitra.logo} 
                        alt={`Logo ${mitra.name}`} 
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => handleImageError(e, mitra.name)}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-600 text-center max-w-[150px]">{mitra.name}</span>
                 </div>
               ))}
               
               {/* Second Loop (Duplicate for seamless scroll) */}
               {partners.map((mitra, idx) => (
                 <div key={`p2-${idx}`} className="mx-8 flex flex-col items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100 cursor-pointer">
                    <div className="h-16 w-16 mb-3 relative flex items-center justify-center">
                      <img 
                        src={mitra.logo} 
                        alt={`Logo ${mitra.name}`} 
                        className="max-h-full max-w-full object-contain"
                         onError={(e) => handleImageError(e, mitra.name)}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-600 text-center max-w-[150px]">{mitra.name}</span>
                 </div>
               ))}
               
               {/* Third Loop (Extra Buffer for wide screens) */}
               {partners.map((mitra, idx) => (
                 <div key={`p3-${idx}`} className="mx-8 flex flex-col items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100 cursor-pointer">
                    <div className="h-16 w-16 mb-3 relative flex items-center justify-center">
                      <img 
                        src={mitra.logo} 
                        alt={`Logo ${mitra.name}`} 
                        className="max-h-full max-w-full object-contain"
                         onError={(e) => handleImageError(e, mitra.name)}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-600 text-center max-w-[150px]">{mitra.name}</span>
                 </div>
               ))}
             </div>
          </div>
        </section>

        {/* FAQ Section (Simple embedded) */}
        <section id="faq" className="py-24 bg-slate-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900">Pertanyaan Umum</h2>
            </div>
            <div className="space-y-4">
              {[
                { q: "Apakah saya perlu menginstall sesuatu?", a: "Tidak sama sekali. CloudSLiMS berjalan 100% di browser. Anda hanya perlu mendaftar dan langsung bisa login." },
                { q: "Apakah data saya aman?", a: "Ya. Kami menggunakan enkripsi SSL standar perbankan dan melakukan backup data harian ke server terpisah." },
                { q: "Bisakah saya migrasi data dari SLiMS lokal?", a: "Tentu! Tim support kami akan membantu proses migrasi database SQL (.sql) dan folder images Anda ke cloud kami secara gratis." },
                { q: "Apakah ini SLiMS resmi?", a: "Kami adalah penyedia layanan hosting (SaaS) yang menggunakan software open source SLiMS. Kami berkontribusi balik ke komunitas SLiMS." }
              ].map((item, i) => (
                <div key={i} className="border border-slate-200 rounded-lg p-6 bg-white hover:shadow-md transition-all">
                  <h3 className="font-bold text-slate-900 mb-2">{item.q}</h3>
                  <p className="text-slate-600">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
      
      <RegistrationModal 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)}
        selectedPlan={selectedPlan}
      />
    </div>
  );
};

export default App;