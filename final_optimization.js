const fs = require('fs');
const path = require('path');

const dir = __dirname;
const frontendPath = path.join(dir, 'frontend.js');
let frontendContent = fs.readFileSync(frontendPath, 'utf8');

// Replace any <img ...> with <img ... loading="lazy" decoding="async"> if not already there
frontendContent = frontendContent.replace(/<img([^>]*)>/g, (match, p1) => {
    let newImg = p1;
    if (!newImg.includes('loading=')) {
        newImg += ' loading="lazy"';
    }
    if (!newImg.includes('decoding=')) {
        newImg += ' decoding="async"';
    }
    return `<img${newImg}>`;
});

fs.writeFileSync(frontendPath, frontendContent, 'utf8');
console.log('Optimized frontend.js images');

// Preconnect to Supabase in all HTML files
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
const preconnectTags = `
    <link rel="preconnect" href="https://uaokmfmvzxolvvigjjol.supabase.co" crossorigin>
    <link rel="dns-prefetch" href="https://uaokmfmvzxolvvigjjol.supabase.co">
`;

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    if (!content.includes('rel="preconnect" href="https://uaokmfmvzxolvvigjjol.supabase.co"')) {
        content = content.replace('</head>', `${preconnectTags}\n</head>`);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Added preconnect to ${file}`);
    }
}
