import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Cloud, Globe, ShieldCheck, Smartphone, Users, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { Feature } from '../types';

const features: Feature[] = [
  {
    title: "Domain Kustom",
    description: "Dapatkan subdomain gratis (sekolah.eslims.my.id) atau gunakan domain sekolah Anda sendiri.",
    icon: Globe
  },
  {
    title: "Teknologi Multi-Tenant",
    description: "Arsitektur cloud modern yang memisahkan data antar perpustakaan secara aman dan efisien.",
    icon: Users
  },
  {
    title: "Backup Harian",
    description: "Data katalog, anggota, dan sirkulasi Anda dibackup otomatis setiap hari ke cloud storage terenkripsi.",
    icon: ShieldCheck
  },
  {
    title: "Selalu Update",
    description: "Tidak perlu pusing update manual. Kami memastikan SLiMS Anda selalu menggunakan versi terbaru.",
    icon: Zap
  },
  {
    title: "Mobile Friendly",
    description: "Tampilan OPAC (Online Public Access Catalog) yang responsif dan mudah diakses dari smartphone siswa.",
    icon: Smartphone
  },
  {
    title: "Server Indonesia",
    description: "Server berlokasi di Indonesia untuk akses cepat (low latency) dan mematuhi regulasi data.",
    icon: Cloud
  }
];

const Features: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection Observer for animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Optional: Disconnect if you only want it to run once
          // observer.disconnect(); 
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setItemsPerPage(3);
      else if (window.innerWidth >= 768) setItemsPerPage(2);
      else setItemsPerPage(1);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Ensure index is valid when itemsPerPage changes
    const maxIndex = Math.max(0, features.length - itemsPerPage);
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [itemsPerPage, currentIndex]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => {
      const maxIndex = features.length - itemsPerPage;
      if (prev >= maxIndex) return 0;
      return prev + 1;
    });
  }, [itemsPerPage]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => {
      const maxIndex = features.length - itemsPerPage;
      if (prev === 0) return maxIndex;
      return prev - 1;
    });
  }, [itemsPerPage]);

  const goToSlide = (index: number) => {
    const maxIndex = Math.max(0, features.length - itemsPerPage);
    setCurrentIndex(Math.min(index, maxIndex));
  };

  return (
    <section 
      id="features" 
      ref={sectionRef} 
      className="py-24 bg-white relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Animated Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-primary-600 font-semibold tracking-wide uppercase text-sm mb-3">Fitur Unggulan</h2>
          <h3 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-6">
            Kenapa Memilih CloudSLiMS?
          </h3>
          <p className="text-lg text-slate-600">
            Kami mengubah cara sekolah mengelola perpustakaan. Tinggalkan server fisik yang mahal dan beralih ke solusi SaaS yang hemat biaya.
          </p>
        </div>

        {/* Animated Carousel Container */}
        <div className={`relative group/carousel px-0 md:px-4 transition-all duration-1000 delay-200 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="overflow-hidden p-4 -m-4">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
            >
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex-shrink-0 px-4"
                  style={{ width: `${100 / itemsPerPage}%` }}
                >
                  <div 
                    className="h-full group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-900/5 transition-all duration-300"
                  >
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center text-primary-600 mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                      <feature.icon size={24} />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
                    <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Navigation Arrows */}
          <button 
            onClick={prevSlide}
            className="absolute top-1/2 -left-4 lg:-left-12 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg border border-slate-200 text-slate-600 hover:text-primary-600 hover:border-primary-200 transition-all z-10 hidden md:flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute top-1/2 -right-4 lg:-right-12 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg border border-slate-200 text-slate-600 hover:text-primary-600 hover:border-primary-200 transition-all z-10 hidden md:flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>

          {/* Mobile Navigation Arrows (Bottom) */}
           <div className="flex md:hidden justify-center gap-4 mt-6">
              <button onClick={prevSlide} className="p-3 rounded-full bg-white shadow-md border border-slate-200 text-slate-600"><ChevronLeft size={20} /></button>
              <button onClick={nextSlide} className="p-3 rounded-full bg-white shadow-md border border-slate-200 text-slate-600"><ChevronRight size={20} /></button>
           </div>
        </div>

        {/* Dots */}
        <div className={`flex justify-center mt-8 gap-2 transition-opacity duration-700 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {Array.from({ length: features.length - itemsPerPage + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`rounded-full transition-all duration-300 ${
                idx === currentIndex 
                  ? 'bg-primary-600 w-8 h-2.5' 
                  : 'bg-slate-300 hover:bg-slate-400 w-2.5 h-2.5'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;