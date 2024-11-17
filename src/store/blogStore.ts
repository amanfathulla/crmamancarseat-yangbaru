import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BlogPost } from '../types/blog';

interface BlogState {
  posts: BlogPost[];
  addPost: (post: Omit<BlogPost, 'id' | 'views' | 'likes'>) => void;
  updatePost: (id: string, post: Partial<BlogPost>) => void;
  deletePost: (id: string) => void;
  incrementViews: (id: string) => void;
  toggleLike: (id: string) => void;
}

export const useBlogStore = create<BlogState>()(
  persist(
    (set) => ({
      posts: [],
      addPost: (postData) => {
        const newPost: BlogPost = {
          ...postData,
          id: `post_${Date.now()}`,
          views: 0,
          likes: 0,
        };
        set((state) => ({
          posts: [newPost, ...state.posts],
        }));
      },
      updatePost: (id, postData) => {
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === id ? { ...post, ...postData } : post
          ),
        }));
      },
      deletePost: (id) => {
        set((state) => ({
          posts: state.posts.filter((post) => post.id !== id),
        }));
      },
      incrementViews: (id) => {
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === id ? { ...post, views: post.views + 1 } : post
          ),
        }));
      },
      toggleLike: (id) => {
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === id ? { ...post, likes: post.likes + 1 } : post
          ),
        }));
      },
    }),
    {
      name: 'blog-storage',
    }
  )
);