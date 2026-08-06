import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
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
  await sharp(svg).resize(size, size).png().toFile(join(outDir, name))
}

await writePng('32x32.png', 32)
await writePng('128x128.png', 128)
await writePng('henry.w@example.net', 256)
await sharp(svg).resize(512, 512).png().toFile(join(outDir, 'icon.png'))

// Minimal ICO/ICNS placeholders as PNG copies for first builds; replace later for store polish.
await sharp(svg).resize(256, 256).png().toFile(join(outDir, 'icon.ico'))
await sharp(svg).resize(512, 512).png().toFile(join(outDir, 'icon.icns'))

console.log('Tauri icons written to src-tauri/icons')
