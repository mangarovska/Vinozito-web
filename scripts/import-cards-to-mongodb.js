const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Configuration
// Use remote MongoDB server - set MONGO_PASSWORD env variable or replace here
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || 'DgTKHt0FHG2';
const MONGODB_URI = `mongodb://vinozhito_db:${MONGO_PASSWORD}@37.27.91.172:27017/vinozitoDB?authSource=admin`;
const GCS_BASE_URL = 'https://storage.googleapis.com/lunar-echo-storage/vinozito-data';
const DATA_DIR = '/home/nnikolovskii/vinozito-data';

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

async function importCards() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('vinozitoDB');
    const collection = db.collection('DefaultCards');
    
    // Clear existing default cards
    console.log('Clearing existing DefaultCards...');
    await collection.deleteMany({});
    
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
          : null;
        
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
    
    // Insert all cards
    if (cards.length > 0) {
      const result = await collection.insertMany(cards);
      console.log(`\n✅ Successfully inserted ${result.insertedCount} cards into DefaultCards collection`);
    } else {
      console.log('\n⚠️ No cards found to insert');
    }
    
    // Print summary
    console.log('\n--- Summary ---');
    const categoriesCount = {};
    cards.forEach(c => {
      categoriesCount[c.Category] = (categoriesCount[c.Category] || 0) + 1;
    });
    
    for (const [cat, count] of Object.entries(categoriesCount)) {
      console.log(`${cat}: ${count} cards`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the import
importCards();