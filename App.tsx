import React, { useState, useEffect } from 'react';
import { Book, Search, X, Loader2 } from 'lucide-react';
import { useDictionary } from './hooks/useDictionary';
import { FontStyle } from './types';
import Settings from './components/Settings';
import History from './components/History';
import Definition from './components/Definition';

const App: React.FC = () => {
  const { data, loading, error, searchWord, history, removeFromHistory, clearHistory } = useDictionary();
  const [searchTerm, setSearchTerm] = useState('');
  const [font, setFont] = useState<FontStyle>('sans');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initial dark mode setup
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchWord(searchTerm.trim());
    }
  };

  const handleQuickSearch = (word: string) => {
    setSearchTerm(word);
    searchWord(word);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen p-6 md:p-12 font-${font}-mode flex flex-col`}>
      {/* Header */}
      <header className="max-w-2xl mx-auto w-full flex justify-between items-center mb-12">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.location.reload()}>
          <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-all">
            <Book className="text-primary" size={28} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Wordstopia</span>
        </div>
        <Settings 
          font={font} 
          setFont={setFont} 
          isDarkMode={isDarkMode} 
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
        />
      </header>

      {/* Main Container */}
      <main className="relative flex-grow">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto sticky top-4 z-40 transition-all">
          <form onSubmit={handleSearch} className="relative group">
            <input
              type="text"
              className="w-full p-4 md:p-5 pl-12 md:pl-14 text-lg md:text-xl rounded-2xl bg-slate-200/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary shadow-lg dark:shadow-none placeholder-slate-500 transition-all group-hover:bg-slate-200 dark:group-hover:bg-slate-800"
              placeholder="Search for any word..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-primary" size={24} />
            {searchTerm && (
              <button 
                type="button" 
                onClick={() => setSearchTerm('')}
                className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X size={20} />
              </button>
            )}
          </form>
        </div>

        {/* History Chips */}
        {!data && !loading && !error && (
          <History 
            items={history} 
            onSelect={handleQuickSearch} 
            onRemove={removeFromHistory}
            onClear={clearHistory}
          />
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center mt-24 gap-4 animate-in fade-in duration-500">
            <Loader2 className="text-primary animate-spin" size={48} />
            <p className="text-lg font-medium text-slate-500">Scanning lexicon...</p>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto mt-20 text-center animate-in zoom-in-95 duration-300">
             <div className="inline-block p-6 bg-red-50 dark:bg-red-950/20 rounded-3xl border border-red-100 dark:border-red-900">
               <span className="text-4xl block mb-4">😕</span>
               <h3 className="text-xl font-bold text-red-800 dark:text-red-400 mb-2">Word Not Found</h3>
               <p className="text-slate-600 dark:text-slate-400 max-w-sm">
                {error}
               </p>
               <button 
                  onClick={() => setSearchTerm('')}
                  className="mt-6 px-6 py-2 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-xl font-semibold hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                >
                  Try another one
               </button>
             </div>
          </div>
        )}

        {/* Empty State */}
        {!data && !loading && !error && (
          <div className="max-w-2xl mx-auto mt-24 text-center px-4 animate-in fade-in duration-1000">
            <div className="mb-8 relative inline-block">
               <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-full animate-pulse" />
               <Book size={64} className="text-primary/40 relative" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4">Start your journey</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed max-w-md mx-auto">
              Explore definitions, master pronunciations, and uncover deep AI-powered insights with Wordstopia.
            </p>
            <div className="mt-8 flex justify-center gap-4">
               {['meticulous', 'ethereal', 'paradigm'].map(word => (
                 <button 
                    key={word}
                    onClick={() => handleQuickSearch(word)}
                    className="text-primary hover:bg-primary/5 px-4 py-2 rounded-xl transition-all font-medium border border-primary/20"
                 >
                   {word}
                 </button>
               ))}
            </div>
          </div>
        )}

        {/* Definition Result */}
        {data && !loading && (
          <Definition data={data} onRelatedClick={handleQuickSearch} />
        )}
      </main>

      {/* Footer Branding */}
      <footer className="w-full mt-auto py-8 text-center">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Made by <span className="text-primary font-semibold">Ifrah Ali</span> in collaboration with <span className="text-primary font-semibold">Aditya Chandra</span>
        </p>
      </footer>
    </div>
  );
};

export default App;