import React from 'react';
import { FaBriefcase } from 'react-icons/fa';
import SectionHeader from './SectionHeader';
import InputField from './InputField';
import ItemList from './ItemList';

const InternshipsSection = ({
  internships,
  editingSection,
  tempData,
  setTempData,
  startEditing,
  saveSection,
  cancelEditing
}) => {
  const renderInternship = (intern, index) => (
    <div key={index} className="border border-gray-200 rounded-lg p-3">
      <h4 className="font-medium">{intern.role}</h4>
      <p className="text-sm text-gray-600">{intern.company}</p>
      <p className="text-sm text-gray-500">
        {intern.duration} • {intern.year}
      </p>
    </div>
  );

  const renderEditableInternship = (intern, idx) => (
    <div key={idx} className="border border-gray-200 rounded-lg p-3 flex flex-col gap-2">
      <InputField
        value={intern.company}
        onChange={(e) => {
          const updated = [...tempData.internships];
          updated[idx].company = e.target.value;
          setTempData((prev) => ({ ...prev, internships: updated }));
        }}
        placeholder="Company"
      />
      <InputField
        value={intern.role}
        onChange={(e) => {
          const updated = [...tempData.internships];
          updated[idx].role = e.target.value;
          setTempData((prev) => ({ ...prev, internships: updated }));
        }}
        placeholder="Role"
      />
      <InputField
        value={intern.duration}
        onChange={(e) => {
          const updated = [...tempData.internships];
          updated[idx].duration = e.target.value;
          setTempData((prev) => ({ ...prev, internships: updated }));
        }}
        placeholder="Duration"
      />
      <InputField
        value={intern.year}
        onChange={(e) => {
          const updated = [...tempData.internships];
          updated[idx].year = e.target.value;
          setTempData((prev) => ({ ...prev, internships: updated }));
        }}
        placeholder="Year"
      />
      <button
        onClick={() => {
          const updated = tempData.internships.filter((_, i) => i !== idx);
          setTempData((prev) => ({ ...prev, internships: updated }));
        }}
        className="text-red-600 hover:underline text-sm self-end"
      >
        Delete
      </button>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <SectionHeader
        title="Internships"
        icon={<FaBriefcase className="w-5 h-5" />}
        count={internships.length}
        editingSection={editingSection}
        sectionKey="internships"
        onEdit={() => startEditing("internships")}
        onSave={saveSection}
        onCancel={cancelEditing}
      />
      <ItemList
        items={editingSection === "internships" ? tempData.internships : internships}
        editing={editingSection === "internships"}
        renderItem={renderInternship}
        renderEditableItem={renderEditableInternship}
        onAdd={() => setTempData(prev => ({
          ...prev,
          internships: [...prev.internships, { company: "", role: "", duration: "", year: "" }]
        }))}
        addButtonText="Add Internship"
      />
    </div>
  );
};

export default InternshipsSection;