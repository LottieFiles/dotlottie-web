import { useEffect, useRef, useState } from 'react';

import { useTheme, type ResolvedTheme } from '../../context/theme-context';

interface PreviewIframeProps {
  code: string;
  onError: (error: string | null) => void;
  onConsole?: (method: string, args: string[]) => void;
  onConsoleClear?: () => void;
}

function generateSrcdoc(code: string, theme: ResolvedTheme): string {
  const bgColor = theme === 'dark' ? '#1e1e1e' : '#f5f5f5';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%;
      height: 100%;
      background: ${bgColor};
      display: flex;
      align-items: center;
      justify-content: center;
    }
    canvas {
      max-width: 100%;
      max-height: 100%;
    }
  </style>
</head>
<body>
  <script type="module">
    // Error handling
    window.onerror = (message, source, lineno, colno, error) => {
      window.parent.postMessage({
        type: 'error',
        message: error?.message || String(message),
        line: lineno
      }, '*');
      return true;
    };

    window.onunhandledrejection = (event) => {
      window.parent.postMessage({
        type: 'error',
        message: 'Unhandled Promise rejection: ' + (event.reason?.message || String(event.reason))
      }, '*');
    };

    // Console interception
    (function() {
      function serialize(arg) {
        if (arg instanceof Error) return arg.stack || arg.message;
        if (typeof arg === 'object' && arg !== null) {
          try { return JSON.stringify(arg, null, 2); } catch { return String(arg); }
        }
        return String(arg);
      }

      ['log', 'warn', 'error', 'info'].forEach(function(method) {
        const orig = console[method].bind(console);
        console[method] = function(...args) {
          orig(...args);
          window.parent.postMessage({
            type: 'console',
            method: method,
            args: args.map(serialize)
          }, '*');
        };
      });

      const origClear = console.clear.bind(console);
      console.clear = function() {
        origClear();
        window.parent.postMessage({ type: 'console-clear' }, '*');
      };
    })();

    // Clear any previous error
    window.parent.postMessage({ type: 'clear-error' }, '*');
  </script>
  <script type="module">
    // User code runs here (separate module to allow top-level imports)
${code}
  </script>
</body>
</html>`;
}

export const PreviewIframe: React.FC<PreviewIframeProps> = ({ code, onError, onConsole, onConsoleClear }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [key, setKey] = useState(0);
  const { resolvedTheme } = useTheme();
  const isInitialMount = useRef(true);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'error') {
        onError(event.data.message);
      } else if (event.data?.type === 'clear-error') {
        onError(null);
      } else if (event.data?.type === 'console') {
        onConsole?.(event.data.method, event.data.args);
      } else if (event.data?.type === 'console-clear') {
        onConsoleClear?.();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onError, onConsole, onConsoleClear]);

  // Force iframe reload when code or theme changes (skip initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setKey((prev) => prev + 1);
  }, [code, resolvedTheme]);

  return (
    <iframe
      key={key}
      ref={iframeRef}
      sandbox="allow-scripts allow-same-origin"
      srcDoc={generateSrcdoc(code, resolvedTheme)}
      title="Preview"
      className="w-full h-full border-0 bg-[#f5f5f5] dark:bg-dark-bg"
    />
  );
};
