/* eslint-disable no-restricted-globals */

import type { Mode } from '../dotlottie';
import { DotLottie } from '../dotlottie';
import type { EventType } from '../event-manager';

import type { WorkerError, WorkerMessage, WorkerResponse } from './worker-manager';

const dotLottieMap = new Map<string, DotLottie>();

// eslint-disable-next-line consistent-return
const handleWorkerMessage = (workerMessageEvent: MessageEvent): void => {
  const data: WorkerMessage = workerMessageEvent.data;
  const { id, method, params } = data;

  const respond = (result: unknown): void => {
    const response: WorkerResponse = { result, id };

    self.postMessage(response);
  };

  const respondError = (error: WorkerError): void => {
    const response: WorkerResponse = { error, id };

    self.postMessage(response);
  };

  try {
    if (method === 'create') {
      if (params?.config) {
        if (!params.id) return respondError({ message: 'Missing id', code: -32602 });

        const dotLottie = new DotLottie(params.config);

        dotLottieMap.set(params.id, dotLottie);

        const events: EventType[] = [
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

        events.forEach((eventName) => {
          dotLottie.addEventListener(eventName, (event) => {
            const response: WorkerResponse = { id, result: { event: eventName, details: event } };

            self.postMessage(response);
          });
        });

        respond({ success: true });
      }
    }

    if (method === 'play') {
      if (!params?.id) return respondError({ message: 'Missing id', code: -32602 });

      const dotLottieInstance = dotLottieMap.get(params.id);

      if (!dotLottieInstance) return respondError({ message: 'DotLottie instance not found', code: -32602 });

      dotLottieInstance.play();

      respond({ success: true });
    }

    if (method === 'pause') {
      if (!params?.id) return respondError({ message: 'Missing id', code: -32602 });

      const dotLottieInstance = dotLottieMap.get(params.id);

      if (!dotLottieInstance) return respondError({ message: 'DotLottie instance not found', code: -32602 });

      dotLottieInstance.pause();

      respond({ success: true });
    }

    if (method === 'stop') {
      if (!params?.id) return respondError({ message: 'Missing id', code: -32602 });

      const dotLottieInstance = dotLottieMap.get(params.id);

      if (!dotLottieInstance) return respondError({ message: 'DotLottie instance not found', code: -32602 });

      dotLottieInstance.stop();

      respond({ success: true });
    }

    if (method === 'destroy') {
      if (!params?.id) return respondError({ message: 'Missing id', code: -32602 });

      const dotLottieInstance = dotLottieMap.get(params.id);

      if (!dotLottieInstance) return respondError({ message: 'DotLottie instance not found', code: -32602 });

      dotLottieInstance.destroy();

      dotLottieMap.delete(params.id);

      respond({ success: true });
    }

    if (method === 'setSpeed') {
      if (!params?.id) return respondError({ message: 'Missing id', code: -32602 });

      const dotLottieInstance = dotLottieMap.get(params.id);

      if (!dotLottieInstance) return respondError({ message: 'DotLottie instance not found', code: -32602 });

      if (typeof params.speed !== 'number') return respondError({ message: 'Missing speed', code: -32602 });

      dotLottieInstance.setSpeed(params.speed);

      respond({ success: true });
    }

    if (method === 'setMode') {
      if (!params?.id) return respondError({ message: 'Missing id', code: -32602 });

      const dotLottieInstance = dotLottieMap.get(params.id);

      if (!dotLottieInstance) return respondError({ message: 'DotLottie instance not found', code: -32602 });

      if (typeof params.mode !== 'string') return respondError({ message: 'Missing mode', code: -32602 });

      dotLottieInstance.setMode(params.mode as Mode);

      respond({ success: true });
    }

    if (method === 'setFrame') {
      if (!params?.id) return respondError({ message: 'Missing id', code: -32602 });

      const dotLottieInstance = dotLottieMap.get(params.id);

      if (!dotLottieInstance) return respondError({ message: 'DotLottie instance not found', code: -32602 });

      if (typeof params.frame !== 'number') return respondError({ message: 'Missing frame', code: -32602 });

      dotLottieInstance.setFrame(params.frame);

      respond({ success: true });
    }

    if (method === 'load') {
      if (!params?.id) return respondError({ message: 'Missing id', code: -32602 });

      const dotLottieInstance = dotLottieMap.get(params.id);

      if (!dotLottieInstance) return respondError({ message: 'DotLottie instance not found', code: -32602 });

      if (!params.config) return respondError({ message: 'Missing config', code: -32602 });

      dotLottieInstance.load(params.config);

      respond({ success: true });
    }

    if (method === 'resize') {
      if (!params?.id) return respondError({ message: 'Missing id', code: -32602 });

      const dotLottieInstance = dotLottieMap.get(params.id);

      if (!dotLottieInstance) return respondError({ message: 'DotLottie instance not found', code: -32602 });

      if (typeof params.width !== 'number') return respondError({ message: 'Missing width', code: -32602 });
      if (typeof params.height !== 'number') return respondError({ message: 'Missing height', code: -32602 });

      dotLottieInstance.canvas.width = params.width;
      dotLottieInstance.canvas.height = params.height;

      dotLottieInstance.resize();

      respond({ success: true });
    }

    respondError({ message: 'Method not found', code: -32601 });
  } catch (error) {
    respondError({ message: 'Internal error', data: error instanceof Error ? error.message : error, code: -32603 });
  }
};

self.addEventListener('message', handleWorkerMessage);

const dummy = '';

export default dummy;
