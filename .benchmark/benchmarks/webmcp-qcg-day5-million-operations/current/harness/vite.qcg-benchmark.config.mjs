import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const harnessDirectory = dirname(fileURLToPath(import.meta.url))

export default {
  root: resolve(harnessDirectory, '../../../../../prototype/webmcp-qcg'),
  resolve: { preserveSymlinks: true },
  ssr: { noExternal: true }
}
