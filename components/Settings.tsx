
import React from 'react';
import { Moon, Sun, Type } from 'lucide-react';
import { FontStyle } from '../types';

interface SettingsProps {
  font: FontStyle;
  setFont: (font: FontStyle) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Settings: React.FC<SettingsProps> = ({ font, setFont, isDarkMode, toggleDarkMode }) => {
  return (
    <div className="flex items-center gap-6">
      <div className="relative group">
        <button className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium hover:text-primary transition-colors">
          <span className="capitalize">{font}</span>
          <Type size={18} />
        </button>
        <div className="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-slate-800 shadow-xl rounded-xl border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
          {(['sans', 'serif', 'mono'] as FontStyle[]).map((f) => (
            <button
              key={f}
              onClick={() => setFont(f)}
              className={`w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors capitalize ${font === f ? 'text-primary font-bold' : ''}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      
      <div className="w-[1px] h-6 bg-slate-300 dark:bg-slate-700" />

      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
      >
        {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
      </button>
    </div>
  );
};

export default Settings;
