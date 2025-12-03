import React, { useState } from 'react';
import { Search, Sparkles, Book, Loader2, Plus, Brain, FileText } from 'lucide-react';
import { getAiBookRecommendations } from '../services/geminiService';
import { BookRecommendation } from '../types';

const AiLibrarian: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BookRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResults([]);
    
    try {
      const recommendations = await getAiBookRecommendations(query);
      setResults(recommendations);
      setHasSearched(true);
    } catch (error) {
      console.error("Failed to fetch recommendations", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!query.trim()) return;
    setLoadingMore(true);
    try {
      const currentTitles = results.map(r => r.title);
      const newRecommendations = await getAiBookRecommendations(query, currentTitles);
      setResults(prev => [...prev, ...newRecommendations]);
    } catch (error) {
      console.error("Failed to fetch more recommendations", error);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <section id="ai-demo" className="py-24 bg-slate-900 text-white overflow-hidden relative">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
         <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
           <defs>
             <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
               <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.5"/>
             </pattern>
           </defs>
           <rect width="100%" height="100%" fill="url(#grid)" />
         </svg>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wide mb-4">
            <Sparkles size={14} />
            Powered by Google Gemini
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Coba "AI Pustakawan" Kami</h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Fitur premium CloudSLiMS Enterprise. Gunakan AI untuk mencari buku, mendapatkan ringkasan, dan rekomendasi cerdas dalam hitungan detik.
          </p>
        </div>

        {/* AI Features Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 animate-fade-in-up">
          <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700 p-6 rounded-2xl hover:bg-slate-800/60 transition-colors group">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
              <Brain size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Pencarian Cerdas</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Memahami konteks pertanyaan siswa, bukan sekadar mencocokkan kata kunci judul buku.
            </p>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700 p-6 rounded-2xl hover:bg-slate-800/60 transition-colors group">
            <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center text-pink-400 mb-4 group-hover:scale-110 transition-transform">
              <FileText size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Ringkasan Instan</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Menyajikan intisari dan poin utama buku secara otomatis untuk membantu riset siswa.
            </p>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700 p-6 rounded-2xl hover:bg-slate-800/60 transition-colors group">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
              <Sparkles size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Rekomendasi Personal</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Memberikan saran bacaan yang relevan berdasarkan kurikulum dan minat baca siswa.
            </p>
          </div>
        </div>

        {/* Search Box */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari topik... (misal: Sejarah Kemerdekaan Indonesia)"
                className="flex-1 bg-transparent px-6 py-4 text-white placeholder-slate-400 focus:outline-none"
              />
              <button 
                type="submit" 
                disabled={loading}
                className="px-8 bg-primary-600 hover:bg-primary-500 text-white font-medium transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
                <span>Tanya AI</span>
              </button>
            </div>
          </form>
          <p className="text-center text-slate-500 text-sm mt-4">
            *Demo ini menggunakan data simulasi AI, bukan database perpustakaan asli.
          </p>
        </div>

        {/* Loading State with Spinner & Skeleton */}
        {loading && (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="flex items-center justify-center gap-3 text-primary-400">
                <Loader2 size={24} className="animate-spin" />
                <span className="font-medium">Sedang menganalisis koleksi buku...</span>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[1, 2, 3].map((i) => (
                 <div key={i} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 h-full flex flex-col animate-pulse">
                    <div className="flex justify-between mb-4">
                      <div className="w-12 h-12 bg-slate-700/50 rounded-lg"></div>
                      <div className="w-16 h-6 bg-slate-700/50 rounded"></div>
                    </div>
                    <div className="h-7 bg-slate-700/50 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-slate-700/50 rounded w-1/2 mb-4"></div>
                    <div className="h-6 bg-slate-700/50 rounded w-1/3 mb-6"></div>
                    <div className="space-y-3 flex-1">
                      <div className="h-3 bg-slate-700/50 rounded w-full"></div>
                      <div className="h-3 bg-slate-700/50 rounded w-full"></div>
                      <div className="h-3 bg-slate-700/50 rounded w-5/6"></div>
                      <div className="h-3 bg-slate-700/50 rounded w-4/5"></div>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* Results */}
        {!loading && hasSearched && results.length > 0 && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {results.map((book, idx) => (
                <div 
                  key={idx} 
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-primary-500/50 transition-colors opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${(idx % 3) * 150}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-slate-700/50 rounded-lg text-primary-400">
                      <Book size={24} />
                    </div>
                    <span className="text-xs font-mono px-2 py-1 rounded bg-slate-700 text-slate-300">{book.year}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2" title={book.title}>{book.title}</h3>
                  <p className="text-sm text-indigo-300 mb-3">{book.author}</p>
                  <div className="text-xs font-medium px-2 py-1 rounded bg-indigo-900/30 text-indigo-200 inline-block mb-4">
                    {book.category}
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-4">
                    {book.summary}
                  </p>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="group px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-primary-500/50 rounded-full text-slate-300 hover:text-white font-medium transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-primary-500/10"
              >
                {loadingMore ? (
                  <Loader2 size={18} className="animate-spin text-primary-400" />
                ) : (
                  <Plus size={18} className="group-hover:scale-110 transition-transform" />
                )}
                <span>Muat Lebih Banyak</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AiLibrarian;