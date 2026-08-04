// Import example code as raw strings using Vite's ?raw suffix
import basicCode from './playground-examples/basic.js?raw';
import dynamicLoadingCode from './playground-examples/dynamic-loading.js?raw';
import eventListenersCode from './playground-examples/event-listeners.js?raw';
import interactiveHoverCode from './playground-examples/interactive-hover.js?raw';
import motionBellCode from './playground-examples/motion-bell.js?raw';
import motionDragCode from './playground-examples/motion-drag.js?raw';
import motionGhostTrailsCode from './playground-examples/motion-ghost-trails.js?raw';
import motionKeyframesCode from './playground-examples/motion-keyframes.js?raw';
import motionScrollParallaxCode from './playground-examples/motion-scroll-parallax.js?raw';
import motionSequenceCode from './playground-examples/motion-sequence.js?raw';
import motionSpringHoverCode from './playground-examples/motion-spring-hover.js?raw';
import motionStageEffectsCode from './playground-examples/motion-stage-effects.js?raw';
import motionStaggerCode from './playground-examples/motion-stagger.js?raw';
import playSegmentCode from './playground-examples/play-segment.js?raw';
import playbackControlsCode from './playground-examples/playback-controls.js?raw';

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
  {
    id: 'motion-bell',
    name: 'Motion: Notification Bell',
    description: 'Full micro-interaction — springs over a static, keyframe-less asset',
    code: motionBellCode,
  },
  {
    id: 'motion-spring-hover',
    name: 'Motion: Spring Hover',
    description: 'Spring named layers to a new pose on hover',
    code: motionSpringHoverCode,
  },
  {
    id: 'motion-keyframes',
    name: 'Motion: Keyframe Pop',
    description: 'Waypoint keyframes with easing in one animate() call',
    code: motionKeyframesCode,
  },
  {
    id: 'motion-stagger',
    name: 'Motion: Stagger Entrance',
    description: 'Delayed springs stagger layers into the scene',
    code: motionStaggerCode,
  },
  {
    id: 'motion-drag',
    name: 'Motion: Drag & Release',
    description: 'Drag a layer and spring it back on release',
    code: motionDragCode,
  },
  {
    id: 'motion-sequence',
    name: 'Motion: Async Sequence',
    description: 'Chain animations with await via motionComplete',
    code: motionSequenceCode,
  },
  {
    id: 'motion-scroll-parallax',
    name: 'Motion: Scroll Parallax',
    description: 'Scroll scrubs the timeline with parallax on top',
    code: motionScrollParallaxCode,
  },
  {
    id: 'motion-stage-effects',
    name: 'Motion: Stage Effects',
    description: 'Iris clip, cursor spotlight, and duotone tint on @stage',
    code: motionStageEffectsCode,
  },
  {
    id: 'motion-ghost-trails',
    name: 'Motion: Ghost Trails',
    description: 'Duplicate layers at runtime and animate the copies out',
    code: motionGhostTrailsCode,
  },
];

export const defaultExample = playgroundExamples[0];
