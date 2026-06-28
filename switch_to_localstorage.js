const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend.js');
let content = fs.readFileSync(filePath, 'utf8');

// Replace sessionStorage with localStorage for permanent cross-session caching
if (content.includes('sessionStorage')) {
  content = content.replace(/sessionStorage/g, 'localStorage');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully switched to localStorage in frontend.js');
} else {
  console.log('sessionStorage not found');
}
