const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'index.html');

const newHtml = `<!-- ═══════ MOBILE FULL-SCREEN MENU ═══════ -->
<div id="mobile-menu">
  <button id="menu-close" style="position:absolute;top:1.5rem;right:1.5rem;background:rgba(255,255,255,0.1);border:1px solid rgba(184,135,11,0.2);color:var(--gold-bright);font-size:1.4rem;cursor:pointer;width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:all 0.3s;">✕</button>

  <a href="index.html" class="mobile-menu-link">Home</a>
  <a href="about.html" class="mobile-menu-link">About Us</a>
  <a href="events.html" class="mobile-menu-link">Events</a>
  <a href="jobs.html" class="mobile-menu-link">Jobs</a>
  <a href="vendors.html" class="mobile-menu-link">Vendors</a>
  <a href="hotels-restaurants.html" class="mobile-menu-link">Hotels & Dining</a>
  <a href="services.html" class="mobile-menu-link">Services</a>
  <a href="contact.html" class="btn-gold" style="margin-top:2rem;">Contact Us</a>
</div>`;

const newJs = `// Mobile menu
document.getElementById('menu-open').addEventListener('click', () => {
  document.getElementById('mobile-menu').classList.add('open');
  document.body.style.overflow = 'hidden';
});
document.getElementById('menu-close').addEventListener('click', () => {
  document.getElementById('mobile-menu').classList.remove('open');
  document.body.style.overflow = '';
});
// Auto-close menu when a link is clicked
document.querySelectorAll('.mobile-menu-link').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('mobile-menu').classList.remove('open');
    document.body.style.overflow = '';
  });
});`;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Remove inline CSS for mobile menu
  content = content.replace(/\/\*\s*──\s*MOBILE MENU\s*──\s*\*\/(.|\r|\n)*?(?=\/\*\s*──\s*SEARCH\s*──\s*\*\/)/g, '');

  // 2. Replace HTML block
  content = content.replace(/<!--\s*═══════\s*MOBILE FULL-SCREEN MENU\s*═══════\s*-->[\s\S]*?<\/div>\s*(?=<!--\s*═══════\s*HEADER\s*═══════\s*-->)/, newHtml + '\n\n');

  // 3. Replace JS block
  content = content.replace(/\/\/\s*Mobile menu[\s\S]*?(?=(<\/script>|\/\/ Performance))/g, newJs + '\n');

  // Fix active link
  content = content.replace(new RegExp(`class="mobile-menu-link"(?=>[\\s\\S]*?${file.replace('.html', '')})`, 'i'), 'class="mobile-menu-link active"');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
}
