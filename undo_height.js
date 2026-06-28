const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') || f === 'style.css');

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  const oldString = "background: var(--forest);\n  height: 100vh;\n  height: 100dvh;\n  width: 100vw;";
  const newString = "background: var(--forest);";
  
  if (content.includes(oldString)) {
    content = content.replace(new RegExp(oldString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newString);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Undid changes in ${file}`);
  }
}
