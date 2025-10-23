const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

// Character classes with their color schemes
const characterClasses = {
  warrior: { hue: 0, saturation: 1.2, brightness: 1.0, description: 'Red/Orange tint' },
  mage: { hue: 250, saturation: 1.5, brightness: 1.1, description: 'Purple/Blue tint' },
  rogue: { hue: 120, saturation: 0.8, brightness: 0.9, description: 'Dark Green tint' },
  healer: { hue: 140, saturation: 1.3, brightness: 1.2, description: 'Bright Green tint' },
  knight: { hue: 45, saturation: 1.4, brightness: 1.1, description: 'Gold/Yellow tint' },
  archer: { hue: 180, saturation: 1.2, brightness: 1.0, description: 'Cyan/Teal tint' },
};

// Apply color transformation to image data
function applyColorTransform(imageData, hueShift, saturationMult, brightnessMult) {
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // Skip fully transparent pixels
    if (a === 0) continue;

    // Skip very dark pixels (likely outlines/shadows)
    const brightness = (r + g + b) / 3;
    if (brightness < 30) continue;

    // Convert RGB to HSL
    const max = Math.max(r, g, b) / 255;
    const min = Math.min(r, g, b) / 255;
    const l = (max + min) / 2;

    let h = 0;
    let s = 0;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max * 255) {
        case r:
          h = ((g - b) / 255 / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / 255 / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / 255 / d + 4) / 6;
          break;
      }
    }

    // Apply transformations
    h = (h * 360 + hueShift) % 360 / 360;
    s = Math.min(1, s * saturationMult);
    const newL = Math.min(1, l * brightnessMult);

    // Convert back to RGB
    let newR, newG, newB;

    if (s === 0) {
      newR = newG = newB = newL;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = newL < 0.5 ? newL * (1 + s) : newL + s - newL * s;
      const p = 2 * newL - q;

      newR = hue2rgb(p, q, h + 1/3);
      newG = hue2rgb(p, q, h);
      newB = hue2rgb(p, q, h - 1/3);
    }

    data[i] = Math.round(newR * 255);
    data[i + 1] = Math.round(newG * 255);
    data[i + 2] = Math.round(newB * 255);
  }

  return imageData;
}

async function generateClassSprites() {
  const sourceImage = path.join(__dirname, '../public/sprites/characters/tiny16-animations.png');
  const outputDir = path.join(__dirname, '../public/sprites/characters');

  console.log('Loading base sprite sheet...');
  const baseImage = await loadImage(sourceImage);

  const canvas = createCanvas(baseImage.width, baseImage.height);
  const ctx = canvas.getContext('2d');

  // Generate a sprite for each class
  for (const [className, config] of Object.entries(characterClasses)) {
    console.log(`Generating ${className} sprite (${config.description})...`);

    // Draw base image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(baseImage, 0, 0);

    // Get image data and apply color transformation
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const transformedData = applyColorTransform(
      imageData,
      config.hue,
      config.saturation,
      config.brightness
    );

    // Put transformed data back
    ctx.putImageData(transformedData, 0, 0);

    // Save to file
    const outputPath = path.join(outputDir, `${className}-sprites.png`);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);

    console.log(`✓ Created ${className}-sprites.png`);
  }

  console.log('\n✅ All class sprites generated successfully!');
  console.log('Created sprites for: ' + Object.keys(characterClasses).join(', '));
}

// Run the generator
generateClassSprites().catch(console.error);
