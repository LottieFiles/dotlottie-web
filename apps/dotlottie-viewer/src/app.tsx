/**
 * Copyright 2023 Design Barn Inc.
 */

import { DotLottie } from '@lottiefiles/dotlottie-react';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { setSrc, setUserSrc } from './store/viewer-slice';
import { useEffect, useRef } from 'react';
import Dropzone, { type FileError, type FileRejection, ErrorCode } from 'react-dropzone';
import Controls from './components/controls';
import Players from './components/players';
import SidePanel from './components/side-panel';
import TopBar from './components/top-bar';

function App() {
  const theme = useAppSelector((state) => state.viewer.theme);
  const dispatch = useAppDispatch();

  const newPlayerRef = useRef<DotLottie | null>(null);

  useEffect(() => {
    if (theme) {
      newPlayerRef.current?.loadTheme(theme);
    }
  }, [theme, newPlayerRef]);

  function onDrop(acceptedFiles: File[]) {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        dispatch(setSrc(result));
        dispatch(setUserSrc(file.name));
      }
    };
    reader.readAsDataURL(file);
  }

  function onDropRejected(fileRejections: FileRejection[]) {
    fileRejections.forEach((fileRejection) => {
      const { file, errors } = fileRejection;
      errors.forEach((error: FileError) => {
        switch (error.code) {
          case ErrorCode.FileTooLarge:
            alert(`${file.name} is too large, please pick a smaller file`);
            break;
          case ErrorCode.FileInvalidType:
            alert(`${file.name} is not supported, please pick a supported file`);
            break;
          default:
            break;
        }
      });
    });
  }

  return (
    <>
      <Dropzone noClick onDrop={onDrop} onDropRejected={onDropRejected}>
        {(state): JSX.Element => {
          return (
            <div className="flex gap-4 p-4 h-screen" {...state.getRootProps()}>
              <input {...state.getInputProps()} />
              {state.isDragActive ? (
                <div className="fixed inset-0 z-10 bg-black bg-opacity-60 flex justify-center items-center text-white bold">
                  <div>Drop it like it's hot!</div>
                </div>
              ) : null}
              <div className="bg-subtle border border-subtle rounded-lg max-w-80">
                <SidePanel />
              </div>
              <div className="flex flex-col gap-4 flex-grow">
                <TopBar />
                <div className="flex-1 flex p-4 gap-4 bg-subtle rounded-lg">
                  <div className="flex-1">
                    <Players />
                  </div>
                  <div className="w-80">
                    <Controls />
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      </Dropzone>
    </>
  );
}

export default App;
