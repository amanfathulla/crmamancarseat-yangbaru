import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WhatsAppMessage, ChatbotFlow, Campaign } from '../types/whatsapp';

interface WhatsAppState {
  campaigns: Campaign[];
  chatbotFlows: ChatbotFlow[];
  messages: WhatsAppMessage[];
  addMessage: (message: Omit<WhatsAppMessage, 'id'>) => void;
  updateMessage: (id: string, message: Partial<WhatsAppMessage>) => void;
  deleteMessage: (id: string) => void;
  addCampaign: (campaign: Omit<Campaign, 'id' | 'statistics'>) => void;
  updateCampaign: (id: string, campaign: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  addChatbotFlow: (flow: Omit<ChatbotFlow, 'id'>) => void;
  updateChatbotFlow: (id: string, flow: Partial<ChatbotFlow>) => void;
  deleteChatbotFlow: (id: string) => void;
}

export const useWhatsAppStore = create<WhatsAppState>()(
  persist(
    (set) => ({
      campaigns: [],
      chatbotFlows: [],
      messages: [],
      addMessage: (messageData) => {
        const newMessage: WhatsAppMessage = {
          ...messageData,
          id: `msg_${Date.now()}`,
        };
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      },
      updateMessage: (id, messageData) => {
        set((state) => ({
          messages: state.messages.map((message) =>
            message.id === id
              ? { ...message, ...messageData, lastEdited: new Date().toISOString() }
              : message
          ),
        }));
      },
      deleteMessage: (id) => {
        set((state) => ({
          messages: state.messages.filter((message) => message.id !== id),
        }));
      },
      addCampaign: (campaignData) => {
        const newCampaign: Campaign = {
          ...campaignData,
          id: `camp_${Date.now()}`,
          statistics: {
            sent: 0,
            delivered: 0,
            read: 0,
            replied: 0,
            clicked: 0,
          },
        };
        set((state) => ({
          campaigns: [...state.campaigns, newCampaign],
        }));
      },
      updateCampaign: (id, campaignData) => {
        set((state) => ({
          campaigns: state.campaigns.map((campaign) =>
            campaign.id === id
              ? { ...campaign, ...campaignData }
              : campaign
          ),
        }));
      },
      deleteCampaign: (id) => {
        set((state) => ({
          campaigns: state.campaigns.filter((campaign) => campaign.id !== id),
        }));
      },
      addChatbotFlow: (flowData) => {
        const newFlow: ChatbotFlow = {
          ...flowData,
          id: `flow_${Date.now()}`,
        };
        set((state) => ({
          chatbotFlows: [...state.chatbotFlows, newFlow],
        }));
      },
      updateChatbotFlow: (id, flowData) => {
        set((state) => ({
          chatbotFlows: state.chatbotFlows.map((flow) =>
            flow.id === id
              ? { ...flow, ...flowData }
              : flow
          ),
        }));
      },
      deleteChatbotFlow: (id) => {
        set((state) => ({
          chatbotFlows: state.chatbotFlows.filter((flow) => flow.id !== id),
        }));
      },
    }),
    {
      name: 'whatsapp-storage',
    }
  )
);