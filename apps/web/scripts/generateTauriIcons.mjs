import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import pngToIco from 'png-to-ico'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'src-tauri', 'icons')
mkdirSync(outDir, { recursive: true })

const svg = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#12060c"/>
  <text x="256" y="300" text-anchor="middle" font-size="220" font-family="Impact, sans-serif" fill="#ffe27a">CF</text>
</svg>`)

async function writePng(name, size) {
  const path = join(outDir, name)
  await sharp(svg).resize(size, size).png().toFile(path)
  return path
}

const png32 = await writePng('32x32.png', 32)
const png128 = await writePng('128x128.png', 128)
await writePng('henry.w@example.net', 256)
const png512 = await writePng('icon.png', 512)
await writePng('icon.icns', 512)

const ico = await pngToIco([png32, png128, png512])
writeFileSync(join(outDir, 'icon.ico'), ico)

console.log('Tauri icons written to src-tauri/icons (valid ICO)')
