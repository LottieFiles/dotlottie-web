import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  setActiveAnimationId,
  setActiveMarker,
  setActiveThemeId,
  setBackgroundColor,
  setMdode,
  setSegment,
  setSegmentInput,
  setSpeed,
  setUseFrameInterpolation,
} from '../store/viewer-slice';
import BaseInput from './form/base-input';
import BaseSelect from './form/base-select';
import InputLabel from './form/input-label';
import StepSelect from './form/step-select';
import Switch from './form/switch';

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

  const dispatch = useAppDispatch();

  return (
    <div className="flex border p-4 bg-white rounded-lg h-full">
      <div className="flex flex-col items-center gap-4 w-full">
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
              className="bg-subtle hover:bg-subtle/60 border border-subtle rounded-lg p-1 px-2 font-bold h-9"
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
