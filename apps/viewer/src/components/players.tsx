import { type DotLottieCommonPlayer, DotLottiePlayer } from '@dotlottie/react-player';
import {
  type DotLottie,
  DotLottieReact,
  type RenderEvent,
  setWasmUrl as setDotLottieWasmUrl,
} from '@lottiefiles/dotlottie-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FaPause, FaPlay, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { GiNextButton, GiPreviousButton } from 'react-icons/gi';
import { ImLoop } from 'react-icons/im';
import { TbZoomIn, TbZoomOut, TbZoomReset } from 'react-icons/tb';
import { getTrackBackground, Range } from 'react-range';
import dotLottieWasmUrl from '../../../../packages/web/src/core/dotlottie-player.wasm?url';
import { useCamera } from '../hooks/use-camera';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  setActiveAnimationId,
  setAnimations,
  setCurrentFrame,
  setCurrentState,
  setLoop,
  setMarkers,
  setMuted,
  setStateMachines,
  setThemes,
  setTotalFrames,
  setVolume,
} from '../store/viewer-slice';
import DotLottieCDNPlayer from './dotlottie-cdn-player';
import DotLottieGPUPlayer from './dotlottie-gpu-player';
import LoadTime from './load-time';

setDotLottieWasmUrl(dotLottieWasmUrl);

interface PlayersProps {
  onDotLottieChange?: (dotLottie: DotLottie | null) => void;
}

