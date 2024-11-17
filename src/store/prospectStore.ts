import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Prospect } from '../types/prospect';

interface ProspectState {
  prospects: Prospect[];
  addProspect: (prospect: Omit<Prospect, 'id'>) => void;
  updateProspect: (id: string, prospect: Partial<Prospect>) => void;
  deleteProspect: (id: string) => void;
  getProspectsByDate: (date: string) => Prospect[];
  getProspectsByMonth: (month: number, year: number) => Prospect[];
}

export const useProspectStore = create<ProspectState>()(
  persist(
    (set, get) => ({
      prospects: [],
      addProspect: (prospectData) => {
        const newProspect: Prospect = {
          ...prospectData,
          id: `prospect_${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          prospects: [...state.prospects, newProspect],
        }));
      },
      updateProspect: (id, prospectData) => {
        set((state) => ({
          prospects: state.prospects.map((prospect) =>
            prospect.id === id ? { ...prospect, ...prospectData } : prospect
          ),
        }));
      },
      deleteProspect: (id) => {
        set((state) => ({
          prospects: state.prospects.filter((prospect) => prospect.id !== id),
        }));
      },
      getProspectsByDate: (date) => {
        return get().prospects.filter(prospect => {
          const prospectDate = new Date(prospect.createdAt).toISOString().split('T')[0];
          return prospectDate === date;
        });
      },
      getProspectsByMonth: (month, year) => {
        return get().prospects.filter(prospect => {
          const prospectDate = new Date(prospect.createdAt);
          return prospectDate.getMonth() === month && 
                 prospectDate.getFullYear() === year;
        });
      },
    }),
    {
      name: 'prospect-storage',
    }
  )
);