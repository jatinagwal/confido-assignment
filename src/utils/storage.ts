import { User, ApiKeySettings } from '../types';

const STORAGE_KEY = 'confido_user';
const API_KEYS_KEY = 'confido_api_keys';

export const storage = {
  getUser(): User | null {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },

  setUser(user: User): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  },

  clearUser(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  getApiKeys(): ApiKeySettings | null {
    const data = localStorage.getItem(API_KEYS_KEY);
    return data ? JSON.parse(data) : null;
  },

  setApiKeys(keys: ApiKeySettings): void {
    localStorage.setItem(API_KEYS_KEY, JSON.stringify(keys));
  },

  updateApiKey(key: 'elevenLabsApiKey' | 'calcomApiKey', value: string): void {
    const keys = this.getApiKeys() || { elevenLabsApiKey: '', calcomApiKey: '' };
    keys[key] = value;
    this.setApiKeys(keys);
  },

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  },

  getItem(key: string): string | null {
    return localStorage.getItem(key);
  },

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
};

