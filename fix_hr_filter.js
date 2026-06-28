const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'hotels-restaurants.html');
let content = fs.readFileSync(filePath, 'utf8');

const oldLogic = `    const cardText = card.innerText.toLowerCase();
    const cardType = card.dataset.type || '';
    const matchesSearch = searchTerm === '' || cardText.includes(searchTerm);
    const matchesFilter = filterType === 'all' || cardType === filterType;`;

const newLogic = `    const cardText = card.innerText.toLowerCase();
    const cardType = (card.dataset.type || '').trim().toLowerCase();
    const filterTypeLower = filterType.trim().toLowerCase();
    const matchesSearch = searchTerm === '' || cardText.includes(searchTerm);
    const matchesFilter = filterType === 'all' || cardType === filterTypeLower;`;

if (content.includes(oldLogic)) {
    content = content.replace(oldLogic, newLogic);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed hotels and restaurants filter case-sensitivity.');
} else {
    console.log('Could not find exact logic string in hotels-restaurants.html');
}
