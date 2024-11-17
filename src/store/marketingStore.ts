import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MarketingContent, ContentFormData } from '../types/marketing';

interface MarketingState {
  contents: MarketingContent[];
  addContent: (date: string, content: ContentFormData) => void;
  updateContent: (date: string, contentId: string, status: 'pending' | 'completed') => void;
  editContent: (date: string, contentId: string, data: ContentFormData) => void;
  deleteContent: (date: string, contentId: string) => void;
  getContentsByDate: (date: string) => MarketingContent | undefined;
}

export const useMarketingStore = create<MarketingState>()(
  persist(
    (set, get) => ({
      contents: [],
      addContent: (date, content) => {
        set((state) => {
          const existingDateIndex = state.contents.findIndex(c => c.date === date);
          const newContent = {
            id: `content_${Date.now()}`,
            ...content,
            status: 'pending' as const
          };

          if (existingDateIndex >= 0) {
            const updatedContents = [...state.contents];
            updatedContents[existingDateIndex] = {
              ...updatedContents[existingDateIndex],
              contents: [...updatedContents[existingDateIndex].contents, newContent]
            };
            return { contents: updatedContents };
          }

          return {
            contents: [...state.contents, {
              id: `date_${Date.now()}`,
              date,
              contents: [newContent]
            }]
          };
        });
      },
      updateContent: (date, contentId, status) => {
        set((state) => {
          const updatedContents = state.contents.map(dateContent => {
            if (dateContent.date === date) {
              return {
                ...dateContent,
                contents: dateContent.contents.map(content => 
                  content.id === contentId ? { ...content, status } : content
                )
              };
            }
            return dateContent;
          });
          return { contents: updatedContents };
        });
      },
      editContent: (date, contentId, data) => {
        set((state) => {
          const updatedContents = state.contents.map(dateContent => {
            if (dateContent.date === date) {
              return {
                ...dateContent,
                contents: dateContent.contents.map(content => 
                  content.id === contentId ? { ...content, ...data } : content
                )
              };
            }
            return dateContent;
          });
          return { contents: updatedContents };
        });
      },
      deleteContent: (date, contentId) => {
        set((state) => {
          const updatedContents = state.contents.map(dateContent => {
            if (dateContent.date === date) {
              return {
                ...dateContent,
                contents: dateContent.contents.filter(content => content.id !== contentId)
              };
            }
            return dateContent;
          });
          // Remove date entry if no contents remain
          return {
            contents: updatedContents.filter(dateContent => dateContent.contents.length > 0)
          };
        });
      },
      getContentsByDate: (date) => {
        return get().contents.find(c => c.date === date);
      }
    }),
    {
      name: 'marketing-storage'
    }
  )
);