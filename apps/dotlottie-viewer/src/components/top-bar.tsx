/**
 * Copyright 2023 Design Barn Inc.
 */

import { useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { resetUserConfig, setSrc, setUserSrc } from '../store/viewer-slice';

import Dropzone, { type FileError, type FileRejection, ErrorCode } from 'react-dropzone';

interface TopBarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const TopBar: React.FC<TopBarProps> = ({ className = '', ...props }) => {
  const dispatch = useAppDispatch();
  const input = useRef<HTMLInputElement | null>(null);
  const userSrc = useAppSelector((state) => state.viewer.userSrc);

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
    <div className={`flex justify-center items-center gap-2 bg-strong px-4 py-2 rounded-lg ${className}`} {...props}>
      {!userSrc ? (
        <>
          <span className="font-bold">Try it yourself!</span>

          <Dropzone onDrop={onDrop} onDropRejected={onDropRejected}>
            {(state): JSX.Element => {
              return (
                <button className="p-2 bg-subtle hover:bg-hover rounded-lg font-bold" {...state.getRootProps()}>
                  <input {...state.getInputProps()} />
                  Browse file
                </button>
              );
            }}
          </Dropzone>
          <span>or</span>
          <input ref={input} className="p-2 rounded-lg flex-grow" placeholder="Paste JSON or .lottie URL" />
          <button
            className="p-2 bg-subtle hover:bg-hover rounded-lg font-bold"
            onClick={() => {
              if (!input.current) return;
              dispatch(setSrc(input.current.value));
              dispatch(setUserSrc(input.current.value));
            }}
          >
            Load animation
          </button>
        </>
      ) : (
        <>
          <span className="">{userSrc}</span>
          <button
            className="p-2 bg-subtle hover:bg-hover rounded-lg font-bold"
            onClick={() => {
              dispatch(resetUserConfig());
            }}
          >
            Reset
          </button>
        </>
      )}
    </div>
  );
};

export default TopBar;
