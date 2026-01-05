
import React, { useState, useEffect, useRef } from 'react';
import { Play, ExternalLink, Sparkles } from 'lucide-react';
import { DictionaryEntry } from '../types';
import { getDeepContext } from '../services/geminiService';

interface DefinitionProps {
  data: DictionaryEntry;
  onRelatedClick: (word: string) => void;
}

const Definition: React.FC<DefinitionProps> = ({ data, onRelatedClick }) => {
  const [aiContext, setAiContext] = useState<{ mnemonic: string, etymology: string, usageTip: string } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Reset AI context when word changes
  useEffect(() => {
    setAiContext(null);
  }, [data.word]);

  const fetchAiDeepContext = async () => {
    setAiLoading(true);
    const result = await getDeepContext(data.word);
    setAiContext(result);
    setAiLoading(false);
  };

  const playAudio = () => {
    const phoneticWithAudio = data.phonetics.find(p => p.audio && p.audio !== '');
    if (phoneticWithAudio) {
      if (audioRef.current) {
        audioRef.current.src = phoneticWithAudio.audio;
        audioRef.current.play();
      } else {
        const audio = new Audio(phoneticWithAudio.audio);
        audioRef.current = audio;
        audio.play();
      }
    }
  };

  const hasAudio = data.phonetics.some(p => p.audio && p.audio !== '');

  return (
    <div className="max-w-2xl mx-auto mt-10 animate-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Word Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">{data.word}</h1>
          <p className="text-primary text-xl md:text-2xl font-medium">{data.phonetic || data.phonetics[0]?.text}</p>
        </div>
        {hasAudio && (
          <button
            onClick={playAudio}
            className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-all group active:scale-95"
          >
            <Play size={32} fill="currentColor" className="ml-1 group-hover:scale-110 transition-transform" />
          </button>
        )}
      </div>

      {/* AI Deep Learning Section */}
      <div className="mb-12">
        {!aiContext && !aiLoading ? (
          <button 
            onClick={fetchAiDeepContext}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-200 dark:border-purple-800 flex items-center justify-between hover:from-purple-500/20 hover:to-indigo-500/20 transition-all group"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="text-primary animate-pulse" size={20} />
              <span className="font-semibold text-slate-700 dark:text-slate-300">Unlock Deep AI Context</span>
            </div>
            <span className="text-sm text-slate-500 group-hover:text-primary transition-colors">Mnemonics & Usage tips →</span>
          </button>
        ) : aiLoading ? (
          <div className="w-full py-8 px-6 rounded-2xl bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center gap-3 border border-dashed border-slate-300 dark:border-slate-700">
             <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
             <span className="text-slate-500 font-medium">Gemini is researching for you...</span>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/5 to-indigo-500/5 border border-purple-100 dark:border-purple-900 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="text-primary" size={18} />
              <h3 className="font-bold text-slate-800 dark:text-slate-200">AI Deep Context</h3>
            </div>
            
            <div>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest block mb-1">Mnemonic Device</span>
              <p className="text-slate-700 dark:text-slate-300 italic">"{aiContext?.mnemonic}"</p>
            </div>

            <div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block mb-1">Etymology</span>
              <p className="text-slate-700 dark:text-slate-300">{aiContext?.etymology}</p>
            </div>

            <div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-1">Usage Tip</span>
              <p className="text-slate-700 dark:text-slate-300">{aiContext?.usageTip}</p>
            </div>
          </div>
        )}
      </div>

      {/* Meanings */}
      {data.meanings.map((meaning, index) => (
        <div key={index} className="mb-10 last:mb-0">
          <div className="flex items-center gap-4 mb-6">
            <span className="italic font-bold text-lg md:text-xl text-slate-800 dark:text-slate-200">{meaning.partOfSpeech}</span>
            <div className="h-[1px] bg-slate-200 dark:bg-slate-800 flex-1"></div>
          </div>
          
          <h3 className="text-slate-400 dark:text-slate-500 font-medium text-lg mb-4">Meaning</h3>
          <ul className="space-y-4 ml-2">
            {meaning.definitions.map((def, idx) => (
              <li key={idx} className="flex gap-4">
                <span className="text-primary font-bold">•</span>
                <div className="flex-1">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {def.definition}
                  </p>
                  {def.example && (
                    <p className="text-slate-500 dark:text-slate-400 mt-2 pl-4 border-l-2 border-slate-200 dark:border-slate-800">
                      "{def.example}"
                    </p>
                  )}
                  
                  {/* Local Definition Synonyms */}
                  {def.synonyms.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {def.synonyms.map(s => (
                        <button 
                          key={s} 
                          onClick={() => onRelatedClick(s)}
                          className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {/* Meaning Level Synonyms */}
          {meaning.synonyms.length > 0 && (
            <div className="mt-8 flex items-center gap-4">
              <h3 className="text-slate-400 dark:text-slate-500 font-medium min-w-fit">Synonyms</h3>
              <div className="flex flex-wrap gap-3">
                {meaning.synonyms.map((syn, idx) => (
                  <button
                    key={idx}
                    onClick={() => onRelatedClick(syn)}
                    className="text-primary font-bold hover:underline transition-all"
                  >
                    {syn}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Source */}
      <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col gap-2">
          <span className="text-slate-400 dark:text-slate-500 text-sm">Source</span>
          {data.sourceUrls.map((url, i) => (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="text-slate-700 dark:text-slate-300 text-sm flex items-center gap-2 hover:text-primary transition-colors underline decoration-slate-300 dark:decoration-slate-700 underline-offset-4"
            >
              {url} <ExternalLink size={12} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Definition;
