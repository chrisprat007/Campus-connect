import React from 'react';
import EditSaveCancel from './EditSaveCancel';

const SectionHeader = ({ 
  title, 
  icon, 
  count, 
  editingSection, 
  sectionKey, 
  onEdit, 
  onSave, 
  onCancel 
}) => (
  <div className="flex justify-between items-center border-b pb-4 mb-4">
    <h2 className="text-xl font-semibold flex items-center gap-2">
      {icon} {title} {count !== undefined && `(${count})`}
    </h2>
    <EditSaveCancel
      editingSection={editingSection}
      currentSection={sectionKey}
      onEdit={onEdit}
      onSave={onSave}
      onCancel={onCancel}
    />
  </div>
);

export default SectionHeader;