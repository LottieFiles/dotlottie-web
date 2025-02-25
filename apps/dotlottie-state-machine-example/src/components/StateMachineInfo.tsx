import React, { useEffect, useRef, useState } from 'react';
import { useEditorStore } from '../store/editorStore';
import debounce from 'debounce';

const StateMachineInfo: React.FC = () => {
  const { parsedTheme, dotLottieObject } = useEditorStore();
  const [targetValue, setTargetValue] = useState(0);
  const [target, setTarget] = useState('');
  const easedValue = useEasing(targetValue, 3000, 'easeInOut');

  useEffect(() => {
    if (parsedTheme) {
      // setStateMachine(parsedTheme);
    }
  }, [parsedTheme]);

  const easingFunctions = {
    linear: (t: number) => t,
    easeIn: (t: number) => t * t,
    easeOut: (t: number) => 1 - (1 - t) * (1 - t),
    easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  };

  // Custom hook for value interpolation
  function useEasing(
    targetValue: number,
    duration: number = 1000,
    easingType: keyof typeof easingFunctions = 'easeOut',
  ) {
    const [currentValue, setCurrentValue] = useState(0);
    const startValueRef = useRef(0);
    const animationFrameRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);

    useEffect(() => {
      // Reset start value to current value when target changes
      startValueRef.current = currentValue;

      // Cancel any existing animation
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      const easingFunction = easingFunctions[easingType];
      startTimeRef.current = performance.now();

      const animate = (currentTime: number) => {
        if (!startTimeRef.current) return;

        const elapsed = currentTime - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);

        // Apply easing function
        const easedProgress = easingFunction(progress);

        // Interpolate between start and target values
        const newValue = startValueRef.current + (targetValue - startValueRef.current) * easedProgress;

        setCurrentValue(newValue);

        dotLottieObject?.stateMachineSetNumericInput(target, newValue);
        dotLottieObject?.stateMachineFire('Step');

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          // Ensure we end exactly on the target value
          setCurrentValue(targetValue);

          dotLottieObject?.stateMachineSetNumericInput(target, targetValue);
          dotLottieObject?.stateMachineFire('Step');
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);

      // Cleanup function
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [targetValue, duration, easingType, target]);

    return currentValue;
  }

  useEffect(() => {
    if (target) {
      console.log('wooo: ', target, targetValue);
      dotLottieObject?.stateMachineSetNumericInput(target, targetValue);
      dotLottieObject?.stateMachineFire('Step');
    }
  }, [targetValue, target, dotLottieObject]);

  const test = (name: any, value: any) => {
    console.log('>>>');
    setTarget(name);
    setTargetValue(parseInt(value));
  };

  const debouncedTest = debounce((name: string, value: number) => {
    test(name, value);
  }, 1000);

  return (
    <div className={`h-full flex flex-col bg-white rounded-lg border border-gray-200`}>
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Inputs</h2>
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {parsedTheme?.inputs &&
            parsedTheme.inputs.map((item, index) => {
              if (item.type === 'Numeric') {
                return (
                  <div key={index}>
                    <div className="flex">
                      <div className="w-full max-w-xs">
                        <div className="bg-whiterounded ">
                          <label className="block text-gray-700 text-sm font-bold mb-2">{item.name}</label>
                          {/* {easedValue.toFixed(2)} */}
                          <input
                            onChange={(e) => {
                              // dotLottieObject?.stateMachineSetNumericInput(item.name, parseInt(e.target.value));
                              debouncedTest(item.name, parseInt(e.target.value));
                            }}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="username"
                            type="text"
                            placeholder={item.value}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              } else if (item.type === 'Boolean') {
                return (
                  <div key={index}>
                    <div className="flex">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => {
                          const triggerValue = dotLottieObject?.stateMachineGetBooleanInput(item.name);

                          dotLottieObject?.stateMachineSetBooleanInput(item.name, !triggerValue);
                        }}
                      >
                        {item.name}
                      </button>
                    </div>
                  </div>
                );
              } else if (item.type === 'String') {
                return (
                  <div key={index}>
                    <div className="flex">
                      <div className="w-full max-w-xs">
                        <div className="bg-whiterounded ">
                          <label className="block text-gray-700 text-sm font-bold mb-2">{item.name}</label>
                          <input
                            onChange={(e) => {
                              dotLottieObject?.stateMachineSetStringInput(item.name, e.target.value);
                            }}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="username"
                            type="text"
                            placeholder={item.value}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              } else if (item.type === 'Event') {
                return (
                  <div key={index}>
                    <div className="flex">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => {
                          dotLottieObject?.stateMachineFire(item.name);
                          console.log('Firing event: ', item.name);
                        }}
                      >
                        {item.name}
                      </button>
                    </div>
                  </div>
                );
              }
              return null;
            })}
        </ul>
      </nav>
    </div>
  );
};

export default StateMachineInfo;
