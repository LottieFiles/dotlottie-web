import { DotLottie } from '@lottiefiles/dotlottie-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setSrc, setUserSrc } from '../store/viewer-slice';
import { useEffect, useRef, useState, useCallback } from 'react';
import Dropzone, { type FileError, type FileRejection, ErrorCode } from 'react-dropzone';
import Controls from '../components/controls';
import Players from '../components/players';
import SidePanel from '../components/side-panel';
import TopBar from '../components/top-bar';

export const Home = (): JSX.Element => {
  const theme = useAppSelector((state) => state.viewer.theme);
  const dispatch = useAppDispatch();

  const newPlayerRef = useRef<DotLottie | null>(null);
  const [dotLottieInstance, setDotLottieInstance] = useState<DotLottie | null>(null);

  const handleDotLottieChange = useCallback((instance: DotLottie | null) => {
    setDotLottieInstance(instance);
    newPlayerRef.current = instance;
  }, []);

  useEffect(() => {
    if (theme) {
      newPlayerRef.current?.setTheme(theme);
    } else {
      newPlayerRef.current?.setTheme('');
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
            <div className="flex h-screen gap-4 p-4" {...state.getRootProps()}>
              <input {...state.getInputProps()} />
              {state.isDragActive ? (
                <div className="fixed inset-0 z-10 flex items-center justify-center text-white bg-black bg-opacity-60 bold">
                  <div>Drop it like it's hot!</div>
                </div>
              ) : null}
              <div className="border rounded-lg bg-subtle border-subtle max-w-80">
                <SidePanel dotLottie={dotLottieInstance} />
              </div>
              <div className="flex flex-col flex-grow gap-4">
                <TopBar />
                <div className="flex flex-1 gap-4 p-4 rounded-lg bg-subtle">
                  <div className="flex-1">
                    <Players onDotLottieChange={handleDotLottieChange} />
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
};
