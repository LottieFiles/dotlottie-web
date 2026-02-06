import { useCallback, useEffect, useRef, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { CodeEditor } from '../components/playground/code-editor';
import { ConsolePanel, type ConsoleMessage } from '../components/playground/console-panel';
import { PreviewIframe } from '../components/playground/preview-iframe';
import { ErrorDisplay } from '../components/playground/error-display';
import { ExampleSelector } from '../components/playground/example-selector';
import { ResizableSplit } from '../components/playground/resizable-split';
import { defaultExample, type PlaygroundExample } from '../data/playground-examples';
import { getCodeFromUrl, getPlaygroundUrl, getEmbedHtml } from '../utils/url-compression';
import { ThemeProvider, useTheme, type Theme } from '../context/theme-context';
import brandLogo from '../assets/brand-logo.svg';

// Theme toggle icons
const SunIcon = (): JSX.Element => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const MoonIcon = (): JSX.Element => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);

const SystemIcon = (): JSX.Element => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

function ThemeToggle(): JSX.Element {
  const { theme, setTheme } = useTheme();

  const cycleTheme = useCallback(() => {
    const nextTheme: Record<Theme, Theme> = {
      light: 'dark',
      dark: 'system',
      system: 'light',
    };
    setTheme(nextTheme[theme]);
  }, [theme, setTheme]);

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <SunIcon />;
      case 'dark':
        return <MoonIcon />;
      case 'system':
        return <SystemIcon />;
    }
  };

  const getTitle = () => {
    switch (theme) {
      case 'light':
        return 'Light mode (click for dark)';
      case 'dark':
        return 'Dark mode (click for system)';
      case 'system':
        return 'System mode (click for light)';
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className="p-2 rounded-lg bg-subtle dark:bg-dark-surface border border-subtle dark:border-dark-border text-primary dark:text-dark-text hover:bg-strong dark:hover:bg-dark-border transition-colors"
      title={getTitle()}
      aria-label={getTitle()}
    >
      {getIcon()}
    </button>
  );
}

function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia('(min-width: 768px)').matches);

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 768px)');
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return isDesktop;
}

