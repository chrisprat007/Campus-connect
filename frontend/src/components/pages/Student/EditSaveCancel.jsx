import React from 'react';

const EditSaveCancel = ({
  editingSection,
  currentSection,
  onEdit,
  onSave,
  onCancel
}) => {
  if (editingSection !== currentSection) {
    return (
      <button
        onClick={onEdit}
        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
      >
        Edit
      </button>
    );
  }

  return (
    <div className="space-x-2">
      <button
        onClick={onSave}
        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
      >
        Save
      </button>
      <button
        onClick={onCancel}
        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
      >
        Cancel
      </button>
    </div>
  );
};

export default EditSaveCancel;
