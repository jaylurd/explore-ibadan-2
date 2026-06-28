const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'hotels-restaurants.html');
let content = fs.readFileSync(filePath, 'utf8');

const regex = /const matchesFilter = filterType === 'all' \|\| cardType === filterType;/g;
const replacement = `const cardTypeLower = (card.dataset.type || '').trim().toLowerCase();
    const filterTypeLower = filterType.trim().toLowerCase();
    const matchesFilter = filterType === 'all' || cardTypeLower === filterTypeLower;`;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed hr filter logic');
} else {
    console.log('regex did not match');
}
