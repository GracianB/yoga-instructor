import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const visit = (directory) => {
  for (const item of readdirSync(directory, { withFileTypes: true })) {
    if (['.git', 'node_modules', 'dist', 'test-results', 'playwright-report'].includes(item.name)) continue;
    const path = `${directory}/${item.name}`;
    if (item.isDirectory()) visit(path);
    else if (/\.(?:js|mjs)$/.test(path)) {
      const result = spawnSync(process.execPath, ['--check', path], { stdio: 'inherit' });
      if (result.status !== 0) process.exit(1);
    }
  }
};
visit('.');
console.log('All JavaScript syntax passed');
