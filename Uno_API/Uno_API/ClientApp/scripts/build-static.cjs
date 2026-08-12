const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const crypto = require('crypto');

const projectDir = path.resolve(__dirname, '..');
const apiProjectDir = path.resolve(projectDir, '..');
const stagingRoot = path.join(
  os.tmpdir(),
  `uno-crm-static-build-${process.pid}-${crypto.randomUUID()}`
);
const stagingDir = path.join(stagingRoot, 'app');
const sourceNodeModules = path.join(projectDir, 'node_modules');
const sourceOutDir = path.join(os.tmpdir(), 'uno-crm-build-output');
const apiWwwrootDir = path.join(apiProjectDir, 'wwwroot');
const stagedOutDir = path.join(stagingDir, 'out');
const excludedEntries = new Set([
  '.next',
  '.next-build',
  'build-output',
  'node_modules',
  'out',
  'tsconfig.tsbuildinfo',
]);

function copyProject(sourceDir, destinationDir) {
  fs.mkdirSync(destinationDir, { recursive: true });

  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    if (excludedEntries.has(entry.name)) {
      continue;
    }

    const sourcePath = path.join(sourceDir, entry.name);
    const destinationPath = path.join(destinationDir, entry.name);

    if (entry.isDirectory()) {
      copyProject(sourcePath, destinationPath);
      continue;
    }

    fs.copyFileSync(sourcePath, destinationPath);
  }
}

copyProject(projectDir, stagingDir);
fs.symlinkSync(sourceNodeModules, path.join(stagingDir, 'node_modules'), 'junction');

const nextBin = path.join(sourceNodeModules, 'next', 'dist', 'bin', 'next');
const buildResult = spawnSync(process.execPath, [nextBin, 'build', '--webpack'], {
  cwd: stagingDir,
  stdio: 'inherit',
  env: {
    ...process.env,
    NEXT_TELEMETRY_DISABLED: '1',
  },
});

if (buildResult.status !== 0) {
  process.exit(buildResult.status ?? 1);
}

fs.rmSync(sourceOutDir, { recursive: true, force: true });
fs.cpSync(stagedOutDir, sourceOutDir, { recursive: true });

fs.rmSync(apiWwwrootDir, { recursive: true, force: true });
fs.cpSync(stagedOutDir, apiWwwrootDir, { recursive: true });

fs.rmSync(stagingRoot, { recursive: true, force: true });
