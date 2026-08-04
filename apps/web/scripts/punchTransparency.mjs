import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(__dirname, '../public/art/story')

async function chromaKeyGreen(inputPath, outputPath, options = {}) {
  const threshold = options.threshold ?? 90
  const { data, info } = await sharp(inputPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const px = data
  for (let i = 0; i < px.length; i += 4) {
    const r = px[i]
    const g = px[i + 1]
    const b = px[i + 2]
    // green screen: strong green, low red/blue
    if (g > 140 && g - r > threshold && g - b > threshold) {
      px[i + 3] = 0
    }
  }
  await sharp(px, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toFile(outputPath)
  console.log('wrote', outputPath)
}

async function removeNearBlack(inputPath, outputPath, maxLum = 28) {
  const { data, info } = await sharp(inputPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const px = data
  for (let i = 0; i < px.length; i += 4) {
    const r = px[i]
    const g = px[i + 1]
    const b = px[i + 2]
    if (r <= maxLum && g <= maxLum && b <= maxLum) {
      px[i + 3] = 0
    }
  }
  await sharp(px, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toFile(outputPath)
  console.log('wrote', outputPath)
}

const assets = path.resolve('C:/Users/suraj/.cursor/projects/c-Users-suraj-OneDrive-Desktop-codeX/assets')

await fs.promises.mkdir(outDir, { recursive: true })
await chromaKeyGreen(path.join(assets, 'hero-green.png'), path.join(outDir, 'hero.png'))
await chromaKeyGreen(path.join(assets, 'sign-green.png'), path.join(outDir, 'sign.png'))

// also punch black from older props if present
for (const name of ['crate.png', 'board.png', 'portal.png']) {
  const p = path.join(outDir, name)
  if (fs.existsSync(p)) {
    const tmp = path.join(outDir, `_${name}`)
    await removeNearBlack(p, tmp, 22)
    await fs.promises.rename(tmp, p)
  }
}

console.log('done')
