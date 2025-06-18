import React from 'react';
import { FaAward } from 'react-icons/fa';
import SectionHeader from './SectionHeader';
import InputField from './InputField';
import ItemList from './ItemList';

const CertificationsSection = ({
  certifications,
  editingSection,
  tempData,
  setTempData,
  startEditing,
  saveSection,
  cancelEditing
}) => {
  const renderCertification = (cert, index) => (
    <div key={index} className="border border-gray-200 rounded-lg p-3">
      <h4 className="font-medium">{cert.name}</h4>
      <p className="text-sm text-gray-600">
        {cert.issuer} • {cert.date}
      </p>
    </div>
  );

  const renderEditableCertification = (cert, idx) => (
    <div key={idx} className="border border-gray-200 rounded-lg p-3 flex flex-col gap-2">
      <InputField
        value={cert.name}
        onChange={(e) => {
          const updated = [...tempData.certifications];
          updated[idx].name = e.target.value;
          setTempData((prev) => ({ ...prev, certifications: updated }));
        }}
        placeholder="Certification Name"
      />
      <InputField
        value={cert.issuer}
        onChange={(e) => {
          const updated = [...tempData.certifications];
          updated[idx].issuer = e.target.value;
          setTempData((prev) => ({ ...prev, certifications: updated }));
        }}
        placeholder="Issuer"
      />
      <InputField
        value={cert.date}
        onChange={(e) => {
          const updated = [...tempData.certifications];
          updated[idx].date = e.target.value;
          setTempData((prev) => ({ ...prev, certifications: updated }));
        }}
        placeholder="Year/Date"
      />
      <button
        onClick={() => {
          const updated = tempData.certifications.filter((_, i) => i !== idx);
          setTempData((prev) => ({ ...prev, certifications: updated }));
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
        title="Certifications"
        icon={<FaAward className="w-5 h-5" />}
        count={certifications.length}
        editingSection={editingSection}
        sectionKey="certifications"
        onEdit={() => startEditing("certifications")}
        onSave={saveSection}
        onCancel={cancelEditing}
      />
      <ItemList
        items={editingSection === "certifications" ? tempData.certifications : certifications}
        editing={editingSection === "certifications"}
        renderItem={renderCertification}
        renderEditableItem={renderEditableCertification}
        onAdd={() => setTempData(prev => ({
          ...prev,
          certifications: [...prev.certifications, { name: "", issuer: "", date: "" }]
        }))}
        addButtonText="Add Certification"
      />
    </div>
  );
};

export default CertificationsSection;