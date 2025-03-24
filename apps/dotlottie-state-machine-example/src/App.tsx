import React from 'react';
import Sidebar from './components/Sidebar';
import CodeEditor from './components/CodeEditor';
import SlotPanel from './components/SlotPanel';
import PreviewPanel from './components/PreviewPanel';
import PreviewToggle from './components/PreviewToggle';
import StateMachineInfo from './components/StateMachineInfo';

function App() {
  return (
    <div className="flex h-screen bg-white text-gray-900">
      <Sidebar />

      <main className="flex-1 flex flex-col p-6">
        <div className="flex gap-6 h-full">
          <div className="flex-1 flex flex-col">
            <div className="flex-1">
              <CodeEditor />
            </div>
            <div className="h-[400px] mt-6">
              <PreviewToggle />
              <PreviewPanel />
            </div>
          </div>

          <SlotPanel />
        </div>
      </main>
      <StateMachineInfo />
    </div>
  );
}

export default App;
