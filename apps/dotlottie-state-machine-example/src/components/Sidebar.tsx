import React from 'react';
import { ChevronLeft, FileJson } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import { useExampleStore } from '../store/exampleStore';

const Sidebar: React.FC = () => {
  const { isSidebarOpen, toggleSidebar, setThemeJson } = useEditorStore();
  const { examples, selectedExampleId, setSelectedExample } = useExampleStore();

  const handleExampleSelect = (id: string) => {
    setSelectedExample(id);
    const example = examples.find((ex) => ex.id === id);
    if (example) {
      setThemeJson(example.interactivityJson);
    }
  };

  return (
    <div
      className={`h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${
        isSidebarOpen ? 'w-64' : 'w-16'
      }`}
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-200">
        <h1 className={`font-bold text-gray-900 ${isSidebarOpen ? 'block' : 'hidden'}`}>Interactivity Examples</h1>
        <button onClick={toggleSidebar} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronLeft
            className={`transform transition-transform text-gray-500 ${!isSidebarOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {examples.map((example) => (
            <li key={example.id}>
              <button
                onClick={() => handleExampleSelect(example.id)}
                className={`group relative flex items-center space-x-3 w-full p-2 rounded-lg transition-colors ${
                  selectedExampleId === example.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-700'
                }`}
                title={!isSidebarOpen ? example.description || example.title : undefined}
              >
                <FileJson size={20} className={selectedExampleId === example.id ? 'text-blue-600' : 'text-gray-400'} />
                {isSidebarOpen && (
                  <div className="text-left">
                    <span className="block text-sm font-medium">{example.title}</span>
                    {example.description && <span className="block text-xs text-gray-500">{example.description}</span>}
                  </div>
                )}
                {!isSidebarOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                    {example.description || example.title}
                  </div>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
