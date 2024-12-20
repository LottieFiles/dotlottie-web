import React, { useEffect, useRef, useState } from 'react';
import { useEditorStore } from '../store/editorStore';
import { useExampleStore } from '../store/exampleStore';
import { AlertCircle } from 'lucide-react';
import { DotLottie } from '@lottiefiles/dotlottie-web';
import StateMachineFlow from './statemachine/StateMachineFlow';
import wasmUrl from '../../.././../packages/web/dist/dotlottie-player.wasm?url';
const baseUrl = window.location.origin + import.meta.env.BASE_URL;

interface PreviewPanelProps {
  type?: 'dotlottie-web';
}

DotLottie.setWasmUrl(`${baseUrl}${wasmUrl}`);

const PreviewPanel: React.FC<PreviewPanelProps> = ({ type }) => {
  const originalRef = useRef<HTMLDivElement | HTMLCanvasElement>(null);
  const themedRef = useRef<HTMLDivElement | HTMLCanvasElement>(null);

  const [players, setPlayers] = useState<{
    original: any;
    themed: any;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { parsedTheme, previewType, setDotLottieObject } = useEditorStore();
  const { examples, selectedExampleId } = useExampleStore();

  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  const currentType = type || previewType;

  let syncToCursorCb: any;

  useEffect(() => {
    let mounted = true;

    const cleanup = () => {
      if (players) {
        players.original?.destroy?.();
        players.themed?.destroy?.();
        setPlayers(null);
      }
    };

    const selectedExample = examples.find((ex) => ex.id === selectedExampleId);
    if (!selectedExample || !originalRef.current || !themedRef.current) {
      cleanup();
      return;
    }

    setError(null);

    const loadAnimation = async () => {
      try {
        cleanup();

        if (!mounted) return;

        let data;

        if (selectedExample.animationUrl.includes('.lottie')) {
          const response = await fetch(selectedExample.animationUrl);
          data = await response.arrayBuffer();
        } else if (selectedExample.animationUrl.includes('.json')) {
          const response = await fetch(selectedExample.animationUrl);
          data = await response.json();
        } else if (selectedExample.animationUrl === '') {
          setDataLoaded(false);
          console.log('🚨🚨🚨 No animation data found');
        }

        if (!mounted) return;

        setDataLoaded(data ? true : false);

        console.log('data: ', data);

        const original = new DotLottie({
          canvas: originalRef.current as HTMLCanvasElement,
          loop: true,
          autoplay: true,
          data,
        });

        const themed = new DotLottie({
          canvas: themedRef.current as HTMLCanvasElement,
          loop: false,
          autoplay: false,
          data,
        });

        if (parsedTheme) {
          themed.addEventListener('load', () => {
            if (mounted) {
              setDotLottieObject(themed);
              const ls = themed.stateMachineLoadData(JSON.stringify(parsedTheme));
              const startSm = themed.stateMachineStart();

              console.log('PARSED THEME :', parsedTheme);
              console.log({
                'Load state machine data: ': ls,
                'Start state machine: ': startSm,
              });

              if (parsedTheme.descriptor.id === 'Sync-to-cursor') {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                syncToCursorCb = (event: MouseEvent) => {
                  const pos = Math.min((event.clientX / document.body.clientWidth) * 100, 100);
                  const frame = (themed.totalFrames * pos) / 100;

                  themed.stateMachineSetNumericTrigger('Progress', frame);
                  themed.stateMachineFire('Step');
                };

                window.addEventListener('mousemove', syncToCursorCb);
              } else {
                window.removeEventListener('mousemove', syncToCursorCb);
              }
            }
          });
        }

        if (mounted) {
          setPlayers({ original, themed });
        }
      } catch (error) {
        console.error(`Error loading ${currentType} animation:`, error);
        setError('Failed to load animation');
      }
    };

    loadAnimation();

    return () => {
      mounted = false;
      cleanup();
    };
  }, [selectedExampleId, parsedTheme, currentType, examples]);

  const renderPreview = (ref: React.RefObject<HTMLDivElement | HTMLCanvasElement>, title: string) => {
    return (
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2 min-h-[24px]">
          <h4 className="text-gray-700 text-sm font-medium">{title}</h4>
        </div>

        {!dataLoaded && (
          <div className="w-full h-[180px] bg-white rounded border border-gray-200 flex items-center justify-center">
            <div className="flex items-center gap-2 text-gray-500">
              <AlertCircle size={20} />
              <span>No animation data found</span>
            </div>
          </div>
        )}

        {error ? (
          <div className="w-full h-[180px] bg-white rounded border border-gray-200 flex items-center justify-center">
            <div className="flex items-center gap-2 text-gray-500">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          </div>
        ) : (
          <canvas
            ref={ref as React.RefObject<HTMLCanvasElement>}
            className="w-full h-[180px] bg-white rounded border border-gray-200"
          />
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full">
      <div className="grid grid-cols-2 gap-4 p-4 h-full">
        <>
          {renderPreview(originalRef, 'Original')}
          {renderPreview(themedRef, 'Interactive')}
        </>
      </div>
      {parsedTheme && dataLoaded && <StateMachineFlow data={parsedTheme} />}
    </div>
  );
};

export default PreviewPanel;
