const sharp = require('sharp');

async function convert() {
    try {
        await sharp('assets/hero_leves_new.png')
            .resize({ width: 1920, withoutEnlargement: true })
            .webp({ quality: 85 })
            .toFile('assets/hero-leves-real-desktop.webp');
        console.log('Desktop image created');

        await sharp('assets/hero_leves_new.png')
            .resize({ width: 900, withoutEnlargement: true })
            .webp({ quality: 85 })
            .toFile('assets/hero-leves-real-mobile.webp');
        console.log('Mobile image created');
    } catch (err) {
        console.error(err);
    }
}

convert();
