import fs from 'fs';

// Read the scraped NAFDAC products
const products = JSON.parse(fs.readFileSync('nafdac_products.json', 'utf-8'));

// Group products by genericName
const genericMap: Record<string, any> = {};

for (const product of products) {
  const genericName = product.genericName || 'Unknown';
  if (!genericMap[genericName]) {
    genericMap[genericName] = {
      id: genericName.replace(/\s+/g, '_').toLowerCase(),
      name: genericName,
      category: '', // You can fill this in later if you have category info
      description: '', // You can fill this in later if you have description info
      indication: '', // You can fill this in later if you have indication info
      brandProducts: []
    };
  }
  genericMap[genericName].brandProducts.push({
    id: product.id,
    brandName: product.brandName,
    manufacturer: product.manufacturer,
    strength: product.strength,
    dosageForm: product.dosageForm,
    packSize: product.packSize,
    verified: product.verified,
    rating: product.rating,
    image: product.image,
    bioequivalence: product.bioequivalence,
    nafdacNumber: product.nafdacNumber,
    type: product.type,
    countryOfOrigin: product.countryOfOrigin
  });
}

const genericDrugs = Object.values(genericMap);

// Write to data/genericDrugs.ts
const output = `export const genericDrugs = ${JSON.stringify(genericDrugs, null, 2)};\n`;
fs.writeFileSync('data/genericDrugs.ts', output, 'utf-8');

console.log('Generated data/genericDrugs.ts for import.'); 