import esbuild from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'
import fs from 'fs'
import path from 'path'

const outdir = 'web'
const srcdir = 'src_web'

// Find all .ts and .scss files in src_web/comfyui and its subdirectories
const entryPoints = []
const comfyuiDir = path.join(srcdir, 'comfyui')

// Function to recursively find files
function findFiles(dir, pattern) {
  const files = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...findFiles(fullPath, pattern))
    } else if (entry.isFile() && entry.name.match(pattern)) {
      files.push(fullPath)
    }
  }

  return files
}

// Find all .ts and .scss files
entryPoints.push(...findFiles(comfyuiDir, /\.(ts|scss)$/))

const comfyUIPathRewritePlugin = {
  name: 'comfyui-path-rewrite',
  setup(build) {
    // For imports like "scripts/app.js"
    build.onResolve({ filter: /^scripts\// }, args => {
      return {
        path: '/scripts/' + args.path.substring("scripts/".length),
        external: true
      }
    })
  }
}

esbuild.build({
  entryPoints: entryPoints,
  bundle: true,
  outdir: path.join(outdir, 'comfyui'),
  format: 'esm',
  target: 'es2019',
  plugins: [
    sassPlugin(),
    comfyUIPathRewritePlugin
  ],
  external: ['/scripts/*'],
}).catch(() => process.exit(1)) 