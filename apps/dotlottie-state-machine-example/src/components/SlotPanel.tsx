import React, { useEffect, useRef, useState } from 'react';
import { useEditorStore } from '../store/editorStore';
import { DotLottie } from '@lottiefiles/dotlottie-web';

const SlotPanel: React.FC = () => {
  const { themeJson, updateParsedData } = useEditorStore();
  const [wasmLoaded, setWasmLoaded] = useState(false);
  const dotLottieRef = useRef<DotLottie | null>(null);

  useEffect(() => {
    dotLottieRef.current = new DotLottie({
      canvas: document.createElement('canvas'),
    });

    dotLottieRef.current.addEventListener('ready', () => {
      setWasmLoaded(true);
    });

    return () => {
      dotLottieRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (!wasmLoaded) return;

    try {
      const parsedMachine = JSON.parse(themeJson);
      updateParsedData(parsedMachine);
    } catch (e) {
      console.error('Error parsing state machine:', e);
      updateParsedData(null);
    }
  }, [themeJson, updateParsedData, wasmLoaded]);

  return <div></div>;
};

export default SlotPanel;
