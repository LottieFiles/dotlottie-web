/**
 * Copyright 2022 Design Barn Inc.
 */

module.exports = {
  '*.{js,jsx,ts,tsx}': 'cross-env NODE_ENV=production eslint --cache --fix',
  // Temporarily disabled due to dependency on puppeteer
  // '*.md': 'remark --output --silently-ignore --',
  '*': 'prettier --ignore-unknown --loglevel=warn --no-editorconfig --write',
};
