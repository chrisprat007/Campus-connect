import React from 'react';

const FileMessage = ({ url, fileName, fileType, fileSize }) => {
  const getFileIcon = () => {
    if (fileType.includes('image/')) {
      return (
        <div className="relative">
          <img 
            src={url} 
            alt={fileName} 
            className="max-w-full max-h-64 rounded-lg object-cover"
          />
          <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            {fileName}
          </span>
        </div>
      );
    } else if (fileType.includes('pdf')) {
      return (
        <div className="p-4 bg-red-50 rounded-lg border border-red-200 flex items-center">
          <svg className="w-10 h-10 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <div>
            <p className="font-medium text-gray-800">{fileName}</p>
            <p className="text-xs text-gray-500">{(fileSize / 1024).toFixed(1)} KB</p>
          </div>
        </div>
      );
    } else if (fileType.includes('video/')) {
      return (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <video controls className="max-w-full max-h-64">
            <source src={url} type={fileType} />
            Your browser does not support the video tag.
          </video>
          <p className="mt-2 text-sm font-medium text-gray-800">{fileName}</p>
        </div>
      );
    } else {
      return (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center">
          <svg className="w-10 h-10 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div>
            <p className="font-medium text-gray-800">{fileName}</p>
            <p className="text-xs text-gray-500">{(fileSize / 1024).toFixed(1)} KB</p>
          </div>
        </div>
      );
    }
  };

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block">
      {getFileIcon()}
    </a>
  );
};

export default FileMessage;