import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setActiveAnimationId, setActiveThemeId, setBackgroundColor, setMdode, setSpeed } from '../store/viewer-slice';
import BaseInput from './form/base-input';
import BaseSelect from './form/base-select';
import InputLabel from './form/input-label';

export default function Controls() {
  const speed = useAppSelector((state) => state.viewer.speed);
  const animations = useAppSelector((state) => state.viewer.animations);
  const themes = useAppSelector((state) => state.viewer.themes);
  const backgroundColor = useAppSelector((state) => state.viewer.backgroundColor);
  const activeAnimationId = useAppSelector((state) => state.viewer.activeAnimationId);
  const dispatch = useAppDispatch();

  return (
    <div className="flex border p-4 bg-white rounded-lg h-full">
      <div className="flex flex-col items-center gap-4 w-full">
        <InputLabel lablel="backgroundColor">
          <BaseInput
            type="color"
            defaultValue={backgroundColor}
            onChange={(event) => {
              dispatch(setBackgroundColor(event.target.value));
            }}
          />
        </InputLabel>
        <InputLabel lablel="Speed">
          <BaseInput
            type="number"
            defaultValue={speed}
            onChange={(event) => {
              dispatch(setSpeed(parseFloat(event.target.value)));
            }}
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
      </div>
    </div>
  );
}
