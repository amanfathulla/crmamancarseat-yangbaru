export interface WhatsAppMessage {
  id: string;
  day: number;
  time: string;
  message: string;
  type: 'text' | 'template' | 'media' | 'button' | 'list';
  status: 'active' | 'draft' | 'paused';
  conditions?: {
    previousResponse?: string;
    customerTag?: string;
    purchaseHistory?: boolean;
  };
  buttons?: Array<{
    id: string;
    text: string;
    action: string;
  }>;
  media?: {
    type: 'image' | 'video' | 'document';
    url: string;
    caption?: string;
  };
  variables?: string[];
  lastEdited: string;
  tags: string[];
}

export interface ChatbotFlow {
  id: string;
  name: string;
  triggers: string[];
  responses: Array<{
    pattern: string;
    message: WhatsAppMessage;
    nextFlow?: string;
  }>;
  fallback: WhatsAppMessage;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'draft' | 'paused' | 'completed';
  startDate: string;
  endDate: string;
  messages: WhatsAppMessage[];
  triggers: {
    onPurchase?: boolean;
    onSignup?: boolean;
    onInactivity?: boolean;
    customDate?: string;
  };
  statistics: {
    sent: number;
    delivered: number;
    read: number;
    replied: number;
    clicked: number;
  };
}