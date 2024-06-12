import { $, chalk, globby, fs } from 'zx';

// Files to remove
const files = [
  '**/*.tsbuildinfo',
  '**/dist',
  '**/.next',
  '**/coverage',
  '**/.pnpm-debug.log',
  '**/.turbo',
  '**/.eslintcache',
  '**/.jestcache',
];

// Hide command outputs
$.verbose = false;

console.log(chalk.green('Cleaning up development artifacts...'));

const entries = await globby([...files, '!**/node_modules'], {
  onlyFiles: false,
});

await Promise.all(
  entries.map(async (entry) => {
    await fs.rm(entry, { recursive: true });
    console.log(chalk.white(` ☑ ${entry}`));
  }),
);
