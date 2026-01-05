
import React from 'react';
import { History as HistoryIcon, X, Trash2 } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryProps {
  items: HistoryItem[];
  onSelect: (word: string) => void;
  onRemove: (word: string) => void;
  onClear: () => void;
}

const History: React.FC<HistoryProps> = ({ items, onSelect, onRemove, onClear }) => {
  if (items.length === 0) return null;

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <div className="flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold uppercase tracking-wider">
          <HistoryIcon size={14} />
          <span>Recent Searches</span>
        </div>
        <button 
          onClick={onClear}
          className="text-slate-400 hover:text-red-500 transition-colors p-1"
          title="Clear all history"
        >
          <Trash2 size={14} />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <div 
            key={item.timestamp}
            className="flex items-center gap-1 group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 shadow-sm hover:border-primary dark:hover:border-primary transition-all cursor-pointer"
          >
            <span 
              onClick={() => onSelect(item.word)}
              className="text-slate-700 dark:text-slate-300 font-medium"
            >
              {item.word}
            </span>
            <button 
              onClick={() => onRemove(item.word)}
              className="text-slate-300 group-hover:text-slate-500 dark:group-hover:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
