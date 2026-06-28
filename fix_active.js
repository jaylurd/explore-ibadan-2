const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove ALL active classes from mobile menu
  content = content.replace(/class="mobile-menu-link active"/g, 'class="mobile-menu-link"');

  // Add active class back to the correct file
  if (file === 'index.html') {
    content = content.replace('<a href="index.html" class="mobile-menu-link">', '<a href="index.html" class="mobile-menu-link active">');
  } else {
    content = content.replace(new RegExp(`<a href="${file}" class="mobile-menu-link">`), `<a href="${file}" class="mobile-menu-link active">`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed active class for ${file}`);
}
