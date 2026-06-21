import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const editorialSource = await fs.readFile(path.join(root, 'lib/editorialInsights.js'), 'utf8');
const appPage = await fs.readFile(path.join(root, 'pages/apps/[slug].js'), 'utf8');
const gamePage = await fs.readFile(path.join(root, 'pages/games/[slug].js'), 'utf8');

const priorityApps = [
  'microsoft-office',
  'microsoft-excel',
  'microsoft-word',
  'adobe-photoshop',
  'adobe-premiere-pro',
  'autocad',
  'quickbooks',
  'microsoft-teams',
  'zoom',
  'slack',
  'vs-code',
  'google-chrome',
  'onedrive',
];

const priorityGames = [
  'fortnite',
  'apex-legends',
  'valorant',
  'destiny-2',
  'minecraft',
  'elden-ring',
  'counter-strike-2',
  'grand-theft-auto-v',
  'baldurs-gate-3',
  'cyberpunk-2077',
  'helldivers-2',
];

function hasKey(source, key) {
  return source.includes(`'${key}':`) || source.includes(`${key}:`);
}

const errors = [];
const missingApps = priorityApps.filter(key => !hasKey(editorialSource, key));
const missingGames = priorityGames.filter(key => !hasKey(editorialSource, key));

if (missingApps.length) errors.push(`missing priority app insights: ${missingApps.join(', ')}`);
if (missingGames.length) errors.push(`missing priority game insights: ${missingGames.join(', ')}`);
if (!appPage.includes('getAppEditorialSections(app)')) {
  errors.push('app detail page does not render app editorial insights');
}
if (!gamePage.includes('getGameEditorialSections(game)')) {
  errors.push('game detail page does not render game editorial insights');
}
if (!gamePage.includes('getRelatedGames(game)')) {
  errors.push('game detail page does not render related game links');
}

if (errors.length) {
  console.error('[validate:editorial] FAILED');
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(
    `[validate:editorial] PASS priorityApps=${priorityApps.length} priorityGames=${priorityGames.length}`,
  );
}
