import { create } from "zustand";

type QueryStore = {
  cache: Map<string, any>;
  get: <T>(key: string) => T | undefined;
  set: <T>(key: string, data: T) => void;
  clear: (key: string) => void;
  clearAll: () => void;
};

export const useQueryStore = create<QueryStore>((set, get) => ({
  cache: new Map(),

  get: (key) => {
    return get().cache.get(key);
  },

  set: (key, data) => {
    set((state) => {
      const cache = state.cache; // Directly mutate the existing Map
      if (!cache.has(key) || cache.get(key) !== data) {
        // Only set if data is different
        cache.set(key, data);
        return { cache }; // Returning the same Map reference
      }
      return state; // No change, so return the current state
    });
  },

  clear: (key) => {
    set((state) => {
      const cache = state.cache;
      if (cache.has(key)) {
        cache.delete(key);
        return { cache }; // Return the updated Map
      }
      return state; // No change, so return the current state
    });
  },

  clearAll: () => {
    set({ cache: new Map() }); // Clear the entire cache
  },
}));
