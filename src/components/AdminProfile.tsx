import React from 'react';
import { useAuthStore } from '../store/authStore';

const AdminProfile = () => {
  const username = useAuthStore((state) => state.username);

  return (
    <div className="flex items-center space-x-4 p-6">
      <img
        src="https://i.imgur.com/Hy0VHxr.jpg"
        alt="Admin Profile"
        className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
      />
      <div>
        <h2 className="text-lg font-semibold text-gray-800">{username || 'AmanMuhsin'}</h2>
        <p className="text-sm text-gray-600">Administrator</p>
      </div>
    </div>
  );
};

export default AdminProfile;