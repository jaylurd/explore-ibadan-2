const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const newHtml = `<div id="mobile-menu">
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

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Match from <div id="mobile-menu"> up to the next </div> that precedes the header
  // A robust way since the old menu had exactly one nested <div> (the explore ibadan header) and then <a> tags.
  // Actually, we can match from <div id="mobile-menu"> down to the contact us button and its closing </div>
  const regex = /<div id="mobile-menu">[\s\S]*?<a href="contact\.html"[\s\S]*?<\/a>\s*<\/div>/;

  if (regex.test(content)) {
    content = content.replace(regex, newHtml);
    
    // Fix active link
    const fileBasename = path.basename(file);
    content = content.replace(/class="mobile-menu-link active"/g, 'class="mobile-menu-link"');
    if (fileBasename === 'index.html') {
      content = content.replace('<a href="index.html" class="mobile-menu-link">', '<a href="index.html" class="mobile-menu-link active">');
    } else {
      content = content.replace(new RegExp(`<a href="${fileBasename}" class="mobile-menu-link">`), `<a href="${fileBasename}" class="mobile-menu-link active">`);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated HTML in ${file}`);
  } else {
    console.log(`Could not find old HTML in ${file}`);
  }
}
