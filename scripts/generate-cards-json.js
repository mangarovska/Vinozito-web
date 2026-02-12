const fs = require('fs');
const path = require('path');

// Configuration
const GCS_BASE_URL = 'https://storage.googleapis.com/lunar-echo-storage/vinozito-data';
const DATA_DIR = '/home/nnikolovskii/vinozito-data';
const OUTPUT_FILE = 'cards-import.json';

// Category name mapping (folder name -> proper category name)
const categoryMapping = {
  'activities': 'Activities',
  'food': 'Food',
  'drinks': 'Drinks',
  'fruits': 'Fruits',
  'vegetables': 'Vegetables',
  'feelings': 'Feelings',
  'people': 'People',
  'communication': 'Communication',
  'routines': 'Routines',
  'clothes': 'Clothes',
  'animals': 'Animals',
  'body': 'Body',
  'colors': 'Colors',
  'numbers': 'Numbers'
};

// Special case mapping for mismatched image/audio names
const nameMapping = {
  'тв': 'телевизија'
};

function generateCards() {
  const cards = [];
  let position = 0;
  
  // Read all image directories
  const imagesDir = path.join(DATA_DIR, 'images');
  const categories = fs.readdirSync(imagesDir).filter(f => fs.statSync(path.join(imagesDir, f)).isDirectory());
  
  for (const categoryFolder of categories) {
    const categoryPath = path.join(imagesDir, categoryFolder);
    const categoryName = categoryMapping[categoryFolder] || categoryFolder;
    
    // Get all image files in this category
    const imageFiles = fs.readdirSync(categoryPath).filter(f => {
      const ext = path.extname(f).toLowerCase();
      return ['.png', '.jpg', '.jpeg', '.svg', '.gif'].includes(ext);
    });
    
    for (const imageFile of imageFiles) {
      const imageName = path.basename(imageFile, path.extname(imageFile));
      
      // Skip empty names
      if (!imageName || imageName === '.') continue;
      
      // Check for matching audio file
      const audioName = nameMapping[imageName] || imageName;
      const audioPath = path.join(DATA_DIR, 'audio', categoryFolder, `${audioName}.m4a`);
      const hasAudio = fs.existsSync(audioPath);
      
      // Build GCS URLs
      const imageUrl = `${GCS_BASE_URL}/images/${categoryFolder}/${encodeURIComponent(imageFile)}`;
      const audioUrl = hasAudio 
        ? `${GCS_BASE_URL}/audio/${categoryFolder}/${encodeURIComponent(audioName)}.m4a`
        : "";
      
      const card = {
        Name: imageName,
        Image: imageUrl,
        AudioVoice: audioUrl,
        Category: categoryName,
        Position: position++
      };
      
      cards.push(card);
      console.log(`Added: ${imageName} (${categoryName}) - Audio: ${hasAudio ? 'Yes' : 'No'}`);
    }
  }
  
  // Write JSON file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(cards, null, 2));
  
  console.log(`\n✅ Successfully generated ${OUTPUT_FILE} with ${cards.length} cards`);
  
  // Print summary
  console.log('\n--- Summary ---');
  const categoriesCount = {};
  cards.forEach(c => {
    categoriesCount[c.Category] = (categoriesCount[c.Category] || 0) + 1;
  });
  
  for (const [cat, count] of Object.entries(categoriesCount).sort()) {
    console.log(`${cat}: ${count} cards`);
  }
  
  console.log(`\n--- Next Steps ---`);
  console.log(`1. Copy ${OUTPUT_FILE} to your server`);
  console.log(`2. SSH to server: ssh root@37.27.91.172`);
  console.log(`3. Import to MongoDB:`);
  console.log(`   mongoimport --uri="mongodb://vinozhito_db:PASSWORD@localhost:27017/vinozitoDB?authSource=admin" --collection=DefaultCards --file=cards-import.json --jsonArray --drop`);
}

// Run the generator
generateCards();