const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend.js');
let content = fs.readFileSync(filePath, 'utf8');

// Target the vendor image specifically
const oldVendorImg = `img src="\${imgUrl}" style="width:100%;height:100%;object-fit:contain;" alt="\${vendor.category || 'Vendor'}"`;
const newVendorImg = `img src="\${imgUrl}" loading="lazy" decode="async" style="width:100%;height:100%;object-fit:contain;" alt="\${vendor.category || 'Vendor'}"`;

if (content.includes(oldVendorImg)) {
    content = content.replace(oldVendorImg, newVendorImg);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully added lazy loading to vendor images.');
} else {
    console.log('Could not find exact vendor image string.');
}
