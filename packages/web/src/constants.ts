/**
 * Copyright 2023 Design Barn Inc.
 */

/// <reference lib="webworker" />

// eslint-disable-next-line no-var
declare var self: DedicatedWorkerGlobalScope;

export const IS_BROWSER = typeof window !== 'undefined';
export const IS_NODE = typeof process !== 'undefined' && process.release.name === 'node';
export const IS_WEB_WORKER = typeof self !== 'undefined' && typeof self.postMessage === 'function';
export const MS_TO_SEC_FACTOR = 1000;
export const DEFAULT_BG_COLOR = '#00000000';
