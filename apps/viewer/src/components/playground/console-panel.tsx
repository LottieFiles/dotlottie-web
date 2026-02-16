import { useEffect, useRef } from 'react';

export interface ConsoleMessage {
  id: number;
  method: 'log' | 'warn' | 'error' | 'info';
  args: string[];
  timestamp: number;
}

interface ConsolePanelProps {
  messages: ConsoleMessage[];
  onClear: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const methodStyles: Record<ConsoleMessage['method'], string> = {
  log: 'text-gray-800 dark:text-gray-200',
  warn: 'text-yellow-800 dark:text-yellow-200 bg-yellow-50 dark:bg-yellow-900/30',
  error: 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/30',
  info: 'text-blue-700 dark:text-blue-300',
};

const methodLabels: Record<ConsoleMessage['method'], string | null> = {
  log: null,
  warn: 'warn',
  error: 'error',
  info: 'info',
};

export const ConsolePanel: React.FC<ConsolePanelProps> = ({ messages, onClear, isOpen, onToggle }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const shouldAutoScroll = useRef(true);

  // Track whether user has scrolled up
  const handleScroll = () => {
    const el = listRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    shouldAutoScroll.current = distanceFromBottom < 30;
  };

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (shouldAutoScroll.current && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, []);

  return (
    <div className="border-t border-subtle dark:border-dark-border flex flex-col bg-white dark:bg-dark-bg">
      {/* Header bar — always visible */}
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-secondary dark:text-dark-muted hover:bg-subtle dark:hover:bg-dark-surface transition-colors select-none w-full"
      >
        <svg
          className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span>Console</span>
        {messages.length > 0 && (
          <span className="ml-auto mr-1 px-1.5 py-0.5 rounded-full text-xs bg-gray-200 dark:bg-dark-border text-secondary dark:text-dark-muted tabular-nums">
            {messages.length}
          </span>
        )}
        {messages.length > 0 && (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation();
                onClear();
              }
            }}
            className="p-0.5 rounded hover:bg-gray-300 dark:hover:bg-dark-border transition-colors"
            title="Clear console"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          </span>
        )}
      </button>

      {/* Message list */}
      {isOpen && (
        <div
          ref={listRef}
          onScroll={handleScroll}
          className="h-[200px] overflow-y-auto font-mono text-sm border-t border-subtle dark:border-dark-border"
        >
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-secondary dark:text-dark-muted text-xs">
              Console output will appear here
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`px-3 py-1 border-b border-gray-100 dark:border-dark-border/50 whitespace-pre-wrap break-all ${
                  methodStyles[msg.method]
                }`}
              >
                {methodLabels[msg.method] && <span className="opacity-60 mr-2">[{methodLabels[msg.method]}]</span>}
                {msg.args.join(' ')}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
