#!/usr/bin/env node

/**
 * Scrapes GitHub's dependents page for dotlottie-web and finds the top 10
 * highest-starred repositories.
 *
 * Usage: node scripts/top-dependents.mjs [--pages <num>]
 *
 * Options:
 *   --pages <num>  Max pages to scrape (default: all, ~30 repos per page)
 */

const BASE_URL = 'https://github.com/LottieFiles/dotlottie-web/network/dependents?dependent_type=REPOSITORY';

const DELAY_MS = 500; // Delay between requests to avoid rate-limiting

async function fetchPage(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; top-dependents-script/1.0)',
      Accept: 'text/html',
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }

  return res.text();
}

function parseDependents(html) {
  const repos = [];

  // Each dependent is in a <div class="Box-row ..."> block.
  // Repo links follow the pattern: <a data-hovercard-type="repository" ... href="/owner/repo">
  // Stars are shown with an <svg class="octicon octicon-star"> followed by a number.
  const rowRegex = /<div[^>]*class="[^"]*Box-row[^"]*"[^>]*>([\s\S]*?)(?=<div[^>]*class="[^"]*Box-row|$)/g;

  let match;

  while ((match = rowRegex.exec(html)) !== null) {
    const block = match[1];

    // Extract repo path: /owner/repo from the hovercard link
    const repoMatch = block.match(/data-hovercard-type="repository"[^>]*href="\/([^"]+)"/);

    if (!repoMatch) continue;

    const repoFullName = repoMatch[1];

    // Extract star count — the number after octicon-star SVG
    const starsMatch = block.match(/octicon-star[\s\S]*?<\/svg>\s*([\d,]+)/);
    const stars = starsMatch ? parseInt(starsMatch[1].replace(/,/g, ''), 10) : 0;

    // Extract fork count — the number after octicon-repo-forked SVG
    const forksMatch = block.match(/octicon-repo-forked[\s\S]*?<\/svg>\s*([\d,]+)/);
    const forks = forksMatch ? parseInt(forksMatch[1].replace(/,/g, ''), 10) : 0;

    repos.push({ repo: repoFullName, stars, forks });
  }

  return repos;
}

function parseNextPageUrl(html) {
  // The "Next" pagination button — href is already a full URL
  const nextMatch = html.match(/<a[^>]*href="([^"]*dependents_after=[^"]*)"[^>]*>\s*Next\b/);

  if (!nextMatch) return null;

  const raw = nextMatch[1].replace(/&amp;/g, '&');

  // href may be a full URL or a relative path
  return raw.startsWith('http') ? raw : `https://github.com${raw}`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const args = process.argv.slice(2);
  const maxPagesIdx = args.indexOf('--pages');
  const maxPages = maxPagesIdx !== -1 ? parseInt(args[maxPagesIdx + 1], 10) : Infinity;

  const allRepos = [];
  let url = BASE_URL;
  let page = 1;

  console.log('Scraping GitHub dependents for LottieFiles/dotlottie-web...\n');

  while (url && page <= maxPages) {
    process.stdout.write(`  Page ${page}...`);

    try {
      const html = await fetchPage(url);
      const repos = parseDependents(html);

      if (repos.length === 0) {
        console.log(' no repos found, stopping.');
        break;
      }

      const withStars = repos.filter((r) => r.stars > 0).length;
      console.log(` ${repos.length} repos (${withStars} with stars)`);

      allRepos.push(...repos);
      url = parseNextPageUrl(html);
      page++;

      if (url) await sleep(DELAY_MS);
    } catch (err) {
      console.error(`\n  Error on page ${page}: ${err.message}`);

      if (err.message.includes('429')) {
        console.log('  Rate limited. Waiting 60s...');
        await sleep(60_000);
        // Retry same page
      } else {
        break;
      }
    }
  }

  console.log(`\nScraped ${allRepos.length} total repositories across ${page - 1} pages.\n`);

  // Sort by stars descending
  allRepos.sort((a, b) => b.stars - a.stars || a.repo.localeCompare(b.repo));

  // Top 10
  const top10 = allRepos.slice(0, 10);

  console.log('='.repeat(70));
  console.log(' Top 10 Highest-Starred Dependents of dotlottie-web');
  console.log('='.repeat(70));
  console.log('');
  console.log(`${'#'.padStart(3)}  ${'Repository'.padEnd(45)} ${'Stars'.padStart(7)} ${'Forks'.padStart(7)}`);
  console.log('-'.repeat(70));

  top10.forEach((r, i) => {
    console.log(
      `${String(i + 1).padStart(3)}  ${r.repo.padEnd(45)} ${String(r.stars).padStart(7)} ${String(r.forks).padStart(7)}`,
    );
  });

  console.log('-'.repeat(70));
  console.log(`\nhttps://github.com/LottieFiles/dotlottie-web/network/dependents\n`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
