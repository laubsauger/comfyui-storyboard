import esbuild from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'
import fs from 'fs'
import path from 'path'

const outdir = 'web'
const srcdir = 'src_web'

// Find all .ts and .scss files in src_web/comfyui
const entryPoints = fs.readdirSync(path.join(srcdir, 'comfyui'))
  .filter(file => (file.endsWith('.ts') || file.endsWith('.scss')))
  .map(file => path.join(srcdir, 'comfyui', file))

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