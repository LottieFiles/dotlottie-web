// Reports a published dev snapshot: writes the job summary and upserts a sticky
// comment on the branch's open PR. Run after `changeset publish` in release.yml.
//
// Usage:
//   node scripts/dev-release-report.mjs
//   node scripts/dev-release-report.mjs --dry-run   # print the comment, call no APIs

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MARKER = '<!-- dev-release-snapshot -->';
const BOT = 'github-actions[bot]';

const dryRun = process.argv.includes('--dry-run');

const {
  GITHUB_TOKEN,
  GITHUB_REPOSITORY,
  GITHUB_REF_NAME,
  GITHUB_SHA,
  GITHUB_RUN_ID,
  GITHUB_SERVER_URL = 'https://github.com',
  GITHUB_STEP_SUMMARY,
} = process.env;

/** Every publishable package in the workspace, so a new package is never silently skipped. */
async function publishedPackages() {
  const dirs = await fs.readdir(path.join(ROOT, 'packages'));
  const pkgs = await Promise.all(
    dirs.map(async (dir) => {
      const manifest = path.join(ROOT, 'packages', dir, 'package.json');
      const pkg = JSON.parse(await fs.readFile(manifest, 'utf-8'));

      return pkg.private ? null : pkg;
    }),
  );

  return pkgs.filter(Boolean).sort((a, b) => a.name.localeCompare(b.name));
}

function renderComment(packages, version) {
  // The web package is what people actually install; the rest go in a fold.
  const primary = packages.find((pkg) => pkg.name.endsWith('/dotlottie-web')) ?? packages[0];
  const rest = packages.filter((pkg) => pkg !== primary);

  const lines = [
    MARKER,
    '### 🚀 Dev release published',
    '',
    `All packages published at \`${version}\` under the \`dev\` dist-tag.`,
    '',
    '```sh',
    `npm i ${primary.name}@${version}`,
    '```',
    '',
  ];

  if (rest.length > 0) {
    lines.push(
      '<details><summary>Other packages</summary>',
      '',
      '```sh',
      ...rest.map((pkg) => `npm i ${pkg.name}@${version}`),
      '```',
      '',
      '</details>',
      '',
    );
  }

  const runUrl = `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}`;

  lines.push(`Built from \`${GITHUB_REF_NAME}\` @ \`${GITHUB_SHA}\` · [run](${runUrl})`);

  return lines.join('\n');
}

async function api(endpoint, options = {}) {
  const response = await fetch(`https://api.github.com${endpoint}`, {
    ...options,
    headers: {
      accept: 'application/vnd.github+json',
      authorization: `Bearer ${GITHUB_TOKEN}`,
      'x-github-api-version': '2022-11-28',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(
      `GitHub API ${options.method ?? 'GET'} ${endpoint} failed: ${response.status} ${await response.text()}`,
    );
  }

  return response.json();
}

/** The open PR for this branch, or null when the release was cut from a bare branch. */
async function findOpenPullRequest() {
  const [owner] = GITHUB_REPOSITORY.split('/');
  const query = new URLSearchParams({ head: `${owner}:${GITHUB_REF_NAME}`, state: 'open' });
  const [pr] = await api(`/repos/${GITHUB_REPOSITORY}/pulls?${query}`);

  return pr ?? null;
}

/**
 * Our own previous report, if any. Matching on the marker alone is not enough:
 * anyone quoting the comment copies the marker with it, and we must not edit
 * a human's comment.
 */
async function findPreviousComment(prNumber) {
  const comments = await api(`/repos/${GITHUB_REPOSITORY}/issues/${prNumber}/comments?per_page=100`);

  return comments.find((comment) => comment.user.login === BOT && comment.body.startsWith(MARKER)) ?? null;
}

const packages = await publishedPackages();
const { version } = packages.find((pkg) => pkg.name.endsWith('/dotlottie-web')) ?? packages[0];
const body = renderComment(packages, version);

if (dryRun) {
  console.log(body);
  process.exit(0);
}

if (GITHUB_STEP_SUMMARY) await fs.appendFile(GITHUB_STEP_SUMMARY, `${body}\n`);

const pr = await findOpenPullRequest();

if (!pr) {
  console.log(`Published ${version}, but '${GITHUB_REF_NAME}' has no open PR — nothing to comment on.`);
  process.exit(0);
}

const previous = await findPreviousComment(pr.number);

// Upsert, so repeated dev releases on one PR don't pile up comments.
if (previous) {
  await api(`/repos/${GITHUB_REPOSITORY}/issues/comments/${previous.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ body }),
  });
  console.log(`Updated comment ${previous.id} on PR #${pr.number} with ${version}`);
} else {
  await api(`/repos/${GITHUB_REPOSITORY}/issues/${pr.number}/comments`, {
    method: 'POST',
    body: JSON.stringify({ body }),
  });
  console.log(`Commented on PR #${pr.number} with ${version}`);
}
