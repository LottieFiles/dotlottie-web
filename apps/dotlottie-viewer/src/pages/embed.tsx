import { useEffect, useState } from 'react';
import { defaultExample } from '../data/playground-examples';
import { getCodeFromUrl, getPlaygroundUrl } from '../utils/url-compression';

type ResolvedTheme = 'light' | 'dark';

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getThemeFromUrl(): ResolvedTheme | null {
  const params = new URLSearchParams(window.location.search);
  const theme = params.get('theme');
  if (theme === 'light' || theme === 'dark') {
    return theme;
  }
  return null;
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

export const Embed = (): JSX.Element => {
  const [code, setCode] = useState(defaultExample.code);
  const [error, setError] = useState<string | null>(null);
  const [playgroundUrl, setPlaygroundUrl] = useState('');
  const [theme, setTheme] = useState<ResolvedTheme>('dark');
  const [key, setKey] = useState(0);

  useEffect(() => {
    // Determine theme: URL param takes priority, then system preference
    const urlTheme = getThemeFromUrl();
    const resolvedTheme = urlTheme ?? getSystemTheme();
    setTheme(resolvedTheme);

    // Apply dark class to html for Tailwind
    if (resolvedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const codeFromUrl = getCodeFromUrl();
    if (codeFromUrl) {
      setCode(codeFromUrl);
      setPlaygroundUrl(getPlaygroundUrl(codeFromUrl));
    } else {
      setPlaygroundUrl(getPlaygroundUrl(defaultExample.code));
    }
  }, []);

  // Listen for system preference changes when no URL theme is specified
  useEffect(() => {
    const urlTheme = getThemeFromUrl();
    if (urlTheme) return; // URL param takes precedence, don't listen for changes

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent): void => {
      const newTheme = e.matches ? 'dark' : 'light';
      setTheme(newTheme);
      setKey((prev) => prev + 1);

      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'error') {
        setError(event.data.message);
      } else if (event.data?.type === 'clear-error') {
        setError(null);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Force iframe reload when code changes
  useEffect(() => {
    setKey((prev) => prev + 1);
  }, [code]);

  const bgClass = theme === 'dark' ? 'bg-dark-bg' : 'bg-[#f5f5f5]';
  const linkBgClass =
    theme === 'dark' ? 'bg-black/50 hover:bg-black/70 text-white' : 'bg-white/70 hover:bg-white/90 text-gray-800';

  return (
    <div className={`relative w-full h-screen ${bgClass}`}>
      <iframe
        key={key}
        sandbox="allow-scripts allow-same-origin"
        srcDoc={generateSrcdoc(code, theme)}
        title="Preview"
        className={`w-full h-full border-0 ${bgClass}`}
      />

      {/* Error overlay */}
      {error && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-600 text-white p-2 text-sm font-mono">{error}</div>
      )}

      {/* Edit link - bottom right corner */}
      <a
        href={playgroundUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`absolute bottom-2 right-2 px-2 py-1 text-xs rounded transition-colors ${linkBgClass}`}
      >
        Edit in Playground
      </a>
    </div>
  );
};
