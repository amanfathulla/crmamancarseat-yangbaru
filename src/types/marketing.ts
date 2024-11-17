export interface MarketingContent {
  id: string;
  date: string;
  contents: Array<{
    id: string;
    title: string;
    description: string;
    platform: 'facebook' | 'instagram' | 'tiktok' | 'website';
    status: 'pending' | 'completed';
    time: string;
    backgroundColor?: string;
  }>;
}

export interface ContentFormData {
  title: string;
  description: string;
  platform: 'facebook' | 'instagram' | 'tiktok' | 'website';
  time: string;
  backgroundColor?: string;
}