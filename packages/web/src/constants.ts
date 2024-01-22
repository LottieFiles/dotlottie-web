/**
 * Copyright 2023 Design Barn Inc.
 */

export const IS_BROWSER = typeof window !== 'undefined' && typeof window.document !== 'undefined';
// eslint-disable-next-line no-restricted-globals
export const IS_WEB_WORKER = typeof self !== 'undefined' && typeof Window === 'undefined';
export const IS_NODE = typeof global !== 'undefined';
export const MS_TO_SEC_FACTOR = 1000;
export const DEFAULT_BG_COLOR = '#00000000';
