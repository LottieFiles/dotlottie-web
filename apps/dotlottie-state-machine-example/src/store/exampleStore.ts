import { create } from 'zustand';

export interface InteractivityExample {
  id: string;
  title: string;
  interactivityJson: string;
  animationUrl: string;
  description?: string;
  supportedPlayers: string[];
}

interface ExampleState {
  examples: InteractivityExample[];
  selectedExampleId: string | null;
  setSelectedExample: (id: string) => void;
}

const examples: InteractivityExample[] = [
  {
    id: 'star-rating',
    title: 'Star Rating',
    description: 'Rate your experience',
    animationUrl: 'https://lottie.host/90e7f6e9-462a-4560-b1d7-4cedf81b5421/bWWD1bAgE4.json',
    interactivityJson: JSON.stringify(
      {
        initial: 'global',
        states: [
          {
            name: 'global',
            type: 'GlobalState',
            animation: '',
            transitions: [
              {
                type: 'Transition',
                toState: 'star_1',
                guards: [
                  {
                    type: 'Numeric',
                    conditionType: 'Equal',
                    triggerName: 'rating',
                    compareTo: 1,
                  },
                ],
              },
              {
                type: 'Transition',
                toState: 'star_2',
                guards: [
                  {
                    type: 'Numeric',
                    conditionType: 'Equal',
                    triggerName: 'rating',
                    compareTo: 2,
                  },
                ],
              },
              {
                type: 'Transition',
                toState: 'star_3',
                guards: [
                  {
                    type: 'Numeric',
                    conditionType: 'Equal',
                    triggerName: 'rating',
                    compareTo: 3,
                  },
                ],
              },
              {
                type: 'Transition',
                toState: 'star_4',
                guards: [
                  {
                    type: 'Numeric',
                    conditionType: 'Equal',
                    triggerName: 'rating',
                    compareTo: 4,
                  },
                ],
              },
              {
                type: 'Transition',
                toState: 'star_5',
                guards: [
                  {
                    type: 'Numeric',
                    conditionType: 'Equal',
                    triggerName: 'rating',
                    compareTo: 5,
                  },
                ],
              },
            ],
          },
          {
            type: 'PlaybackState',
            name: 'star_1',
            animation: '',
            autoplay: true,
            segment: 'star_1',
            transitions: [],
            entryActions: [],
          },
          {
            type: 'PlaybackState',
            name: 'star_2',
            animation: '',
            autoplay: true,
            segment: 'star_2',
            transitions: [],
            entryActions: [],
          },
          {
            type: 'PlaybackState',
            name: 'star_3',
            animation: '',
            autoplay: true,
            segment: 'star_3',
            transitions: [],
          },
          {
            type: 'PlaybackState',
            name: 'star_4',
            animation: '',
            autoplay: true,
            segment: 'star_4',
            transitions: [],
          },
          {
            type: 'PlaybackState',
            name: 'star_5',
            animation: '',
            autoplay: true,
            segment: 'star_5',
            transitions: [],
          },
        ],
        listeners: [
          {
            type: 'PointerDown',
            layerName: 'star1',
            actions: [
              {
                type: 'SetNumeric',
                triggerName: 'rating',
                value: 1,
              },
            ],
          },
          {
            type: 'PointerDown',
            layerName: 'star2',
            actions: [
              {
                type: 'SetNumeric',
                triggerName: 'rating',
                value: 2,
              },
            ],
          },
          {
            type: 'PointerDown',
            layerName: 'star3',
            actions: [
              {
                type: 'SetNumeric',
                triggerName: 'rating',
                value: 3,
              },
            ],
          },
          {
            type: 'PointerDown',
            layerName: 'star4',
            actions: [
              {
                type: 'SetNumeric',
                triggerName: 'rating',
                value: 4,
              },
            ],
          },
          {
            type: 'PointerDown',
            layerName: 'star5',
            actions: [
              {
                type: 'SetNumeric',
                triggerName: 'rating',
                value: 5,
              },
            ],
          },
        ],
        triggers: [
          {
            type: 'Numeric',
            name: 'rating',
            value: 0,
          },
        ],
      },
      null,
      2,
    ),
    supportedPlayers: ['dotlottie-web'],
  },
  {
    id: 'exploding-pigeon',
    title: 'Exploding Pigeon',
    description: 'Pigeon go boom',
    animationUrl: 'https://lottie.host/899f8fbb-55db-4a51-8a64-96f1bc4e45d7/9BiY1S0tDm.json',
    interactivityJson: JSON.stringify(
      {
        initial: 'Pigeon Running',
        states: [
          {
            animation: 'pigeon',
            type: 'PlaybackState',
            name: 'Pigeon Running',
            loop: true,
            autoplay: true,
            segment: 'bird',
            transitions: [
              {
                type: 'Transition',
                toState: 'Explosion',
                guards: [
                  {
                    type: 'Event',
                    triggerName: 'Explode',
                  },
                ],
              },
            ],
          },
          {
            animation: 'pigeon',
            type: 'PlaybackState',
            name: 'Explosion',
            loop: false,
            autoplay: true,
            segment: 'explosion',
            speed: 0.1,
            transitions: [
              {
                type: 'Transition',
                toState: 'Feathers falling',
                guards: [
                  {
                    type: 'Event',
                    triggerName: 'Rain feathers',
                  },
                ],
              },
            ],
          },
          {
            animation: 'pigeon',
            type: 'PlaybackState',
            name: 'Feathers falling',
            loop: false,
            autoplay: true,
            segment: 'feathers',
            transitions: [
              {
                type: 'Transition',
                toState: 'Pigeon Running',
                guards: [
                  {
                    type: 'Event',
                    triggerName: 'Restart',
                  },
                ],
              },
            ],
          },
        ],
        listeners: [
          {
            type: 'PointerDown',
            actions: [
              {
                type: 'Fire',
                triggerName: 'Explode',
              },
            ],
          },
          {
            type: 'OnComplete',
            stateName: 'Explosion',
            actions: [
              {
                type: 'Fire',
                triggerName: 'Rain feathers',
              },
            ],
          },
          {
            type: 'OnComplete',
            stateName: 'Feathers falling',
            actions: [
              {
                type: 'Fire',
                triggerName: 'Restart',
              },
            ],
          },
        ],
        triggers: [
          {
            type: 'Event',
            name: 'Explode',
          },
          {
            type: 'Event',
            name: 'Rain feathers',
          },
          {
            type: 'Event',
            name: 'Restart',
          },
        ],
      },
      null,
      2,
    ),
    supportedPlayers: ['dotlottie-web'],
  },
  {
    id: 'sync-to-cursor',
    title: 'Sync to-cursor',
    description: 'Move the mouse to animate',
    animationUrl: 'https://lottie.host/e8593e62-09fd-48c4-9d7a-2fc35317d62f/6zVMp3lZf5.lottie',
    interactivityJson: JSON.stringify(
      {
        initial: 'Start',
        states: [
          {
            animation: 'scroll',
            type: 'PlaybackState',
            name: 'Start',
            transitions: [
              {
                type: 'Transition',
                toState: 'Start',
                guards: [
                  {
                    type: 'Event',
                    triggerName: 'Step',
                  },
                ],
              },
            ],
            entryActions: [
              {
                type: 'SetFrame',
                value: '$Progress',
              },
            ],
          },
        ],
        listeners: [
          {
            type: 'PointerDown',
            actions: [
              {
                type: 'Increment',
                triggerName: 'Progress',
              },
            ],
          },
        ],
        triggers: [
          {
            type: 'Numeric',
            name: 'Progress',
            value: 0,
          },
          {
            type: 'Event',
            name: 'Step',
          },
        ],
      },
      null,
      2,
    ),
    supportedPlayers: ['dotlottie-web'],
  },
  {
    id: 'interactive-stats',
    title: 'Interactive Statistics.',
    description: 'Up the progress to affect the bar graph.',
    animationUrl: 'https://lottie.host/fba88936-b753-4751-a6ca-94db246157cf/5pGajCeC0B.json',
    interactivityJson: JSON.stringify(
      {
        initial: 'Start',
        states: [
          {
            animation: 'stats',
            type: 'PlaybackState',
            name: 'Start',
            transitions: [
              {
                type: 'Transition',
                toState: 'Start',
                guards: [
                  {
                    type: 'Event',
                    triggerName: 'Step',
                  },
                ],
              },
            ],
            entryActions: [
              {
                type: 'SetProgress',
                value: '$Progress',
              },
            ],
          },
        ],
        listeners: [
          {
            type: 'PointerDown',
            actions: [
              {
                type: 'Increment',
                triggerName: 'Progress',
              },
            ],
          },
        ],
        triggers: [
          {
            type: 'Numeric',
            name: 'Progress',
            value: 0,
          },
          {
            type: 'Event',
            name: 'Step',
          },
        ],
      },
      null,
      2,
    ),
    supportedPlayers: ['dotlottie-web'],
  },
  {
    id: 'loader',
    title: 'Pretty loader.',
    description: "Up the progress to affect the loader's advancement.",
    animationUrl: 'https://lottie.host/8bec049d-6b29-48f2-9592-df21853df42e/5AqIkEhG0r.json',
    interactivityJson: JSON.stringify(
      {
        initial: 'Start',
        states: [
          {
            animation: 'stats',
            type: 'PlaybackState',
            name: 'Start',
            transitions: [
              {
                type: 'Transition',
                toState: 'Start',
                guards: [
                  {
                    type: 'Event',
                    triggerName: 'Step',
                  },
                ],
              },
            ],
            entryActions: [
              {
                type: 'SetProgress',
                value: '$Progress',
              },
            ],
          },
        ],
        listeners: [
          {
            type: 'PointerDown',
            actions: [
              {
                type: 'Increment',
                triggerName: 'Progress',
              },
            ],
          },
        ],
        triggers: [
          {
            type: 'Numeric',
            name: 'Progress',
            value: 0,
          },
          {
            type: 'Event',
            name: 'Step',
          },
        ],
      },
      null,
      2,
    ),
    supportedPlayers: ['dotlottie-web'],
  },
  {
    id: 'hoverBtn',
    title: 'Hover Button.',
    description: 'Hover over the button!',
    animationUrl: 'https://lottie.host/9be40797-ef92-451f-add9-d6f66a78635a/lqnums50Xh.json',
    interactivityJson: JSON.stringify(
      {
        initial: 'Start',
        states: [
          {
            animation: '',
            type: 'GlobalState',
            name: 'Start',
            transitions: [
              {
                type: 'Transition',
                toState: 'Forward',
                guards: [
                  {
                    type: 'Event',
                    triggerName: 'Forward',
                  },
                ],
              },
              {
                type: 'Transition',
                toState: 'Reverse',
                guards: [
                  {
                    type: 'Event',
                    triggerName: 'Reverse',
                  },
                ],
              },
            ],
          },
          {
            animation: '',
            type: 'PlaybackState',
            name: 'Forward',
            mode: 'Forward',
            autoplay: true,
            transitions: [],
          },
          {
            animation: '',
            type: 'PlaybackState',
            name: 'Reverse',
            mode: 'Reverse',
            autoplay: true,
            transitions: [],
          },
        ],
        listeners: [
          {
            type: 'PointerEnter',
            actions: [
              {
                type: 'Fire',
                triggerName: 'Forward',
              },
            ],
          },
          {
            type: 'PointerExit',
            actions: [
              {
                type: 'Fire',
                triggerName: 'Reverse',
              },
            ],
          },
        ],
        triggers: [
          {
            type: 'Event',
            name: 'Forward',
          },
          {
            type: 'Event',
            name: 'Reverse',
          },
        ],
      },
      null,
      2,
    ),
    supportedPlayers: ['dotlottie-web'],
  },
  {
    id: 'holdBtn',
    title: 'Hold (long press) the button down.',
    description: "Can't hold me down!",
    animationUrl: 'https://lottie.host/9be40797-ef92-451f-add9-d6f66a78635a/lqnums50Xh.json',
    interactivityJson: JSON.stringify(
      {
        initial: 'Start',
        states: [
          {
            animation: '',
            type: 'GlobalState',
            name: 'Start',
            transitions: [
              {
                type: 'Transition',
                toState: 'Forward',
                guards: [
                  {
                    type: 'Event',
                    triggerName: 'Forward',
                  },
                ],
              },
              {
                type: 'Transition',
                toState: 'Reverse',
                guards: [
                  {
                    type: 'Event',
                    triggerName: 'Reverse',
                  },
                ],
              },
            ],
          },
          {
            animation: '',
            type: 'PlaybackState',
            name: 'Forward',
            mode: 'Forward',
            autoplay: true,
            transitions: [],
          },
          {
            animation: '',
            type: 'PlaybackState',
            name: 'Reverse',
            mode: 'Reverse',
            autoplay: true,
            transitions: [],
          },
        ],
        listeners: [
          {
            type: 'PointerDown',
            actions: [
              {
                type: 'Fire',
                triggerName: 'Forward',
              },
            ],
          },
          {
            type: 'PointerUp',
            actions: [
              {
                type: 'Fire',
                triggerName: 'Reverse',
              },
            ],
          },
        ],
        triggers: [
          {
            type: 'Event',
            name: 'Forward',
          },
          {
            type: 'Event',
            name: 'Reverse',
          },
        ],
      },
      null,
      2,
    ),
    supportedPlayers: ['dotlottie-web'],
  },
  {
    id: 'clickBtn',
    title: 'Click',
    description: 'Click the button!',
    animationUrl: 'https://lottie.host/9be40797-ef92-451f-add9-d6f66a78635a/lqnums50Xh.json',
    interactivityJson: JSON.stringify(
      {
        initial: 'Start',
        states: [
          {
            animation: '',
            type: 'GlobalState',
            name: 'Start',
            transitions: [
              {
                type: 'Transition',
                toState: 'Forward',
                guards: [
                  {
                    type: 'Event',
                    triggerName: 'Forward',
                  },
                ],
              },
            ],
          },
          {
            animation: '',
            type: 'PlaybackState',
            name: 'Forward',
            mode: 'Forward',
            autoplay: true,
            transitions: [],
          },
        ],
        listeners: [
          {
            type: 'PointerDown',
            actions: [
              {
                type: 'Fire',
                triggerName: 'Forward',
              },
            ],
          },
        ],
        triggers: [
          {
            type: 'Event',
            name: 'Forward',
          },
        ],
      },
      null,
      2,
    ),
    supportedPlayers: ['dotlottie-web'],
  },
  {
    id: 'toggleBtn',
    title: 'Toggle',
    description: 'Toggle the button!',
    animationUrl: 'https://lottie.host/8c2590c3-3aaa-4d47-b6cd-1ef979e284f4/2ykhbXYDAc.json',
    interactivityJson: JSON.stringify(
      {
        initial: 'initial-wait',
        states: [
          {
            name: 'initial-wait',
            type: 'PlaybackState',
            animation: '',
            transitions: [
              {
                type: 'Transition',
                toState: 'a',
                guards: [
                  {
                    type: 'Boolean',
                    conditionType: 'Equal',
                    triggerName: 'OnOffSwitch',
                    compareTo: true,
                  },
                ],
              },
            ],
          },
          {
            name: 'a',
            type: 'PlaybackState',
            animation: '',
            autoplay: true,
            speed: 2.0,
            transitions: [
              {
                type: 'Transition',
                toState: 'b',
                guards: [
                  {
                    type: 'Boolean',
                    conditionType: 'Equal',
                    triggerName: 'OnOffSwitch',
                    compareTo: false,
                  },
                ],
              },
            ],
          },
          {
            name: 'b',
            type: 'PlaybackState',
            animation: '',
            autoplay: true,
            speed: 2.0,
            mode: 'Reverse',
            transitions: [
              {
                type: 'Transition',
                toState: 'a',
                guards: [
                  {
                    type: 'Boolean',
                    conditionType: 'Equal',
                    triggerName: 'OnOffSwitch',
                    compareTo: true,
                  },
                ],
              },
            ],
          },
        ],
        listeners: [
          {
            type: 'PointerDown',
            actions: [
              {
                type: 'Toggle',
                triggerName: 'OnOffSwitch',
              },
            ],
          },
        ],
        triggers: [
          {
            type: 'Boolean',
            name: 'OnOffSwitch',
            value: false,
          },
        ],
      },
      null,
      2,
    ),
    supportedPlayers: ['dotlottie-web'],
  },
  {
    id: 'themingAction',
    title: 'Theme Action in action',
    description: '',
    animationUrl: 'https://lottie.host/9a5a6605-fc90-4935-8d10-9df4c83902ff/PFUKH53LJk.lottie',
    interactivityJson: JSON.stringify(
      {
        initial: 'initial-wait',
        states: [
          {
            name: 'initial-wait',
            type: 'PlaybackState',
            animation: '',
            transitions: [
              {
                type: 'Transition',
                toState: 'a',
                guards: [
                  {
                    type: 'Boolean',
                    conditionType: 'Equal',
                    triggerName: 'OnOffSwitch',
                    compareTo: true,
                  },
                ],
              },
            ],
            entryActions: [
              {
                type: 'SetTheme',
                value: 'air',
              },
            ],
          },
          {
            name: 'a',
            type: 'PlaybackState',
            animation: '',
            autoplay: true,
            speed: 2.0,
            transitions: [
              {
                type: 'Transition',
                toState: 'b',
                guards: [
                  {
                    type: 'Boolean',
                    conditionType: 'Equal',
                    triggerName: 'OnOffSwitch',
                    compareTo: false,
                  },
                ],
              },
            ],
            entryActions: [
              {
                type: 'SetTheme',
                value: 'water',
              },
            ],
          },
          {
            name: 'b',
            type: 'PlaybackState',
            animation: '',
            autoplay: true,
            speed: 2.0,
            mode: 'Reverse',
            transitions: [
              {
                type: 'Transition',
                toState: 'a',
                guards: [
                  {
                    type: 'Boolean',
                    conditionType: 'Equal',
                    triggerName: 'OnOffSwitch',
                    compareTo: true,
                  },
                ],
              },
            ],
            entryActions: [
              {
                type: 'SetTheme',
                value: 'earth',
              },
            ],
          },
        ],
        listeners: [
          {
            type: 'PointerDown',
            actions: [
              {
                type: 'Toggle',
                triggerName: 'OnOffSwitch',
              },
            ],
          },
        ],
        triggers: [
          {
            type: 'Boolean',
            name: 'OnOffSwitch',
            value: false,
          },
        ],
      },
      null,
      2,
    ),
    supportedPlayers: ['dotlottie-web'],
  },
];

export const useExampleStore = create<ExampleState>((set) => ({
  examples,
  selectedExampleId: examples[0].id,
  setSelectedExample: (id) => set({ selectedExampleId: id }),
}));
