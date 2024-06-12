import { DotLottie } from '../dotlottie';
import type { EventType } from '../event-manager';

import type { WorkerMessage } from './dotlottie.worker.types';

const dotLottieMap = new Map<string, DotLottie>();

function handleWorkerMessage(workerMessageEvent: MessageEvent): void {
  const data = workerMessageEvent.data as WorkerMessage;

  if (data.type === 'create') {
    const dotLottie = new DotLottie(data.payload.config);

    const dotLottieEvents: EventType[] = [
      'complete',
      'frame',
      'load',
      'loadError',
      'loop',
      'pause',
      'play',
      'stop',
      'destroy',
      'freeze',
      'unfreeze',
      'render',
    ];

    dotLottieEvents.forEach((eventName) => {
      dotLottie.addEventListener(eventName, (event) => {
        self.postMessage({ type: eventName, payload: { event, id: data.payload.id } });
      });
    });

    dotLottieMap.set(data.payload.id, dotLottie);
  }

  if (data.type === 'play') {
    dotLottieMap.get(data.payload.id)?.play();
  }

  if (data.type === 'pause') {
    dotLottieMap.get(data.payload.id)?.pause();
  }

  if (data.type === 'stop') {
    dotLottieMap.get(data.payload.id)?.stop();
  }

  if (data.type === 'destroy') {
    dotLottieMap.get(data.payload.id)?.destroy();
    dotLottieMap.delete(data.payload.id);
  }

  if (data.type === 'setSpeed') {
    dotLottieMap.get(data.payload.id)?.setSpeed(data.payload.speed);
  }

  if (data.type === 'setMode') {
    dotLottieMap.get(data.payload.id)?.setMode(data.payload.mode);
  }

  if (data.type === 'setFrame') {
    dotLottieMap.get(data.payload.id)?.setFrame(data.payload.frame);
  }

  if (data.type === 'load') {
    dotLottieMap.get(data.payload.id)?.load(data.payload.config);
  }

  if (data.type === 'resize') {
    const dotLottie = dotLottieMap.get(data.payload.id);

    if (dotLottie) {
      dotLottie.canvas.width = data.payload.width;
      dotLottie.canvas.height = data.payload.height;

      dotLottie.resize();
    }
  }
}

const globalScope: typeof globalThis & Window = self as unknown;

globalScope.addEventListener('message', handleWorkerMessage);

const worker = '';

export default worker;
