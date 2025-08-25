import fs from 'node:fs';
const paths = [
  'src/pages/ReportsLegacy',
  'src/pages/Playground',
  'src/components/old',
  'src/styles/legacy'
];
paths.forEach(p => fs.rmSync(p, { recursive: true, force: true }));
console.log('Purged paths:', paths);
