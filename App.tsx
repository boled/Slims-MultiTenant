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

  return (
    <div className="min-h-screen bg-white">
      <Navbar onRegister={() => openRegistration('Starter')} />
      <main>
        <Hero onRegister={() => openRegistration('Starter')} />
        <Features />
        <AiLibrarian />
        <Pricing onRegister={openRegistration} />
        
        {/* FAQ Section (Simple embedded) */}
        <section id="faq" className="py-24 bg-white">
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
                <div key={i} className="border border-slate-200 rounded-lg p-6 bg-slate-50 hover:bg-white transition-colors">
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