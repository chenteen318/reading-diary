import { ReadingEntry, DiaryData } from './types';

const STORAGE_KEY = 'reading-diary-data';

export function getDiaryData(): DiaryData {
  if (typeof window === 'undefined') {
    return { entries: [] };
  }
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return { entries: [] };
    }
  }
  return { entries: [] };
}

export function saveEntry(entry: ReadingEntry): void {
  const data = getDiaryData();
  data.entries.unshift(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getEntry(id: string): ReadingEntry | null {
  const data = getDiaryData();
  return data.entries.find(e => e.id === id) || null;
}

export function deleteEntry(id: string): void {
  const data = getDiaryData();
  data.entries = data.entries.filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}