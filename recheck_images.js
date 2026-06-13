const fs = require('fs');
const https = require('https');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'unsplash_search.html');
const urlMap = {}; // url -> [{ file, line, context }]

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const lines = html.split('\n');
  lines.forEach((line, i) => {
    const matches = line.match(/https:\/\/images\.unsplash\.com\/photo-[A-Za-z0-9\-]+/g);
    if (matches) {
      for (const url of matches) {
        const id = url.replace('https://images.unsplash.com/photo-', '');
        if (!urlMap[id]) urlMap[id] = [];
        urlMap[id].push({ file, line: i + 1, context: line.trim().substring(0, 120) });
      }
    }
  });
}

const ids = Object.keys(urlMap);
console.log(`Found ${ids.length} unique image IDs to check...\n`);

async function checkAll() {
  const broken = [];
  for (const id of ids) {
    const testUrl = `https://images.unsplash.com/photo-${id}?w=100&q=10&auto=format&fit=crop`;
    const status = await new Promise(resolve => {
      https.get(testUrl, (res) => {
        resolve(res.statusCode);
      }).on('error', () => resolve(0));
    });
    
    const ok = status === 200 || status === 302;
    const files = urlMap[id].map(e => `${e.file}:${e.line}`).join(', ');
    console.log(`[${ok ? 'OK' : 'BROKEN'}] (${status}) photo-${id} -> ${files}`);
    if (!ok) broken.push(id);
  }
  
  console.log(`\n--- ${broken.length} broken IDs ---`);
  broken.forEach(id => {
    console.log(`photo-${id}`);
    urlMap[id].forEach(e => console.log(`  in ${e.file}:${e.line} -> ${e.context}`));
  });
}

checkAll();
