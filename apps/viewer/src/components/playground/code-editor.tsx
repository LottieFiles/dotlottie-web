import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { keymap } from '@codemirror/view';
import { githubLight } from '@uiw/codemirror-theme-github';
import { basicSetup, EditorView } from 'codemirror';
import { useEffect, useRef } from 'react';

import { type ResolvedTheme, useTheme } from '../../context/theme-context';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun?: () => void;
}

function getThemeExtension(resolvedTheme: ResolvedTheme) {
  return resolvedTheme === 'dark' ? oneDark : githubLight;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, onRun }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<EditorView | null>(null);
  const isExternalChange = useRef(false);
  const { resolvedTheme } = useTheme();

  // Use refs for callbacks to avoid recreating the editor on every keystroke
  const onRunRef = useRef(onRun);
  onRunRef.current = onRun;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!containerRef.current) return;

    const runKeymap = keymap.of([
      {
        key: 'Mod-Enter',
        run: () => {
          onRunRef.current?.();
          return true;
        },
      },
    ]);

    const editor = new EditorView({
      doc: value,
      extensions: [
        basicSetup,
        javascript(),
        getThemeExtension(resolvedTheme),
        runKeymap,
        EditorView.updateListener.of((update) => {
          if (update.docChanged && !isExternalChange.current) {
            onChangeRef.current(update.state.doc.toString());
          }
        }),
        EditorView.theme({
          '&': { height: '100%' },
          '.cm-scroller': { overflow: 'auto' },
        }),
      ],
      parent: containerRef.current,
    });

    editorRef.current = editor;

    return () => {
      editor.destroy();
      editorRef.current = null;
    };
    // Only recreate editor when theme changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedTheme]);

  // Sync external value changes to editor
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const currentContent = editor.state.doc.toString();
    if (currentContent !== value) {
      isExternalChange.current = true;
      editor.dispatch({
        changes: {
          from: 0,
          to: currentContent.length,
          insert: value,
        },
      });
      isExternalChange.current = false;
    }
  }, [value]);

  return <div ref={containerRef} className="w-full h-full overflow-hidden" />;
};
