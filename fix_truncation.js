const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend.js');
let content = fs.readFileSync(filePath, 'utf8');

// The string in events-page-container
const oldDesc1 = "${event.description ? event.description.substring(0, 100) + '...' : ''}";
const newDesc1 = "${event.description ? event.description : ''}";

// The string in the home page card
const oldDesc2 = "${event.description ? `<span style=\\"display:flex;align-items:center;gap:0.5rem;font-size:0.8rem;color:var(--mid);\\"><span class=\\"iconify\\" data-icon=\\"solar:info-circle-linear\\" style=\\"color:var(--forest);\\"></span> \${event.description.substring(0, 60)}...</span>` : ''}";
const newDesc2 = "${event.description ? `<span style=\\"display:flex;align-items:flex-start;gap:0.5rem;font-size:0.8rem;color:var(--mid);\\"><span class=\\"iconify\\" data-icon=\\"solar:info-circle-linear\\" style=\\"color:var(--forest);flex-shrink:0;margin-top:0.2rem;\\"></span> <span>\${event.description}</span></span>` : ''}";

if (content.includes(oldDesc1)) {
    content = content.replace(oldDesc1, newDesc1);
    console.log('Fixed truncation in events page.');
}

if (content.includes(oldDesc2)) {
    content = content.replace(oldDesc2, newDesc2);
    console.log('Fixed truncation in home page.');
}

fs.writeFileSync(filePath, content, 'utf8');
