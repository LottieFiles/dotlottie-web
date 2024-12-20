import React from 'react';
import Editor from '@monaco-editor/react';
import { useEditorStore } from '../store/editorStore';
import { useExampleStore } from '../store/exampleStore';

const CodeEditor: React.FC = () => {
  const { themeJson, setThemeJson } = useEditorStore();
  const { examples, selectedExampleId } = useExampleStore();

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      setThemeJson(value);
    }
  };

  const selectedExample = examples.find((ex) => ex.id === selectedExampleId);

  return (
    <div className="h-full flex flex-col bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">dotLottie State Machine</h2>
        {selectedExample?.description && <p className="text-sm text-gray-500 mt-1">{selectedExample.description}</p>}
      </div>
      <div className="flex-1 p-4">
        <Editor
          height="100%"
          defaultLanguage="json"
          theme="light"
          value={themeJson}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
