import React from 'react';
import { BookOpen, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4 text-white">
              <BookOpen size={24} />
              <span className="text-xl font-bold">CloudSLiMS</span>
            </div>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Platform layanan perpustakaan digital berbasis SLiMS yang memudahkan sekolah dan universitas mengelola koleksi buku tanpa kerumitan infrastruktur.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary-400 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-primary-400 transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-primary-400 transition-colors"><Instagram size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Produk</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Fitur</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Harga</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Showcase</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Dukungan</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Dokumentasi</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Panduan SLiMS</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Status Server</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Hubungi Kami</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">© 2024 CloudSLiMS Indonesia. All rights reserved.</p>
          <p className="text-sm text-slate-600">Dibuat dengan ❤️ untuk Pustakawan Indonesia.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;