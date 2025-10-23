const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

const SPRITE_WIDTH = 64;
const SPRITE_HEIGHT = 64;
const SHEET_COLS = 13;
const SHEET_ROWS = 21;

// Define layer combinations for each character class
const characterClasses = {
  warrior: {
    layers: [
      'BODY_male.png',
      'LEGS_pants_greenish.png',
      'TORSO_chain_armor_torso.png',
      'TORSO_chain_armor_jacket_purple.png',
      'HEAD_chain_armor_hood.png',
    ]
  },
  mage: {
    layers: [
      'BODY_male.png',
      'LEGS_robe_skirt.png',
      'TORSO_robe_shirt_brown.png',
      'HEAD_robe_hood.png',
    ]
  },
  rogue: {
    layers: [
      'BODY_male.png',
      'LEGS_pants_greenish.png',
      'TORSO_leather_armor_torso.png',
      'TORSO_leather_armor_bracers.png',
      'HEAD_leather_armor_hat.png',
    ]
  },
  healer: {
    layers: [
      'BODY_male.png',
      'LEGS_robe_skirt.png',
      'TORSO_leather_armor_shirt_white.png',
      'HEAD_robe_hood.png',
    ]
  },
  knight: {
    layers: [
      'BODY_male.png',
      'LEGS_plate_armor_pants.png',
      'TORSO_plate_armor_torso.png',
      'TORSO_plate_armor_arms_shoulders.png',
      'HEAD_plate_armor_helmet.png',
    ]
  },
  archer: {
    layers: [
      'BODY_male.png',
      'LEGS_pants_greenish.png',
      'TORSO_leather_armor_shoulders.png',
      'TORSO_leather_armor_bracers.png',
      'HEAD_hair_blonde.png',
    ]
  },
};

async function compositeSprites(className, config, sourceDir, outputPath) {
  console.log(`Creating ${className} sprite sheet...`);

  // Create canvas for full sprite sheet
  const canvas = createCanvas(
    SPRITE_WIDTH * SHEET_COLS,
    SPRITE_HEIGHT * SHEET_ROWS
  );
  const ctx = canvas.getContext('2d');

  // Load all layer images
  const images = [];
  for (const layerFile of config.layers) {
    const layerPath = path.join(sourceDir, layerFile);
    if (fs.existsSync(layerPath)) {
      try {
        const img = await loadImage(layerPath);
        images.push(img);
      } catch (err) {
        console.warn(`Warning: Could not load ${layerFile}:`, err.message);
      }
    } else {
      console.warn(`Warning: ${layerFile} not found`);
    }
  }

  // Draw all layers on top of each other
  for (const img of images) {
    ctx.drawImage(img, 0, 0);
  }

  // Save the composite sprite sheet
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  console.log(`✓ Created ${className} sprite at ${outputPath}`);
}

async function generateAllSprites() {
  const sourceDir = path.join(__dirname, '../public/sprites/lpc_assets/lpc_entry/png/walkcycle');
  const outputDir = path.join(__dirname, '../public/sprites/characters');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate sprite for each class
  for (const [className, config] of Object.entries(characterClasses)) {
    const outputPath = path.join(outputDir, `${className}-sprites.png`);
    await compositeSprites(className, config, sourceDir, outputPath);
  }

  console.log('\n✓ All character sprites generated successfully!');
}

generateAllSprites().catch(console.error);
