export interface BlogPost {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  author: string;
  date: string;
  category: 'store-visit' | 'update' | 'promotion';
  tags: string[];
  views: number;
  likes: number;
  storeLocation?: string;
  visitDate?: string;
  visitPhotos?: string[];
}

export interface BlogFormData extends Omit<BlogPost, 'id' | 'views' | 'likes'> {
  id?: string;
}