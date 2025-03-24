import React from 'react';

const PreviewToggle: React.FC = () => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
      <div className="flex bg-gray-100 p-1 rounded-lg">
        <button
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors 
            bg-white text-gray-900 shadow-sm'
`}
        >
          dotLottie Web
        </button>
      </div>
    </div>
  );
};

export default PreviewToggle;
