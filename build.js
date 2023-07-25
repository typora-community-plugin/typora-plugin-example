import * as child_process from 'node:child_process'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import * as esbuild from 'esbuild'
import typoraPlugin from 'esbuild-plugin-typora'


const args = process.argv.slice(2)
const IS_PROD = args.includes('--prod')
const IS_DEV = !IS_PROD

await esbuild.build({
  entryPoints: ['src/main.ts', 'src/style.css'],
  outdir: 'dist',
  format: 'esm',
  bundle: true,
  minify: IS_PROD,
  sourcemap: IS_DEV,
  plugins: [
    typoraPlugin({
      mode: IS_PROD ? 'production' : 'development'
    }),
  ],
})

if (IS_DEV) {

  const manifestPath = './src/manifest.json'
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'))

  await fs.cp('./dist', './test/vault/.typora/plugins/dist', { recursive: true })
  await fs.copyFile(manifestPath, './dist/manifest.json')
  await fs.writeFile('./test/vault/.typora/plugins.json', JSON.stringify({ [manifest.id]: true }))

  await fs.rm(path.join(process.env.USERPROFILE, '.typora/plugins/.lock/win-test'))
    .catch(() => { })

  child_process.exec('Typora ./test/vault/doc.md')
}
