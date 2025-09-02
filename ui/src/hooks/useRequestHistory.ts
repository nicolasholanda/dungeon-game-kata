import { useCallback } from 'react';

export interface RequestHistoryItem {
  id: string;
  timestamp: number;
  matrix: string;
  result: {
    minimumHP: number;
    path: number[][];
  } | null;
  error: string | null;
  duration?: number;
}

const STORAGE_KEY = 'dungeon-request-history';
const MAX_HISTORY_SIZE = 50;

export function useRequestHistory() {
    
  const getHistory = useCallback((): RequestHistoryItem[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  const addToHistory = useCallback((
    matrix: string,
    result: { minimumHP: number; path: number[][] } | null,
    error: string | null,
    duration?: number
  ) => {
    const newItem: RequestHistoryItem = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      matrix,
      result,
      error,
      duration
    };

    try {
      const currentHistory = getHistory();
      const updatedHistory = [newItem, ...currentHistory].slice(0, MAX_HISTORY_SIZE);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
      return newItem;
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
      return newItem;
    }
  }, [getHistory]);

  const clearHistory = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }, []);

  const findCachedResult = useCallback((matrix: string): RequestHistoryItem | null => {
    try {
      const history = getHistory();
      const cachedItem = history.find(item => 
        item.matrix === matrix && 
        item.result !== null && 
        item.error === null
      );
      return cachedItem || null;
    } catch {
      return null;
    }
  }, [getHistory]);

  return {
    getHistory,
    addToHistory,
    clearHistory,
    findCachedResult
  };
}
