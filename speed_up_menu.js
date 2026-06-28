const fs = require('fs');
const path = require('path');

const dir = __dirname;
// Include style.css as well as all .html files
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') || f === 'style.css');

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace the slow transition with a snappier one
  const oldTransition = 'transition: opacity 0.35s ease, visibility 0.35s;';
  const newTransition = 'transition: opacity 0.15s ease-out, visibility 0.15s;';
  
  if (content.includes(oldTransition)) {
    content = content.replace(new RegExp(oldTransition, 'g'), newTransition);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated transition speed in ${file}`);
  }
}
