import React from 'react';

const ItemList = ({
  items,
  editing,
  renderItem,
  renderEditableItem,
  onAdd,
  addButtonText = "Add Item"
}) => (
  <div className="space-y-3">
    {editing
      ? items.map((item, idx) => renderEditableItem(item, idx))
      : items.map((item, idx) => renderItem(item, idx))}
    {editing && (
      <button
        onClick={onAdd}
        className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
      >
        {addButtonText}
      </button>
    )}
  </div>
);

export default ItemList;