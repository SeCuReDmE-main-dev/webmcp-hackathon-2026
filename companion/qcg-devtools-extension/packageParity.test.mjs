import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const root = new URL('./', import.meta.url)
const version = JSON.parse(readFileSync(new URL('./package.json', root), 'utf8')).version
const entries = [
  'background.js', 'contentBridge.js', 'devtools.html', 'devtools.js',
  'icons/inspector-q-avatar.jpg', 'icons/qcg-16.png', 'icons/qcg-32.png',
  'icons/qcg-48.png', 'icons/qcg-128.png',
  'INSTALL.md', 'manifest.json', 'pageBridge.js', 'panel.css', 'panel.html',
  'panel.js', 'snapshotSanitizer.js'
]
const packages = [
  { label: 'production', archiveName: `qcg-console-companion-${version}.zip`, manifestSource: 'manifest.json' },
  { label: 'development', archiveName: `qcg-console-companion-dev-${version}.zip`, manifestSource: 'manifest.dev.json' },
]
const publicLocations = [
  { label: 'root', prefix: '../../prototype/webmcp-qcg/public/' },
  { label: 'downloads', prefix: '../../prototype/webmcp-qcg/public/downloads/' },
]

for (const packageSpec of packages) {
  for (const location of publicLocations) {
    const archive = fileURLToPath(new URL(`${location.prefix}${packageSpec.archiveName}`, root))
    const archivedEntries = execFileSync('tar', ['-tf', archive], { encoding: 'utf8' }).trim().split(/\r?\n/).filter((entry) => entry && !entry.endsWith('/')).sort()
    assert.deepEqual(archivedEntries, [...entries].sort(), `the public ${packageSpec.label} Companion ZIP in ${location.label} must contain only runtime files`)
    for (const entry of entries) {
      const archived = execFileSync('tar', ['-xOf', archive, entry])
      const sourceName = entry === 'manifest.json' ? packageSpec.manifestSource : entry
      const source = readFileSync(new URL(`./${sourceName}`, root))
      assert.equal(Buffer.compare(archived, source), 0, `${entry} in the public ${packageSpec.label} ZIP in ${location.label} must match the current extension source byte for byte`)
    }
  }
}

console.log(`QCG Companion ${version} production and development ZIPs match every runtime source file in both public locations.`)
