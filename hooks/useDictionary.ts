
import { useState, useCallback, useEffect } from 'react';
import { DictionaryEntry, HistoryItem } from '../types';

export const useDictionary = () => {
  const [data, setData] = useState<DictionaryEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('wordstopia_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const searchWord = useCallback(async (word: string) => {
    if (!word || word.trim() === '') return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (!response.ok) {
        throw new Error("We couldn't find that word. Try another one!");
      }
      const result = await response.json();
      const entry = result[0];
      setData(entry);

      // Update history
      setHistory(prev => {
        const filtered = prev.filter(item => item.word.toLowerCase() !== word.toLowerCase());
        const updated = [{ word, timestamp: Date.now() }, ...filtered].slice(0, 10);
        localStorage.setItem('wordstopia_history', JSON.stringify(updated));
        return updated;
      });

    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const removeFromHistory = (word: string) => {
    setHistory(prev => {
      const updated = prev.filter(item => item.word !== word);
      localStorage.setItem('wordstopia_history', JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('wordstopia_history');
  };

  return { data, loading, error, searchWord, history, removeFromHistory, clearHistory };
};
