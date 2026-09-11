const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replacements
  content = content.replace(/["']\.\.\/\.\.\/utils\/eventIcons["']/g, '"../../components/eventIcons"');
  content = content.replace(/["']\.\.\/\.\.\/data\/events["']/g, '"../../services/api/events"');
  content = content.replace(/["']\.\.\/\.\.\/api\/registrations["']/g, '"../../services/api/registrations"');
  content = content.replace(/["']\.\.\/\.\.\/components\/ui\/(.*?)["']/g, '"../../components/$1"');
  content = content.replace(/["']\.\.\/\.\.\/config\/payment["']/g, '"../../utils/payment"');
  
  if (file.includes('events.ts') || file.includes('registrations.ts')) {
    content = content.replace(/["']\.\.\/types["']/g, '"../../types"');
    content = content.replace(/["']\.\.\/config\/payment["']/g, '"../../utils/payment"');
  }

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated imports in ${file}`);
  }
});
