const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const mobileMenuCss = `/* ── MOBILE MENU ── */
#mobile-menu {
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
}

`;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if it already has the mobile menu block to prevent duplicates
  if (!content.includes('/* ── MOBILE MENU ── */')) {
    // Insert before SEARCH block
    content = content.replace(/\/\* ── SEARCH ── \*\//, mobileMenuCss + '/* ── SEARCH ── */');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Injected CSS into ${file}`);
  } else {
    console.log(`Skipped ${file} - already has CSS`);
  }
}
