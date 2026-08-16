const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const assetsDir = path.join(__dirname, 'assets');
const logosDir = path.join(assetsDir, 'logos');

// Helpers
const getFiles = (dir) => fs.readdirSync(dir).filter(f => f.endsWith('.png') || f.endsWith('.jpg'));

async function processHeroImage(filename) {
    const filePath = path.join(assetsDir, filename);
    const basename = path.basename(filename, path.extname(filename));
    
    // Desktop version (max 1920)
    await sharp(filePath)
        .resize({ width: 1920, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(path.join(assetsDir, `${basename}-desktop.webp`));
    console.log(`Generated: ${basename}-desktop.webp`);

    // Mobile version (max 768)
    await sharp(filePath)
        .resize({ width: 768, withoutEnlargement: true })
        .webp({ quality: 75 })
        .toFile(path.join(assetsDir, `${basename}-mobile.webp`));
    console.log(`Generated: ${basename}-mobile.webp`);
}

async function processCardImage(filename) {
    const filePath = path.join(assetsDir, filename);
    const basename = path.basename(filename, path.extname(filename));
    
    // Cards usually don't need to be larger than 600-800px on retina
    await sharp(filePath)
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(path.join(assetsDir, `${basename}.webp`));
    console.log(`Generated: ${basename}.webp`);
}

async function processBeforeAfterImage(filename) {
    const filePath = path.join(assetsDir, filename);
    const basename = path.basename(filename, path.extname(filename));
    
    // Desktop Before/After
    await sharp(filePath)
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(path.join(assetsDir, `${basename}-desktop.webp`));
    console.log(`Generated: ${basename}-desktop.webp`);

    // Mobile Before/After
    await sharp(filePath)
        .resize({ width: 768, withoutEnlargement: true })
        .webp({ quality: 75 })
        .toFile(path.join(assetsDir, `${basename}-mobile.webp`));
    console.log(`Generated: ${basename}-mobile.webp`);
}

async function processLogo(filename) {
    const filePath = path.join(logosDir, filename);
    const basename = path.basename(filename, path.extname(filename));
    
    // Logos usually small, max width 400px
    await sharp(filePath)
        .resize({ width: 400, withoutEnlargement: true })
        .webp({ quality: 90, lossless: true }) // usually transparent and solid colors, high quality
        .toFile(path.join(logosDir, `${basename}.webp`));
    console.log(`Generated: ${basename}.webp`);
}

async function processOtherAsset(filename) {
    const filePath = path.join(assetsDir, filename);
    const basename = path.basename(filename, path.extname(filename));
    
    await sharp(filePath)
        .resize({ width: 1920, withoutEnlargement: true }) // fallback
        .webp({ quality: 80 })
        .toFile(path.join(assetsDir, `${basename}.webp`));
    console.log(`Generated: ${basename}.webp`);
}

async function run() {
    console.log("Starting image optimization...");

    // Assets
    const assetFiles = getFiles(assetsDir);
    for (const file of assetFiles) {
        if (file.includes('hero') || file.includes('_bg')) {
            await processHeroImage(file);
        } else if (file.includes('svc_')) {
            await processCardImage(file);
        } else if (file.includes('before') || file.includes('after')) {
            await processBeforeAfterImage(file);
        } else {
            await processOtherAsset(file);
        }
    }

    // Logos
    const logoFiles = getFiles(logosDir);
    for (const file of logoFiles) {
        await processLogo(file);
    }

    console.log("Optimization complete.");
}

run().catch(console.error);
