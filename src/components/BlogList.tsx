import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, ThumbsUp, MapPin, ExternalLink } from 'lucide-react';
import { useBlogStore } from '../store/blogStore';
import BlogForm from './BlogForm';
import { BlogPost } from '../types/blog';

const BlogList = () => {
  const { posts, deletePost, incrementViews, toggleLike } = useBlogStore();
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(id);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Blog Updates</h1>
            <p className="text-gray-600">Store visits and daily updates</p>
          </div>
          <a
            href="/blog/public"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Public Blog
          </a>
        </div>
      </div>

      {/* Rest of the component remains the same */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full sm:w-64"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2"
          >
            <option value="all">All Categories</option>
            <option value="store-visit">Store Visits</option>
            <option value="update">Updates</option>
            <option value="promotion">Promotions</option>
          </select>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  post.category === 'store-visit' ? 'bg-green-100 text-green-800' :
                  post.category === 'update' ? 'bg-blue-100 text-blue-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {post.category}
                </span>
                <span className="text-sm text-gray-500">{post.date}</span>
              </div>
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
              
              {post.storeLocation && (
                <div className="flex items-center text-gray-500 mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{post.storeLocation}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => incrementViews(post.id)}
                    className="flex items-center text-gray-500 hover:text-gray-700"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    <span className="text-sm">{post.views}</span>
                  </button>
                  <button
                    onClick={() => toggleLike(post.id)}
                    className="flex items-center text-gray-500 hover:text-gray-700"
                  >
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    <span className="text-sm">{post.likes}</span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingPost(post);
                      setShowForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <BlogForm
          initialData={editingPost || undefined}
          onSubmit={(data) => {
            if (editingPost) {
              // Update existing post
              deletePost(editingPost.id);
            }
            // Add new post
            useBlogStore.getState().addPost(data);
            setShowForm(false);
            setEditingPost(null);
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingPost(null);
          }}
        />
      )}
    </div>
  );
};

export default BlogList;