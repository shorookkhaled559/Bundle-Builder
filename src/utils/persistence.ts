import type { SavedSystem } from '../types';

const STORAGE_KEY = 'wyze-builder:saved-system:v1';

/** Read a previously saved system from localStorage (or null). */
export function loadSavedSystem(): SavedSystem | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedSystem;
  } catch (err) {
    console.warn('Could not read saved system from localStorage', err);
    return null;
  }
}

/** Persist the current system so the user can come back later. */
export function saveSystem(state: SavedSystem): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (err) {
    console.warn('Could not save system to localStorage', err);
    return false;
  }
}
