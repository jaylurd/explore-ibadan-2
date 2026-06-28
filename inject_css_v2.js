const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const newMobileMenuCss = `#mobile-menu {
  position: fixed;
  inset: 0;
  background: var(--forest);
  z-index: 300;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.35s ease, visibility 0.35s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

#mobile-menu.open {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.mobile-menu-link {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.5rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  display: block;
  margin: 0.6rem 0;
  transition: color 0.3s ease, transform 0.3s ease;
  text-align: center;
}

.mobile-menu-link:hover,
.mobile-menu-link.active {
  color: var(--gold-bright);
  transform: scale(1.05);
}`;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Regex to match the old mobile menu CSS regardless of what follows it
  // We match from #mobile-menu { ... } all the way to the end of .mobile-menu-link.active { ... }
  const regex = /#mobile-menu\s*\{[\s\S]*?\.mobile-menu-link:hover,\s*\.mobile-menu-link\.active\s*\{[\s\S]*?\}/g;

  if (regex.test(content)) {
    content = content.replace(regex, newMobileMenuCss);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated CSS in ${file}`);
  } else {
    console.log(`Could not find old CSS in ${file}`);
  }
}
