import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <i className="fas fa-user text-gray-500"></i>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Admin Name</h2>
            <p className="text-gray-600">Department: IT</p>
            <p className="text-gray-600">City: New York</p>
          </div>
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={() => navigate('/new-post')}
        >
          Create New Post
        </button>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Recent Posts</h3>
        <div className="space-y-4">
          <div className="border p-4 rounded-md">
            <h4 className="text-lg font-medium">Post Title 1</h4>
            <p className="text-gray-600">Post description goes here...</p>
          </div>
          <div className="border p-4 rounded-md">
            <h4 className="text-lg font-medium">Post Title 2</h4>
            <p className="text-gray-600">Post description goes here...</p>
          </div>
        </div>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={() => navigate('/all-posts')}
        >
          Show All Posts →
        </button>
      </div>
    </div>
  );
}
