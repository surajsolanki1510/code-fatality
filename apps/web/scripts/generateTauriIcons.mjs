import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import pngToIco from 'png-to-ico'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'src-tauri', 'icons')
const logoPath = join(root, 'public', 'app-logo.png')
mkdirSync(outDir, { recursive: true })

async function writePng(name, size) {
  const path = join(outDir, name)
  await sharp(logoPath).resize(size, size).png().toFile(path)
  return path
}

const png32 = await writePng('32x32.png', 32)
const png128 = await writePng('128x128.png', 128)
const png512 = await writePng('icon.png', 512)

const ico = await pngToIco([png32, png128, png512])
writeFileSync(join(outDir, 'icon.ico'), ico)

const androidResDir = join(root, 'android', 'app', 'src', 'main', 'res')
const androidSizes = [
  { folder: 'mipmap-mdpi', size: 48 },
  { folder: 'mipmap-hdpi', size: 72 },
  { folder: 'mipmap-xhdpi', size: 96 },
  { folder: 'mipmap-xxhdpi', size: 144 },
  { folder: 'mipmap-xxxhdpi', size: 192 },
]

for (const { folder, size } of androidSizes) {
  const base = join(androidResDir, folder)
  await sharp(logoPath).resize(size, size).png().toFile(join(base, 'ic_launcher.png'))
  await sharp(logoPath).resize(size, size).png().toFile(join(base, 'ic_launcher_round.png'))
  await sharp(logoPath).resize(size, size).png().toFile(join(base, 'ic_launcher_foreground.png'))
}

console.log('Updated Tauri + Android icons from public/app-logo.png')
