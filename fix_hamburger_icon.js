const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const svgHamburger = `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace the dynamic iconify span with inline SVG
  const regex = /<span\s+class="iconify"\s+data-icon="solar:hamburger-menu-linear"\s+style="[^"]*">\s*<\/span>/g;
  
  // Also check if there's one without style just in case
  const regex2 = /<span\s+class="iconify"\s+data-icon="solar:hamburger-menu-linear">\s*<\/span>/g;

  if (regex.test(content) || regex2.test(content)) {
    content = content.replace(regex, svgHamburger);
    content = content.replace(regex2, svgHamburger);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Replaced hamburger icon in ${file}`);
  } else {
    console.log(`Hamburger icon not found in ${file}`);
  }
}
