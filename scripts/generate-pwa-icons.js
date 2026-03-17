#!/usr/bin/env node
/**
 * PWA Icon Generator
 * Generates favicon and PWA icons in various sizes from a source image.
 * Usage: node scripts/generate-pwa-icons.js [source-path]
 * Default source: public/sb.png
 */

const fs = require('fs');
const path = require('path');

// Sizes for PWA and favicon
const ICON_SIZES = [16, 32, 48, 72, 96, 128, 144, 152, 192, 384, 512];
const FAVICON_SIZES = [16, 32, 48];

async function generateIcons() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch (e) {
    console.error('Error: sharp is not installed. Run: npm install sharp --save-dev');
    process.exit(1);
  }

  const projectRoot = path.resolve(__dirname, '..');
  const sourcePath = process.argv[2] || path.join(projectRoot, 'public', 'sb.png');
  const outputDir = path.join(projectRoot, 'public', 'icons');

  if (!fs.existsSync(sourcePath)) {
    console.error(`Error: Source image not found at ${sourcePath}`);
    console.error('Usage: node scripts/generate-pwa-icons.js [path/to/source.png]');
    process.exit(1);
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`Generating icons from: ${sourcePath}`);
  console.log(`Output directory: ${outputDir}\n`);

  for (const size of ICON_SIZES) {
    const filename = `icon-${size}x${size}.png`;
    const outputPath = path.join(outputDir, filename);

    await sharp(sourcePath)
      .resize(size, size)
      .png()
      .toFile(outputPath);

    console.log(`  ✓ ${filename}`);
  }

  // Create PNG favicons (browsers support PNG favicons)
  await sharp(sourcePath)
    .resize(32, 32)
    .png()
    .toFile(path.join(projectRoot, 'public', 'favicon-32x32.png'));

  await sharp(sourcePath)
    .resize(16, 16)
    .png()
    .toFile(path.join(projectRoot, 'public', 'favicon-16x16.png'));

  await sharp(sourcePath)
    .resize(48, 48)
    .png()
    .toFile(path.join(projectRoot, 'public', 'favicon-48x48.png'));

  console.log('  ✓ favicon-16x16.png');
  console.log('  ✓ favicon-32x32.png');
  console.log('  ✓ favicon-48x48.png');

  // Apple touch icon (180x180 for iOS)
  await sharp(sourcePath)
    .resize(180, 180)
    .png()
    .toFile(path.join(projectRoot, 'public', 'apple-touch-icon.png'));
  console.log('  ✓ apple-touch-icon.png');

  console.log('\n✓ Icon generation complete!');
}

generateIcons().catch((err) => {
  console.error('Generation failed:', err);
  process.exit(1);
});
