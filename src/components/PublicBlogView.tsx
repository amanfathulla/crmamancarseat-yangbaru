import React, { useState } from 'react';
import { Search, Eye, ThumbsUp, MapPin } from 'lucide-react';
import { useBlogStore } from '../store/blogStore';

const PublicBlogView = () => {
  const { posts, incrementViews, toggleLike } = useBlogStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">ACS Legacy Blog</h1>
          <p className="mt-2 text-gray-600">Latest updates and store visits</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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

                {post.visitPhotos && post.visitPhotos.length > 0 && (
                  <div className="mb-4">
                    <div className="grid grid-cols-3 gap-2">
                      {post.visitPhotos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`Visit photo ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                      ))}
                    </div>
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
                  <span className="text-sm text-gray-500">By {post.author}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PublicBlogView;