function PlaygroundContent(): JSX.Element {
  const [editorCode, setEditorCode] = useState(defaultExample.code);
  const [runningCode, setRunningCode] = useState(defaultExample.code);
  const [selectedExampleId, setSelectedExampleId] = useState(defaultExample.id);
  const [error, setError] = useState<string | null>(null);
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);
  const consoleIdRef = useRef(0);
  const isDesktop = useIsDesktop();

  const runCode = useCallback((code: string) => {
    setRunningCode(code);
    setConsoleMessages([]);
    consoleIdRef.current = 0;
  }, []);

  // Load code from URL on mount
  useEffect(() => {
    const codeFromUrl = getCodeFromUrl();
    if (codeFromUrl) {
      setEditorCode(codeFromUrl);
      runCode(codeFromUrl);
      setSelectedExampleId(''); // Clear selection since it's custom code
    }
  }, []);

  // Auto-run with debounce when code changes
  const debounceRef = useRef<number | null>(null);
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = window.setTimeout(() => {
      runCode(editorCode);
    }, 500);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [editorCode]);

  const handleRun = useCallback(() => {
    runCode(editorCode);
  }, [editorCode, runCode]);

  const handleShare = useCallback(async () => {
    const url = getPlaygroundUrl(editorCode);

    try {
      await navigator.clipboard.writeText(url);
      toast.success('URL copied to clipboard!', {
        position: 'bottom-center',
        autoClose: 2000,
        hideProgressBar: true,
      });
    } catch {
      // Fallback for browsers without clipboard API
      toast.info(`Share URL: ${url}`, {
        position: 'bottom-center',
        autoClose: 5000,
      });
    }

    // Update URL without navigation
    window.history.replaceState(null, '', url);
  }, [editorCode]);

  const handleEmbed = useCallback(async () => {
    const embedHtml = getEmbedHtml(editorCode);

    try {
      await navigator.clipboard.writeText(embedHtml);
      toast.success('Embed code copied to clipboard!', {
        position: 'bottom-center',
        autoClose: 2000,
        hideProgressBar: true,
      });
    } catch {
      toast.info(`Embed code: ${embedHtml}`, {
        position: 'bottom-center',
        autoClose: 5000,
      });
    }
  }, [editorCode]);

  const handleExampleSelect = useCallback(
    (example: PlaygroundExample) => {
      setEditorCode(example.code);
      runCode(example.code);
      setSelectedExampleId(example.id);
      setError(null);
      // Clear URL when selecting an example
      window.history.replaceState(null, '', `${import.meta.env.BASE_URL}playground`);
    },
    [runCode],
  );

  const handleError = useCallback((err: string | null) => {
    setError(err);
    if (err) {
      const msg: ConsoleMessage = { id: ++consoleIdRef.current, method: 'error', args: [err], timestamp: Date.now() };
      setConsoleMessages((prev) => [...prev, msg].slice(-500));
    }
  }, []);

  const handleDismissError = useCallback(() => {
    setError(null);
  }, []);

  const handleConsole = useCallback((method: string, args: string[]) => {
    const msg: ConsoleMessage = {
      id: ++consoleIdRef.current,
      method: method as ConsoleMessage['method'],
      args,
      timestamp: Date.now(),
    };
    setConsoleMessages((prev) => [...prev, msg].slice(-500));
  }, []);

  const handleConsoleClear = useCallback(() => {
    setConsoleMessages([]);
  }, []);

  const handleClearConsole = useCallback(() => {
    setConsoleMessages([]);
  }, []);

  const handleToggleConsole = useCallback(() => {
    setIsConsoleOpen((prev) => !prev);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-dark-bg">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-subtle dark:bg-dark-surface border-b border-subtle dark:border-dark-border">
        <div className="flex items-center gap-3">
          <a href={import.meta.env.BASE_URL} className="flex items-center gap-2">
            <img src={brandLogo} alt="LottieFiles" className="h-8" />
          </a>
          <span className="text-lg font-bold text-primary dark:text-dark-text">Playground</span>
        </div>

        <div className="flex items-center gap-2">
          <ExampleSelector selectedId={selectedExampleId} onSelect={handleExampleSelect} />
          <ThemeToggle />
          <button
            onClick={handleRun}
            className="px-4 py-2 bg-lottie text-white font-bold rounded-lg hover:bg-lottie/80 transition-colors"
            title="Run code (Ctrl/Cmd + Enter)"
          >
            Run
          </button>
          <button
            onClick={handleShare}
            className="px-4 py-2 bg-subtle dark:bg-dark-surface border border-subtle dark:border-dark-border text-primary dark:text-dark-text font-bold rounded-lg hover:bg-strong dark:hover:bg-dark-border transition-colors"
          >
            Share
          </button>
          <button
            onClick={handleEmbed}
            className="px-4 py-2 bg-subtle dark:bg-dark-surface border border-subtle dark:border-dark-border text-primary dark:text-dark-text font-bold rounded-lg hover:bg-strong dark:hover:bg-dark-border transition-colors"
            title="Copy embed iframe code"
          >
            Embed
          </button>
        </div>
      </header>

      {/* Main content - Desktop: resizable split, Mobile: stacked */}
      {isDesktop ? (
        <div className="flex flex-1 overflow-hidden">
          <ResizableSplit
            initialLeftPercent={60}
            minLeftPercent={25}
            maxLeftPercent={75}
            left={<CodeEditor value={editorCode} onChange={setEditorCode} onRun={handleRun} />}
            right={
              <div className="flex flex-col h-full">
                <div className="relative flex-1 min-h-0">
                  <PreviewIframe
                    code={runningCode}
                    onError={handleError}
                    onConsole={handleConsole}
                    onConsoleClear={handleConsoleClear}
                  />
                  {error && <ErrorDisplay error={error} onDismiss={handleDismissError} />}
                </div>
                <ConsolePanel
                  messages={consoleMessages}
                  onClear={handleClearConsole}
                  isOpen={isConsoleOpen}
                  onToggle={handleToggleConsole}
                />
              </div>
            }
          />
        </div>
      ) : (
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="relative flex-1 min-h-0">
              <PreviewIframe
                code={runningCode}
                onError={handleError}
                onConsole={handleConsole}
                onConsoleClear={handleConsoleClear}
              />
              {error && <ErrorDisplay error={error} onDismiss={handleDismissError} />}
            </div>
            <ConsolePanel
              messages={consoleMessages}
              onClear={handleClearConsole}
              isOpen={isConsoleOpen}
              onToggle={handleToggleConsole}
            />
          </div>
          <div className="flex-1 min-h-0 border-t border-subtle dark:border-dark-border">
            <CodeEditor value={editorCode} onChange={setEditorCode} onRun={handleRun} />
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export const Playground = (): JSX.Element => {
  return (
    <ThemeProvider>
      <PlaygroundContent />
    </ThemeProvider>
  );
};
