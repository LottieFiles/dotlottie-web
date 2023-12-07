/**
 * Copyright 2023 Design Barn Inc.
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      headless: true,
      name: 'chromium',
      provider: 'playwright',
    },
    coverage: {
      provider: 'istanbul',
    },
    testTimeout: 10000,
    cache: false,
  },
});
