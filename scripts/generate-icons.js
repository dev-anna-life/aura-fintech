import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ROOT = path.join(__dirname, '..')
const SVG_PATH = path.join(ROOT, 'public', 'aura-logo.svg')

const FOREGROUND_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="sovraAccent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#00a884"/>
    </linearGradient>
  </defs>
  <g transform="translate(64, 64) scale(0.75)">
    <path
      d="M 345 145 C 305 95 235 95 185 125 C 130 160 130 230 180 260 C 230 290 335 300 360 345 C 385 390 360 455 285 465 C 210 475 150 435 135 385"
      stroke="url(#sovraAccent)"
      stroke-width="56"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    />
    <circle cx="345" cy="145" r="22" fill="#10b981" />
    <circle cx="135" cy="385" r="22" fill="#00a884" />
  </g>
</svg>
`

const ROUND_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b3d2e"/>
      <stop offset="50%" stop-color="#07241b"/>
      <stop offset="100%" stop-color="#04140f"/>
    </linearGradient>
    <linearGradient id="sovraAccent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#00a884"/>
    </linearGradient>
  </defs>
  <circle cx="256" cy="256" r="256" fill="url(#bgGrad)"/>
  <path
    d="M 345 145 C 305 95 235 95 185 125 C 130 160 130 230 180 260 C 230 290 335 300 360 345 C 385 390 360 455 285 465 C 210 475 150 435 135 385"
    stroke="url(#sovraAccent)"
    stroke-width="56"
    stroke-linecap="round"
    stroke-linejoin="round"
    fill="none"
  />
  <circle cx="345" cy="145" r="22" fill="#10b981" />
  <circle cx="135" cy="385" r="22" fill="#00a884" />
</svg>
`

const SIZES = [
  { dir: 'mipmap-mdpi', launcher: 48, foreground: 108 },
  { dir: 'mipmap-hdpi', launcher: 72, foreground: 162 },
  { dir: 'mipmap-xhdpi', launcher: 96, foreground: 216 },
  { dir: 'mipmap-xxhdpi', launcher: 144, foreground: 324 },
  { dir: 'mipmap-xxxhdpi', launcher: 192, foreground: 432 }
]

async function run() {
  const svgBuffer = fs.readFileSync(SVG_PATH)
  const fgBuffer = Buffer.from(FOREGROUND_SVG)
  const roundBuffer = Buffer.from(ROUND_SVG)

  // Public PWA icons
  await sharp(svgBuffer).resize(512, 512).png().toFile(path.join(ROOT, 'public', 'icon-512.png'))
  await sharp(svgBuffer).resize(192, 192).png().toFile(path.join(ROOT, 'public', 'icon-192.png'))
  await sharp(svgBuffer).resize(180, 180).png().toFile(path.join(ROOT, 'public', 'apple-touch-icon.png'))
  console.log('✓ Public PWA icons generated')

  // Android mipmap icons
  const resDir = path.join(ROOT, 'android', 'app', 'src', 'main', 'res')

  for (const s of SIZES) {
    const targetDir = path.join(resDir, s.dir)
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true })

    // ic_launcher.png
    await sharp(svgBuffer).resize(s.launcher, s.launcher).png().toFile(path.join(targetDir, 'ic_launcher.png'))

    // ic_launcher_round.png
    await sharp(roundBuffer).resize(s.launcher, s.launcher).png().toFile(path.join(targetDir, 'ic_launcher_round.png'))

    // ic_launcher_foreground.png
    await sharp(fgBuffer).resize(s.foreground, s.foreground).png().toFile(path.join(targetDir, 'ic_launcher_foreground.png'))

    console.log(`✓ ${s.dir} icons generated`)
  }

  console.log('All Sovra Android and Web icons generated successfully!')
}

run().catch(console.error)
