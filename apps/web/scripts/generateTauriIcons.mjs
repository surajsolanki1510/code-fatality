import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
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
  await sharp(logoPath).resize(size, size, { fit: 'cover' }).png().toFile(path)
  return path
}

const png32 = await writePng('32x32.png', 32)
const png128 = await writePng('128x128.png', 128)
const png512 = await writePng('icon.png', 512)

const ico = await pngToIco([png32, png128, png512])
writeFileSync(join(outDir, 'icon.ico'), ico)

const androidResDir = join(root, 'android', 'app', 'src', 'main', 'res')
if (existsSync(androidResDir)) {
  const androidSizes = [
    { folder: 'mipmap-mdpi', size: 48 },
    { folder: 'mipmap-hdpi', size: 72 },
    { folder: 'mipmap-xhdpi', size: 96 },
    { folder: 'mipmap-xxhdpi', size: 144 },
    { folder: 'mipmap-xxxhdpi', size: 192 },
  ]

  for (const { folder, size } of androidSizes) {
    const base = join(androidResDir, folder)
    mkdirSync(base, { recursive: true })

    // Full logo for legacy launcher icons
    await sharp(logoPath).resize(size, size, { fit: 'cover' }).png().toFile(join(base, 'ic_launcher.png'))
    await sharp(logoPath).resize(size, size, { fit: 'cover' }).png().toFile(join(base, 'ic_launcher_round.png'))

    // Adaptive foreground: logo inset so Android mask doesn't crop the brand
    const inset = Math.round(size * 0.18)
    const inner = Math.max(size - inset * 2, 1)
    const logo = await sharp(logoPath).resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer()
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([{ input: logo, gravity: 'centre' }])
      .png()
      .toFile(join(base, 'ic_launcher_foreground.png'))
  }

  // Match brand dark void so adaptive icon doesn't use Capacitor teal/blue
  const valuesDir = join(androidResDir, 'values')
  mkdirSync(valuesDir, { recursive: true })
  writeFileSync(
    join(valuesDir, 'ic_launcher_background.xml'),
    `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#12060c</color>
</resources>
`,
  )

  console.log('Updated Android launcher icons from public/app-logo.png')
} else {
  console.log('Android project not present — skipped Android icons')
}

console.log('Updated Tauri icons from public/app-logo.png')
