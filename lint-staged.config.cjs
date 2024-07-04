module.exports = {
  '*.{js,jsx,ts,tsx}': 'cross-env NODE_ENV=production eslint --cache --fix',
  '*.md': 'remark --output --ignore-path .remarkignore --silently-ignore',
  '*': 'prettier --ignore-unknown --loglevel=warn --no-editorconfig --write',
};
