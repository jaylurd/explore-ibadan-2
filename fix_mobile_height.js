const fs = require('fs');
const path = require('path');

const dir = __dirname;
// Target style.css and all html files
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') || f === 'style.css');

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // We are looking for `#mobile-menu { ... inset: 0; background: var(--forest);`
  // And we want to ensure it has `height: 100dvh; width: 100vw;`
  
  if (content.includes('#mobile-menu {')) {
    // If it already has 100dvh, skip
    if (!content.includes('height: 100dvh;')) {
        content = content.replace(
            /background:\s*var\(--forest\);/g,
            "background: var(--forest);\n  height: 100vh;\n  height: 100dvh;\n  width: 100vw;"
        );
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed mobile menu height in ${file}`);
    }
  }
}
