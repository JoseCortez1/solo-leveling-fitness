import { Hunter, DailyState } from '../types';

const HUNTER_KEY = 'sololevel_hunter';
const DAILY_KEY = 'sololevel_daily';

export function saveHunter(hunter: Hunter): void {
  localStorage.setItem(HUNTER_KEY, JSON.stringify(hunter));
}

export function loadHunter(): Hunter | null {
  const data = localStorage.getItem(HUNTER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as Hunter;
  } catch {
    return null;
  }
}

export function saveDailyState(state: DailyState): void {
  localStorage.setItem(DAILY_KEY, JSON.stringify(state));
}

export function loadDailyState(): DailyState | null {
  const data = localStorage.getItem(DAILY_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as DailyState;
  } catch {
    return null;
  }
}

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export function isNewDay(savedDate: string): boolean {
  return savedDate !== getTodayDateString();
}