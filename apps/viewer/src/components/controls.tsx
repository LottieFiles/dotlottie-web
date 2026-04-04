import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  setActiveAnimationId,
  setActiveMarker,
  setActiveStateMachineId,
  setActiveThemeId,
  setAvailableVersions,
  setBackgroundColor,
  setMdode,
  setRenderer,
  setSegment,
  setSegmentInput,
  setShowLottieWeb,
  setSpeed,
  setUseFrameInterpolation,
  setVersion,
} from '../store/viewer-slice';
import BaseInput from './form/base-input';
import BaseSelect from './form/base-select';
import InputLabel from './form/input-label';
import StepSelect from './form/step-select';
import Switch from './form/switch';

const VERSIONS_TO_SHOW = 4;

export default function Controls() {
  const speed = useAppSelector((state) => state.viewer.speed);
  const animations = useAppSelector((state) => state.viewer.animations);
  const themes = useAppSelector((state) => state.viewer.themes);
  const backgroundColor = useAppSelector((state) => state.viewer.backgroundColor);
  const activeAnimationId = useAppSelector((state) => state.viewer.activeAnimationId);
  const totalFrames = useAppSelector((state) => state.viewer.totalFrames);
  const segmentInput = useAppSelector((state) => state.viewer.segmentInput);
  const useFrameInterpolation = useAppSelector((state) => state.viewer.useFrameInterpolation);
  const markers = useAppSelector((state) => state.viewer.markers);
  const stateMachines = useAppSelector((state) => state.viewer.stateMachines);
  const activeStateMachineId = useAppSelector((state) => state.viewer.activeStateMachineId);
  const renderer = useAppSelector((state) => state.viewer.renderer);
  const isJson = useAppSelector((state) => state.viewer.isJson);
  const showLottieWeb = useAppSelector((state) => state.viewer.showLottieWeb);
  const version = useAppSelector((state) => state.viewer.version);
  const availableVersions = useAppSelector((state) => state.viewer.availableVersions);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (availableVersions.length > 0) return;

    fetch('https://registry.npmjs.org/@lottiefiles/dotlottie-react')
      .then((res) => res.json())
      .then((data) => {
        const allVersions = Object.keys(data.versions);
        const recent = allVersions.slice(-VERSIONS_TO_SHOW).reverse();
        const versionPairs = recent.map((v) => ({
          reactVersion: v,
          coreVersion: data.versions[v]?.dependencies?.['@lottiefiles/dotlottie-web'] ?? v,
        }));

        dispatch(setAvailableVersions(versionPairs));
      })
      .catch((err) => {
        console.error('Failed to fetch dotlottie-react versions:', err);
      });
  }, [availableVersions.length, dispatch]);

  return (
    <div className="flex h-full p-4 bg-white border rounded-lg">
      <div className="flex flex-col items-center w-full gap-4">
        <InputLabel lablel="Version">
          <BaseSelect
            className="w-full"
            onChange={(event) => {
              dispatch(setVersion(event.target.value));
            }}
            value={version}
            items={[
              { value: 'local', label: '(dev)' },
              ...availableVersions.map((v, i) => ({
                value: v.reactVersion,
                label: i === 0 ? `${v.coreVersion} (latest)` : v.coreVersion,
              })),
            ]}
          />
        </InputLabel>
        {isJson && (
          <InputLabel lablel="Lottie Web v5.12.2">
            <Switch
              onChange={(value) => dispatch(setShowLottieWeb(value === 'true'))}
              items={[
                { label: 'Show', value: 'true' },
                { label: 'Hide', value: 'false' },
              ]}
              value={String(showLottieWeb)}
            />
          </InputLabel>
        )}
        <InputLabel lablel="Renderer">
          <Switch
            onChange={(value) => {
              dispatch(setRenderer(value));
            }}
            items={[
              { label: 'Software', value: 'software' },
              { label: 'WebGL', value: 'webgl' },
              { label: 'WebGPU', value: 'webgpu' },
            ]}
            value={renderer}
          />
        </InputLabel>
        <InputLabel lablel="backgroundColor">
          <BaseInput
            // defaultValue={backgroundColor}
            value={backgroundColor}
            onChange={(value) => {
              dispatch(setBackgroundColor(value));
            }}
          />
        </InputLabel>
        <InputLabel lablel="Speed">
          <StepSelect
            min={0.5}
            max={3}
            step={0.5}
            values={[speed]}
            onChange={(values) => {
              dispatch(setSpeed(values[0]));
            }}
          />
        </InputLabel>
        <InputLabel lablel="Mode">
          <BaseSelect
            className="w-full"
            onChange={(event) => {
              dispatch(setMdode(event.target.value));
            }}
            defaultValue="3"
            items={[
              {
                value: 'forward',
                label: 'Forward',
              },
              {
                value: 'reverse',
                label: 'Reverse',
              },
              {
                value: 'bounce',
                label: 'Bounce',
              },
              {
                value: 'reverse-bounce',
                label: 'Reverse Bounce',
              },
            ]}
          />
        </InputLabel>
        <InputLabel lablel="Segment">
          <div className="flex gap-2">
            <StepSelect
              min={1}
              max={totalFrames || 2}
              step={1}
              values={segmentInput}
              onChange={(values) => {
                dispatch(setSegmentInput(values));
              }}
            />
            <button
              className="p-1 px-2 font-bold border rounded-lg bg-subtle hover:bg-subtle/60 border-subtle h-9"
              onClick={() => {
                dispatch(setSegment(segmentInput));
              }}
            >
              Apply
            </button>
          </div>
        </InputLabel>
        <InputLabel lablel="useFrameInterpolation">
          <Switch
            onChange={(value) => {
              dispatch(setUseFrameInterpolation(value === 'true'));
            }}
            items={[
              { label: 'On', value: 'true' },
              { label: 'Off', value: 'false' },
            ]}
            value={String(useFrameInterpolation)}
          />
        </InputLabel>

        <InputLabel lablel="Animation">
          <BaseSelect
            className="w-full"
            onChange={(event) => {
              dispatch(setActiveAnimationId(event.target.value));
            }}
            value={activeAnimationId}
            emptyMessage="Single animation available for this file"
            placeholder="Select an Animation"
            items={
              animations.length === 1
                ? []
                : animations.map((animation) => ({
                    value: animation,
                    label: animation,
                  }))
            }
          />
        </InputLabel>
        <InputLabel lablel="State Machine">
          <BaseSelect
            className="w-full"
            onChange={(event) => {
              dispatch(setActiveStateMachineId(event.target.value));
            }}
            value={activeStateMachineId}
            placeholder="Select a state machine"
            emptyMessage="No state machines available for this animation"
            items={stateMachines.map((stateMachine) => ({
              value: stateMachine.id,
              label: stateMachine.id,
            }))}
          />
        </InputLabel>
        <InputLabel lablel="Themes">
          <BaseSelect
            className="w-full"
            onChange={(event) => {
              dispatch(setActiveThemeId(event.target.value));
            }}
            placeholder="default theme"
            emptyMessage="No themes available for this animation"
            items={themes.map((theme) => ({
              value: theme.id,
              label: theme.id,
            }))}
          />
        </InputLabel>
        <InputLabel lablel="Markers">
          <BaseSelect
            className="w-full"
            onChange={(event) => {
              dispatch(setActiveMarker(event.target.value));
            }}
            placeholder="Select a marker"
            emptyMessage="No markers available for this animation"
            items={markers.map((marker) => ({
              value: marker,
              label: marker,
            }))}
          />
        </InputLabel>
      </div>
    </div>
  );
}
