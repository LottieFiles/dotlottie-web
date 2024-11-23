// eslint-disable-next-line import/no-unassigned-import
import 'vitest-browser-react';

import wasmUrl from '../web/src/core/dotlottie-player.wasm?url';

import { setWasmUrl } from './src';

setWasmUrl(`http://localhost:5173/${wasmUrl}`);
