import React, { useState, useEffect, useCallback } from 'react';
import { Quote, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import AiLibrarian from './components/AiLibrarian';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import RegistrationModal from './components/RegistrationModal';
import ContactModal from './components/ContactModal';
import CallToAction from './components/CallToAction';
import UserDashboard from './components/Dashboard/UserDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import { supabase } from './services/supabaseClient';
import { UserProfile } from './types';

const App: React.FC = () => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('Starter');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  
  // Auth State
  const [session, setSession] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Testimonial State
  const [testiIndex, setTestiIndex] = useState(0);
  const [testiItemsPerPage, setTestiItemsPerPage] = useState(1);
  const [isTestiPaused, setIsTestiPaused] = useState(false);

  // 1. Check Session on Mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setSession(session);
        if (session) {
          await fetchProfile(session.user.id);
        } else {
          setLoadingAuth(false);
        }
      } catch (error) {
        console.warn("Auth check failed (likely due to missing credentials):", error);
        setLoadingAuth(false);
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else {
        setUserProfile(null);
        setLoadingAuth(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (!error && data) setUserProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUserProfile(null);
  };

  const openRegistration = (plan: string = 'Starter') => {
    setSelectedPlan(plan);
    setAuthMode('register');
    setIsRegisterOpen(true);
  };

  const openLogin = () => {
    setAuthMode('login');
    setIsRegisterOpen(true);
  };

  const openContact = () => {
    setIsContactOpen(true);
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
      logo: "https://ui-avatars.com/api/?name=Yayasan+Bakii&background=0f172a&color=fff&size=128&bold=true"
    },
    { 
      name: "Kampus UNUGHA Cilacap", 
      logo: "https://ui-avatars.com/api/?name=UNUGHA&background=16a34a&color=fff&size=128&bold=true" 
    }
  ];

  // Testimonials Data
  const testimonials = [
    {
      name: "Ahmad Zulkarnain",
      role: "Kepala Perpustakaan",
      school: "SMK Ma'arif NU 1",
      quote: "Migrasi ke CloudSLiMS adalah keputusan terbaik. Tidak perlu lagi memikirkan maintenance server fisik yang ribet. Pustakawan jadi lebih fokus melayani siswa.",
      image: "https://i.pravatar.cc/150?u=1"
    },
    {
      name: "Siti Rahmawati",
      role: "Staff Pustakawan",
      school: "SMP Islam Al-Azhar",
      quote: "Fitur AI Librarian-nya sangat futuristik! Siswa jadi lebih tertarik mencari buku. Tampilan OPAC-nya juga sangat mobile-friendly dan responsif.",
      image: "https://i.pravatar.cc/150?u=5"
    },
    {
      name: "Budi Santoso",
      role: "Operator Sekolah",
      school: "SD Negeri 1 Jakarta",
      quote: "Supportnya juara. Awalnya ragu mindahin database SLiMS lama, tapi dibantu tim teknis sampai beres. Sekarang data aman dibackup harian otomatis.",
      image: "https://i.pravatar.cc/150?u=8"
    },
    {
      name: "Rina Kusuma",
      role: "Dosen Pustaka",
      school: "Universitas Terbuka",
      quote: "Sangat membantu untuk manajemen koleksi digital. Fitur laporannya lengkap dan mudah dipahami oleh staf administrasi kami.",
      image: "https://i.pravatar.cc/150?u=12"
    },
    {
      name: "Drs. Haryanto",
      role: "Kepala Sekolah",
      school: "SMA Negeri 5 Bandung",
      quote: "Hemat biaya operasional sekolah. Tidak perlu beli server mahal, cukup langganan tahunan dengan harga yang sangat terjangkau.",
      image: "https://i.pravatar.cc/150?u=3"
    }
  ];

  // Responsive Carousel Logic
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setTestiItemsPerPage(3);
      else if (window.innerWidth >= 768) setTestiItemsPerPage(2);
      else setTestiItemsPerPage(1);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-play Logic
  useEffect(() => {
    if (isTestiPaused) return;

    const interval = setInterval(() => {
      setTestiIndex((prev) => {
        const maxIndex = testimonials.length - testiItemsPerPage;
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [testiItemsPerPage, isTestiPaused, testimonials.length]);

  const nextTesti = useCallback(() => {
    setTestiIndex((prev) => {
      const maxIndex = testimonials.length - testiItemsPerPage;
      return prev >= maxIndex ? 0 : prev + 1;
    });
  }, [testiItemsPerPage, testimonials.length]);

  const prevTesti = useCallback(() => {
    setTestiIndex((prev) => {
      const maxIndex = testimonials.length - testiItemsPerPage;
      return prev === 0 ? maxIndex : prev - 1;
    });
  }, [testiItemsPerPage, testimonials.length]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, name: string) => {
    const img = e.currentTarget;
    const parent = img.parentElement;
    
    if (parent) {
      img.style.display = 'none';
      const words = name.split(' ').filter(w => w.length > 0);
      const initials = words.slice(0, 2).map(word => word[0]).join('').toUpperCase();
      parent.textContent = initials;
      parent.className = "h-16 w-16 mb-3 bg-gradient-to-br from-slate-50 to-slate-200 border border-slate-300 rounded-full flex items-center justify-center font-bold text-slate-600 text-lg shadow-sm select-none";
    }
  };

  // ------------------------------------------------------------------
  // VIEW RENDER LOGIC
  // ------------------------------------------------------------------

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-600" size={40} />
      </div>
    );
  }

  // If Logged In: Show Dashboard based on Role
  if (session && userProfile) {
    if (userProfile.role === 'admin') {
      return <AdminDashboard onLogout={handleLogout} />;
    } else {
      return <UserDashboard user={userProfile} onLogout={handleLogout} />;
    }
  }

  // If Not Logged In: Show Landing Page
  return (
    <div className="min-h-screen bg-white">
      {/* Pass openLogin to Navbar to handle existing 'Login' needs if any */}
      <Navbar onRegister={() => openRegistration('Starter')} onContact={openContact} /> 
      
      {/* Add a floating Login Button for demo purposes if not present in Navbar */}
      <div className="fixed top-24 right-4 z-40 md:hidden">
        <button onClick={openLogin} className="bg-slate-900 text-white px-4 py-2 rounded-full shadow text-xs font-bold">
           Member Login
        </button>
      </div>

      <main>
        <Hero onRegister={() => openRegistration('Starter')} />
        <Features />
        <AiLibrarian />
        <Pricing onRegister={openRegistration} />
        
        {/* Mitra Section */}
        <section className="py-12 bg-white border-t border-slate-100 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
             <div className="text-center">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Dipercaya Oleh</h2>
            </div>
          </div>
          
          <div className="relative flex overflow-x-hidden group">
             <div className="absolute top-0 bottom-0 left-0 w-24 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
             <div className="absolute top-0 bottom-0 right-0 w-24 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>

             <div className="flex animate-infinite-scroll group-hover:paused w-max">
               {[...partners, ...partners, ...partners].map((mitra, idx) => (
                 <div key={`${mitra.name}-${idx}`} className="mx-8 flex flex-col items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100 cursor-pointer group/item">
                    <div className="h-16 w-16 mb-3 relative flex items-center justify-center transition-transform group-hover/item:scale-110">
                      <img 
                        src={mitra.logo} 
                        alt={`Logo Partner ${mitra.name}`} 
                        loading="lazy"
                        decoding="async"
                        width="64"
                        height="64"
                        className="max-h-full max-w-full object-contain drop-shadow-sm"
                        onError={(e) => handleImageError(e, mitra.name)}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-600 text-center max-w-[150px] leading-tight">{mitra.name}</span>
                 </div>
               ))}
             </div>
          </div>
        </section>

        {/* FAQ Section */}
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
                <article key={i} className="border border-slate-200 rounded-lg p-6 bg-white hover:shadow-md transition-all">
                  <h3 className="font-bold text-slate-900 mb-2">{item.q}</h3>
                  <p className="text-slate-600">{item.a}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-24 bg-white border-t border-slate-200 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-sm font-bold text-primary-600 uppercase tracking-widest mb-3">Testimoni</h2>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Apa Kata Mereka?</h3>
              <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                Pengalaman nyata dari pustakawan dan kepala sekolah yang telah memodernisasi perpustakaan mereka menggunakan CloudSLiMS.
              </p>
            </div>
            
            <div 
              className="relative group/carousel px-0 sm:px-8"
              onMouseEnter={() => setIsTestiPaused(true)}
              onMouseLeave={() => setIsTestiPaused(false)}
            >
              {/* Carousel Track */}
              <div className="overflow-hidden p-4 -m-4">
                <div 
                  className="flex transition-transform duration-500 ease-out will-change-transform"
                  style={{ transform: `translateX(-${testiIndex * (100 / testiItemsPerPage)}%)` }}
                >
                  {testimonials.map((testi, idx) => (
                    <div 
                      key={idx} 
                      className="flex-shrink-0 px-4"
                      style={{ width: `${100 / testiItemsPerPage}%` }}
                    >
                      <div className="h-full bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 relative group flex flex-col">
                        <div className="absolute top-6 right-8 text-primary-100 group-hover:text-primary-200 transition-colors">
                          <Quote size={40} className="fill-current" />
                        </div>
                        <p className="text-slate-600 mb-8 relative z-10 italic leading-relaxed flex-1">"{testi.quote}"</p>
                        <div className="flex items-center gap-4 mt-auto">
                          <div className="relative shrink-0">
                            <img 
                              src={testi.image} 
                              alt={`Foto profil ${testi.name}`} 
                              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                            />
                            <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{testi.name}</h4>
                            <p className="text-xs text-slate-500 mb-0.5 line-clamp-1">{testi.role}</p>
                            <p className="text-xs text-primary-600 font-medium line-clamp-1">{testi.school}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Arrows */}
              <button 
                onClick={prevTesti}
                className="absolute top-1/2 left-0 sm:-left-4 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg border border-slate-200 text-slate-600 hover:text-primary-600 hover:border-primary-200 transition-all z-10 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 focus:opacity-100"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={nextTesti}
                className="absolute top-1/2 right-0 sm:-right-4 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg border border-slate-200 text-slate-600 hover:text-primary-600 hover:border-primary-200 transition-all z-10 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 focus:opacity-100"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CallToAction 
          onRegister={() => openRegistration('Starter')} 
          onContact={openContact} 
        />

      </main>
      <Footer onContact={openContact} />
      <ScrollToTop />
      
      <RegistrationModal 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)}
        selectedPlan={selectedPlan}
        initialMode={authMode}
      />
      <ContactModal 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
};

export default App;