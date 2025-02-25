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
                    inputName: 'rating',
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
                    inputName: 'rating',
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
                    inputName: 'rating',
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
                    inputName: 'rating',
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
                    inputName: 'rating',
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
        interactions: [
          {
            type: 'Click',
            layerName: 'star1',
            actions: [
              {
                type: 'SetNumeric',
                inputName: 'rating',
                value: 1,
              },
            ],
          },
          {
            type: 'Click',
            layerName: 'star2',
            actions: [
              {
                type: 'SetNumeric',
                inputName: 'rating',
                value: 2,
              },
            ],
          },
          {
            type: 'Click',
            layerName: 'star3',
            actions: [
              {
                type: 'SetNumeric',
                inputName: 'rating',
                value: 3,
              },
            ],
          },
          {
            type: 'Click',
            layerName: 'star4',
            actions: [
              {
                type: 'SetNumeric',
                inputName: 'rating',
                value: 4,
              },
            ],
          },
          {
            type: 'Click',
            layerName: 'star5',
            actions: [
              {
                type: 'SetNumeric',
                inputName: 'rating',
                value: 5,
              },
            ],
          },
        ],
        inputs: [
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
                    inputName: 'Explode',
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
                    inputName: 'Rain feathers',
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
            segment: 'feather',
            transitions: [
              {
                type: 'Transition',
                toState: 'Pigeon Running',
                guards: [
                  {
                    type: 'Event',
                    inputName: 'Restart',
                  },
                ],
              },
            ],
          },
        ],
        interactions: [
          {
            type: 'PointerDown',
            actions: [
              {
                type: 'Fire',
                inputName: 'Explode',
              },
            ],
          },
          {
            type: 'OnComplete',
            stateName: 'Explosion',
            actions: [
              {
                type: 'Fire',
                inputName: 'Rain feathers',
              },
            ],
          },
          {
            type: 'OnComplete',
            stateName: 'Feathers falling',
            actions: [
              {
                type: 'Fire',
                inputName: 'Restart',
              },
            ],
          },
        ],
        inputs: [
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
                    inputName: 'Step',
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
        interactions: [
          {
            type: 'PointerDown',
            actions: [
              {
                type: 'Increment',
                inputName: 'Progress',
              },
            ],
          },
        ],
        inputs: [
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
                    inputName: 'Step',
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
        interactions: [
          {
            type: 'PointerDown',
            actions: [
              {
                type: 'Increment',
                inputName: 'Progress',
              },
            ],
          },
        ],
        inputs: [
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
                    inputName: 'Step',
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
        interactions: [
          {
            type: 'PointerDown',
            actions: [
              {
                type: 'Increment',
                inputName: 'Progress',
              },
            ],
          },
        ],
        inputs: [
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
                    inputName: 'Forward',
                  },
                ],
              },
              {
                type: 'Transition',
                toState: 'Reverse',
                guards: [
                  {
                    type: 'Event',
                    inputName: 'Reverse',
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
        interactions: [
          {
            type: 'PointerEnter',
            actions: [
              {
                type: 'Fire',
                inputName: 'Forward',
              },
            ],
          },
          {
            type: 'PointerExit',
            actions: [
              {
                type: 'Fire',
                inputName: 'Reverse',
              },
            ],
          },
        ],
        inputs: [
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
                    inputName: 'Forward',
                  },
                ],
              },
              {
                type: 'Transition',
                toState: 'Reverse',
                guards: [
                  {
                    type: 'Event',
                    inputName: 'Reverse',
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
        interactions: [
          {
            type: 'PointerDown',
            actions: [
              {
                type: 'Fire',
                inputName: 'Forward',
              },
            ],
          },
          {
            type: 'PointerUp',
            actions: [
              {
                type: 'Fire',
                inputName: 'Reverse',
              },
            ],
          },
        ],
        inputs: [
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
                    inputName: 'Forward',
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
        interactions: [
          {
            type: 'PointerDown',
            actions: [
              {
                type: 'Fire',
                inputName: 'Forward',
              },
            ],
          },
        ],
        inputs: [
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
                    inputName: 'OnOffSwitch',
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
                    inputName: 'OnOffSwitch',
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
                    inputName: 'OnOffSwitch',
                    compareTo: true,
                  },
                ],
              },
            ],
          },
        ],
        interactions: [
          {
            type: 'PointerDown',
            actions: [
              {
                type: 'Toggle',
                inputName: 'OnOffSwitch',
              },
            ],
          },
        ],
        inputs: [
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
                    inputName: 'OnOffSwitch',
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
                    inputName: 'OnOffSwitch',
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
                    inputName: 'OnOffSwitch',
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
        interactions: [
          {
            type: 'PointerDown',
            actions: [
              {
                type: 'Toggle',
                inputName: 'OnOffSwitch',
              },
            ],
          },
        ],
        inputs: [
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