export default function Players({ onDotLottieChange }: PlayersProps) {
  const lottieWebRef = useRef<DotLottieCommonPlayer | null>(null);
  const [dotLottie, setDotLottieState] = useState<DotLottie | null>(null);

  const setDotLottie = useCallback(
    (instance: DotLottie | null) => {
      setDotLottieState(instance);
      onDotLottieChange?.(instance);
    },
    [onDotLottieChange],
  );
  const src = useAppSelector((state) => state.viewer.src);
  const backgroundColor = useAppSelector((state) => state.viewer.backgroundColor);
  const speed = useAppSelector((state) => state.viewer.speed);
  const volume = useAppSelector((state) => state.viewer.volume);
  const muted = useAppSelector((state) => state.viewer.muted);
  const autoplay = useAppSelector((state) => state.viewer.autoplay);
  const loop = useAppSelector((state) => state.viewer.loop);
  const totalFrames = useAppSelector((state) => state.viewer.totalFrames);
  const currentFrame = useAppSelector((state) => state.viewer.currentFrame);
  const currentState = useAppSelector((state) => state.viewer.currentState);
  const mode = useAppSelector((state) => state.viewer.mode);
  const activeAnimationId = useAppSelector((state) => state.viewer.activeAnimationId);
  const activeThemeId = useAppSelector((state) => state.viewer.activeThemeId);
  const isJson = useAppSelector((state) => state.viewer.isJson);
  const animations = useAppSelector((state) => state.viewer.animations);
  const segment = useAppSelector((state) => state.viewer.segment);
  const useFrameInterpolation = useAppSelector((state) => state.viewer.useFrameInterpolation);
  const activeMarker = useAppSelector((state) => state.viewer.activeMarker);
  const activeStateMachineId = useAppSelector((state) => state.viewer.activeStateMachineId);
  const renderer = useAppSelector((state) => state.viewer.renderer);
  const showLottieWeb = useAppSelector((state) => state.viewer.showLottieWeb);
  const version = useAppSelector((state) => state.viewer.version);
  const availableVersions = useAppSelector((state) => state.viewer.availableVersions);
  const dispatch = useAppDispatch();
  // dragging would steal a state machine's pointer input
  const camera = useCamera(dotLottie, !activeStateMachineId);

  const coreVersion = availableVersions.find((v) => v.reactVersion === version)?.coreVersion;

  const onLoad = useCallback(() => {
    dispatch(setTotalFrames(dotLottie?.totalFrames));

    if (!src.endsWith('.json') && !src.startsWith('data:application/json')) {
      if (!activeAnimationId) {
        dispatch(setActiveAnimationId(dotLottie?.manifest?.animations?.[0]?.id || ''));
      }
      dispatch(setAnimations(dotLottie?.manifest?.animations?.map((item) => item.id) || []));
      dispatch(setThemes(dotLottie?.manifest?.themes || []));
      dispatch(setStateMachines(dotLottie?.manifest?.stateMachines || []));
      dispatch(setMarkers(dotLottie?.markers()?.map((marker) => marker.name) || []));
    }
  }, [src, dotLottie, dispatch, activeAnimationId]);

  const onRender = useCallback(
    ({ currentFrame }: RenderEvent) => {
      dispatch(setCurrentFrame(currentFrame));
    },
    [dispatch],
  );

  const onPlay = useCallback(() => {
    dispatch(setCurrentState('playing'));
  }, [dispatch]);

  const onStop = useCallback(() => {
    dispatch(setCurrentState('stopped'));
  }, [dispatch]);

  const onPause = useCallback(() => {
    dispatch(setCurrentState('paused'));
  }, [dispatch]);

  const getNext = useCallback(() => {
    const currentIndex = animations.indexOf(activeAnimationId);
    if (currentIndex === -1) return undefined;

    const nextIndex = (currentIndex + 1) % animations.length;
    return animations[nextIndex];
  }, [animations, activeAnimationId]);

  const getPrevious = useCallback(() => {
    const currentIndex = animations.indexOf(activeAnimationId);
    if (currentIndex === -1) return undefined; // or handle error

    const prevIndex = (currentIndex - 1 + animations.length) % animations.length;
    return animations[prevIndex];
  }, [animations, activeAnimationId]);

  useEffect(() => {
    if (!dotLottie) return;
    dotLottie.addEventListener('load', onLoad);
    dotLottie.addEventListener('render', onRender);
    dotLottie.addEventListener('complete', onStop);
    dotLottie.addEventListener('stop', onStop);
    dotLottie.addEventListener('play', onPlay);
    dotLottie.addEventListener('pause', onPause);

    return () => {
      dotLottie.removeEventListener('load', onLoad);
      dotLottie.removeEventListener('render', onRender);
      dotLottie.removeEventListener('complete', onStop);
      dotLottie.removeEventListener('stop', onStop);
      dotLottie.removeEventListener('play', onPlay);
      dotLottie.removeEventListener('pause', onPause);
    };
  }, [dotLottie, onLoad, onRender, onStop, onPlay, onPause]);

  useEffect(() => {
    // published versions older than setVolume don't have it
    if (typeof dotLottie?.setVolume !== 'function') return;
    dotLottie.setVolume(muted ? 0 : volume);
  }, [dotLottie, volume, muted]);

  useEffect(() => {
    if (!dotLottie) return;
    dispatch(setAnimations(dotLottie?.manifest?.animations?.map((item) => item.id) || []));
    dispatch(setThemes(dotLottie?.manifest?.themes || []));
    dispatch(setStateMachines(dotLottie?.manifest?.stateMachines || []));
  }, [dotLottie, dispatch]);

  return (
    <div className="flex flex-col items-center justify-between flex-grow h-full gap-4">
      <div className="flex justify-center h-full">
        <div className="flex flex-col dotlottie-player">
          <LoadTime
            version={version === 'local' ? 'dev' : (coreVersion ?? version)}
            className="mb-4"
            title="dotLottie Web"
          />
          <div className="flex items-center justify-center flex-grow p-4">
            <div className="relative" style={{ width: '350px', height: '350px' }}>
              {version !== 'local' ? (
                <DotLottieCDNPlayer
                  key={version}
                  version={coreVersion ?? version}
                  src={src}
                  autoplay={autoplay}
                  loop={loop}
                  speed={speed}
                  mode={mode}
                  backgroundColor={backgroundColor}
                  useFrameInterpolation={useFrameInterpolation}
                  animationId={activeAnimationId}
                  themeId={activeThemeId}
                  marker={activeMarker}
                  segment={segment}
                  stateMachineId={activeStateMachineId}
                  dotLottieRefCallback={setDotLottie}
                />
              ) : renderer === 'software' ? (
                <DotLottieReact
                  backgroundColor={backgroundColor}
                  width={350}
                  height={350}
                  autoplay={autoplay}
                  useFrameInterpolation={useFrameInterpolation}
                  loop={loop}
                  mode={mode}
                  speed={speed}
                  themeId={activeThemeId}
                  animationId={activeAnimationId}
                  stateMachineId={activeStateMachineId}
                  segment={segment as [number, number]}
                  marker={activeMarker}
                  dotLottieRefCallback={setDotLottie}
                  src={src}
                />
              ) : (
                <DotLottieGPUPlayer
                  key={renderer}
                  renderer={renderer}
                  src={src}
                  autoplay={autoplay}
                  loop={loop}
                  speed={speed}
                  mode={mode}
                  backgroundColor={backgroundColor}
                  useFrameInterpolation={useFrameInterpolation}
                  animationId={activeAnimationId}
                  themeId={activeThemeId}
                  marker={activeMarker}
                  segment={segment}
                  stateMachineId={activeStateMachineId}
                  dotLottieRefCallback={setDotLottie}
                />
              )}
              <div className="absolute flex items-center gap-1 p-1 text-xs bg-white border rounded-lg shadow-sm bottom-2 right-2">
                <button className="p-1 rounded hover:bg-subtle" title="Zoom out" onClick={camera.zoomOut}>
                  <TbZoomOut />
                </button>
                <span className="w-10 text-center tabular-nums">{Math.round(camera.zoom * 100)}%</span>
                <button className="p-1 rounded hover:bg-subtle" title="Zoom in" onClick={camera.zoomIn}>
                  <TbZoomIn />
                </button>
                <button className="p-1 rounded hover:bg-subtle" title="Reset view" onClick={camera.reset}>
                  <TbZoomReset />
                </button>
              </div>
            </div>
          </div>
        </div>
        {isJson && showLottieWeb ? (
          <div className="flex flex-col lottie-web">
            <LoadTime version="v5.12.2" className="mb-4" title="Lottie Web" />
            <div className="flex items-center justify-center flex-grow p-4">
              <div style={{ width: '350px', height: '350px' }}>
                <DotLottiePlayer
                  lottieRef={(ref) => {
                    lottieWebRef.current = ref;
                  }}
                  background={backgroundColor}
                  autoplay={autoplay}
                  loop={loop}
                  speed={speed}
                  src={src}
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <div className="flex items-center gap-4 w-full max-w-[720px]">
        {animations.length > 1 ? (
          <button
            onClick={() => {
              const next = getPrevious();
              if (next) {
                dispatch(setActiveAnimationId(next));
              }
            }}
          >
            <GiPreviousButton />
          </button>
        ) : null}
        {currentState !== 'playing' ? (
          <button
            onClick={() => {
              dotLottie?.play();
              lottieWebRef.current?.play();
            }}
          >
            <FaPlay />
          </button>
        ) : (
          <button
            onClick={() => {
              dotLottie?.pause();
              lottieWebRef.current?.pause();
            }}
          >
            <FaPause />
          </button>
        )}
        {animations.length > 1 ? (
          <button
            onClick={() => {
              const next = getNext();
              if (next) {
                dispatch(setActiveAnimationId(next));
              }
            }}
          >
            <GiNextButton />
          </button>
        ) : null}
        <Range
          min={0}
          max={totalFrames || 1}
          values={[currentFrame]}
          onChange={(values) => {
            dotLottie?.setFrame(values[0]);
            lottieWebRef.current?.seek(values[0]);
          }}
          renderTrack={({ props, children }) => (
            <div
              onMouseDown={(event) => {
                dotLottie?.pause();
                lottieWebRef.current?.pause();

                props.onMouseDown(event);
              }}
              onTouchStart={(event) => {
                dotLottie?.pause();
                lottieWebRef.current?.pause();

                props.onTouchStart(event);
              }}
              className="flex-grow w-full flex h-[20px]"
              style={{
                ...props.style,
              }}
            >
              <div
                ref={props.ref}
                className="self-center w-full h-[6px] bg-strong rounded-lg"
                style={{
                  background: getTrackBackground({
                    values: [currentFrame],
                    colors: ['#80cec8', '#ccc'],
                    min: 0,
                    max: totalFrames,
                  }),
                }}
              >
                {children}
              </div>
            </div>
          )}
          renderThumb={({ props: { key, ...thumbProps } }) => (
            <div
              key={key}
              {...thumbProps}
              style={{
                ...thumbProps.style,
                height: '20px',
                width: '20px',
                backgroundColor: '#019D91',
                borderRadius: '50%',
              }}
            />
          )}
        />

        <span className="flex items-center justify-center p-2 text-sm text-center bg-white rounded-lg">
          <span className="relative flex pr-1 text-right bg-transparent w-min">
            <span className="invisible">{totalFrames.toFixed(2)}</span>
            <span className="absolute self-center">{currentFrame.toFixed(2)}</span>
          </span>
          <span className="text-xs text-secondary">of</span>
          <span className="pl-1 bg-transparent w-max">{totalFrames}</span>
        </span>
        <button className="cursor-pointer" onClick={() => dispatch(setLoop(!loop))}>
          <ImLoop className={`${!loop ? 'text-gray-500' : ''}`} />
        </button>
        <button className="cursor-pointer" title={muted ? 'Unmute' : 'Mute'} onClick={() => dispatch(setMuted(!muted))}>
          {muted || volume === 0 ? <FaVolumeMute className="text-gray-500" /> : <FaVolumeUp />}
        </button>
        <Range
          label="Volume"
          min={0}
          max={1}
          step={0.05}
          values={[muted ? 0 : volume]}
          onChange={(values) => dispatch(setVolume(values[0]))}
          renderTrack={({ props, children }) => (
            <div
              onMouseDown={props.onMouseDown}
              onTouchStart={props.onTouchStart}
              className="flex w-20 h-[20px] shrink-0"
              style={props.style}
            >
              <div
                ref={props.ref}
                className="self-center w-full h-[4px] rounded-lg"
                style={{
                  background: getTrackBackground({
                    values: [muted ? 0 : volume],
                    colors: ['#80cec8', '#ccc'],
                    min: 0,
                    max: 1,
                  }),
                }}
              >
                {children}
              </div>
            </div>
          )}
          renderThumb={({ props: { key, ...thumbProps } }) => (
            <div
              key={key}
              {...thumbProps}
              style={{
                ...thumbProps.style,
                height: '14px',
                width: '14px',
                backgroundColor: '#019D91',
                borderRadius: '50%',
              }}
            />
          )}
        />
      </div>
    </div>
  );
}
