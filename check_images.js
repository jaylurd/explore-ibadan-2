const fs = require('fs');
const https = require('https');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'unsplash_search.html');
const allUrls = new Set();

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const matches = html.match(/https:\/\/images\.unsplash\.com\/photo-[A-Za-z0-9\-]+\?[^"'\s]*/g);
  if (matches) {
    for (const url of matches) {
      allUrls.add(url);
    }
  }
}

async function checkUrls() {
  const broken = [];
  console.log(`Checking ${allUrls.size} unique URLs...`);
  
  for (const url of allUrls) {
    await new Promise(resolve => {
      https.get(url, (res) => {
        if (res.statusCode !== 200 && res.statusCode !== 302) {
          console.log(`[BROKEN] (${res.statusCode}) ${url}`);
          broken.push(url);
        } else {
          console.log(`[OK] (${res.statusCode}) ${url}`);
        }
        resolve();
      }).on('error', (e) => {
        console.log(`[ERROR] ${url}: ${e.message}`);
        broken.push(url);
        resolve();
      });
    });
  }
  
  console.log('\nBroken URLs summary:');
  broken.forEach(b => console.log(b));
}

checkUrls();
