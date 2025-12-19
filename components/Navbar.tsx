import React, { useState, useEffect } from 'react';
import { BookOpen, Menu, X, Bot, Sparkles, LogIn } from 'lucide-react';
import ChatWidget from './ChatWidget';

interface NavbarProps {
  onRegister: () => void;
  onLogin: () => void;
  onContact?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onRegister, onLogin, onContact }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Fitur', href: '#features' },
    { name: 'AI Librarian', href: '#ai-demo' },
    { name: 'Harga', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <div className="bg-primary-600 p-2 rounded-lg text-white">
                  <BookOpen size={24} strokeWidth={2.5} />
                </div>
                <span className={`text-xl font-bold tracking-tight ${isScrolled ? 'text-slate-900' : 'text-slate-800'}`}>
                  Cloud<span className="text-primary-600">SLiMS</span>
                </span>
              </div>

              {/* AI Chat Trigger Icon */}
              <button 
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="hidden sm:flex group relative items-center justify-center p-2 rounded-full bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all duration-300"
                aria-label="Open AI Assistant"
              >
                 <Bot size={20} className="text-indigo-600 group-hover:scale-110 transition-transform" />
                 <div className="absolute -top-1 -right-1 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full p-[2px] shadow-sm animate-pulse">
                   <Sparkles size={10} className="text-white fill-current" />
                 </div>
                 {/* Tooltip */}
                 <span className="absolute left-full ml-3 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Tanya AI
                 </span>
              </button>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <button
                onClick={onContact}
                className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors"
              >
                Hubungi Kami
              </button>
              
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <button 
                  onClick={onLogin}
                  className="text-sm font-bold text-slate-700 hover:text-primary-600 transition-colors flex items-center gap-2"
                >
                  <LogIn size={18} />
                  Masuk
                </button>
                <button 
                  onClick={onRegister}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors shadow-lg shadow-slate-900/10"
                >
                  Coba Gratis
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-3">
              <button 
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="p-2 rounded-full bg-indigo-50 text-indigo-600"
              >
                 <Bot size={20} />
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-600 hover:text-slate-900 p-2"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 absolute w-full shadow-lg">
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  className="block text-base font-medium text-slate-600 hover:text-primary-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onContact) onContact();
                }}
                className="block w-full text-left text-base font-medium text-slate-600 hover:text-primary-600"
              >
                Hubungi Kami
              </button>
              
              <div className="border-t border-slate-100 pt-4 mt-2 space-y-3">
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLogin();
                  }}
                  className="flex items-center gap-2 w-full text-left text-base font-bold text-slate-700 hover:text-primary-600 px-2"
                >
                  <LogIn size={20} /> Masuk Member
                </button>
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onRegister();
                  }}
                  className="w-full bg-primary-600 text-white px-5 py-3 rounded-lg text-sm font-medium"
                >
                  Coba Gratis
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ChatWidget Integration */}
      <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default Navbar;