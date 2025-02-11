import React from 'react';

export default function NewPost() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Image</label>
          <input
            type="file"
            className="block w-full text-gray-700 border rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Description
          </label>
          <textarea
            className="w-full border rounded-md p-2"
            rows="4"
            placeholder="Write your post description here..."
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Post
        </button>
      </form>
    </div>
  );
}
