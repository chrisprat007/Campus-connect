import React from 'react';
import { FaAward } from 'react-icons/fa';
import SectionHeader from './SectionHeader';
import InputField from './InputField';
import ItemList from './ItemList';

const AchievementsSection = ({
  achievements,
  editingSection,
  tempData,
  setTempData,
  startEditing,
  saveSection,
  cancelEditing
}) => {
  const renderAchievement = (ach, index) => (
    <div key={index} className="border border-gray-200 rounded-lg p-3">
      <h4 className="font-medium">{ach.title}</h4>
      <p className="text-sm text-gray-600">{ach.year}</p>
    </div>
  );

  const renderEditableAchievement = (ach, idx) => (
    <div key={idx} className="border border-gray-200 rounded-lg p-3 flex flex-col gap-2">
      <InputField
        value={ach.title}
        onChange={(e) => {
          const updated = [...tempData.achievements];
          updated[idx].title = e.target.value;
          setTempData((prev) => ({ ...prev, achievements: updated }));
        }}
        placeholder="Achievement Title"
      />
      <InputField
        value={ach.year}
        onChange={(e) => {
          const updated = [...tempData.achievements];
          updated[idx].year = e.target.value;
          setTempData((prev) => ({ ...prev, achievements: updated }));
        }}
        placeholder="Year"
      />
      <button
        onClick={() => {
          const updated = tempData.achievements.filter((_, i) => i !== idx);
          setTempData((prev) => ({ ...prev, achievements: updated }));
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
        title="Achievements"
        icon={<FaAward className="w-5 h-5" />}
        count={achievements.length}
        editingSection={editingSection}
        sectionKey="achievements"
        onEdit={() => startEditing("achievements")}
        onSave={saveSection}
        onCancel={cancelEditing}
      />
      <ItemList
        items={editingSection === "achievements" ? tempData.achievements : achievements}
        editing={editingSection === "achievements"}
        renderItem={renderAchievement}
        renderEditableItem={renderEditableAchievement}
        onAdd={() => setTempData(prev => ({
          ...prev,
          achievements: [...prev.achievements, { title: "", year: "" }]
        }))}
        addButtonText="Add Achievement"
      />
    </div>
  );
};

export default AchievementsSection;