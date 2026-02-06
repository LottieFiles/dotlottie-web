// Import example code as raw strings using Vite's ?raw suffix
import basicCode from './playground-examples/basic.js?raw';
import playbackControlsCode from './playground-examples/playback-controls.js?raw';
import eventListenersCode from './playground-examples/event-listeners.js?raw';
import playSegmentCode from './playground-examples/play-segment.js?raw';
import dynamicLoadingCode from './playground-examples/dynamic-loading.js?raw';
import interactiveHoverCode from './playground-examples/interactive-hover.js?raw';

export interface PlaygroundExample {
  id: string;
  name: string;
  description: string;
  code: string;
}

export const playgroundExamples: PlaygroundExample[] = [
  {
    id: 'basic',
    name: 'Basic Animation',
    description: 'Simple load and play animation',
    code: basicCode,
  },
  {
    id: 'playback-controls',
    name: 'Playback Controls',
    description: 'Configure speed, direction, and loop modes',
    code: playbackControlsCode,
  },
  {
    id: 'event-listeners',
    name: 'Event Listeners',
    description: 'Listen to frame, complete, and load events',
    code: eventListenersCode,
  },
  {
    id: 'play-segment',
    name: 'Play Segment',
    description: 'Play specific frame ranges',
    code: playSegmentCode,
  },
  {
    id: 'dynamic-loading',
    name: 'Dynamic Loading',
    description: 'Switch animations at runtime',
    code: dynamicLoadingCode,
  },
  {
    id: 'interactive-hover',
    name: 'Interactive (Hover)',
    description: 'Play on hover interaction',
    code: interactiveHoverCode,
  },
];

export const defaultExample = playgroundExamples[0];
