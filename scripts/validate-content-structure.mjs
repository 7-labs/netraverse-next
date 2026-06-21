import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const TARGETS = [
  'pages/apps/[slug].js',
  'pages/games/[slug].js',
  'pages/content/[slug].js',
  'pages/win4lin/[[...slug]].js',
  'pages/merge/index.js',
  'components/ToolPage.js',
  'components/DepthSections.js',
];

async function read(file) {
  return fs.readFile(path.join(root, file), 'utf8');
}

function countMatches(source, pattern) {
  return (source.match(pattern) || []).length;
}

const errors = [];

for (const file of TARGETS) {
  const source = await read(file);
  const depthConstCount = countMatches(source, /const\s+depthSections\s*=/g);
  if (depthConstCount > 1) {
    errors.push(`${file} defines depthSections ${depthConstCount} times`);
  }

  if (source.includes('<DepthSections') && source.includes('depthSections.map(section')) {
    errors.push(`${file} renders DepthSections and also manually maps depthSections`);
  }
}

const depthSource = await read('components/DepthSections.js');
if (!depthSource.includes('<nav className="section-nav"')) {
  errors.push('components/DepthSections.js is missing the section navigation');
}
if (!depthSource.includes('scroll-margin') && !(await read('styles/globals.css')).includes('scroll-margin-top')) {
  errors.push('Depth section anchors are missing scroll-margin styling');
}

if (errors.length) {
  console.error('[validate:content-structure] FAILED');
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log('[validate:content-structure] PASS');
}
