import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('extracted_breeds').filter(f => f.endsWith('.jpeg') || f.endsWith('.jpg'));
console.log(`Total files: ${files.length}`);

// Group by breed name prefix
const groups = {};
files.forEach(f => {
  const parts = f.split('_');
  const breedKey = parts.slice(0, 2).join('_');
  if (!groups[breedKey]) groups[breedKey] = [];
  groups[breedKey].push(f);
});

console.log(JSON.stringify(groups, null, 2));
