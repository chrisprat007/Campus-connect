import React from 'react';

export default function AllPost() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">All Posts</h2>
      <div className="space-y-4">
        <div className="border p-4 rounded-md">
          <h4 className="text-lg font-medium">Post Title 1</h4>
          <p className="text-gray-600">Post description goes here...</p>
        </div>
        <div className="border p-4 rounded-md">
          <h4 className="text-lg font-medium">Post Title 2</h4>
          <p className="text-gray-600">Post description goes here...</p>
        </div>
        <div className="border p-4 rounded-md">
          <h4 className="text-lg font-medium">Post Title 3</h4>
          <p className="text-gray-600">Post description goes here...</p>
        </div>
      </div>
    </div>
  );
}
