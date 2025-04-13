
import { create } from 'zustand';

type FilterState = {
  searchTerm: string;
  clientType: string | null;
  setSearchTerm: (term: string) => void;
  setClientType: (type: string | null) => void;
  reset: () => void;
};

export const useClientsFilterStore = create<FilterState>((set) => ({
  searchTerm: '',
  clientType: null,
  setSearchTerm: (term) => set({ searchTerm: term }),
  setClientType: (type) => set({ clientType: type }),
  reset: () => set({ searchTerm: '', clientType: null }),
}));
