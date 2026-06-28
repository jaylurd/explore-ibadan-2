const fs = require('fs');
const path = require('path');

const adminPath = path.join(__dirname, 'admin.html');
let adminContent = fs.readFileSync(adminPath, 'utf8');

const oldInvalidate = `        function invalidateAdminCache(tab) {
            sessionStorage.removeItem('admin_' + tab);
            sessionStorage.removeItem('admin_analytics');
            Object.keys(sessionStorage).forEach(k => {
                if (!k.startsWith('admin_')) sessionStorage.removeItem(k);
            });
        }`;

const newInvalidate = `        function invalidateAdminCache(tab) {
            sessionStorage.removeItem('admin_' + tab);
            sessionStorage.removeItem('admin_analytics');
            Object.keys(sessionStorage).forEach(k => {
                if (!k.startsWith('admin_')) sessionStorage.removeItem(k);
            });
            // Also clear localStorage so frontend sees changes immediately
            Object.keys(localStorage).forEach(k => {
                localStorage.removeItem(k);
            });
        }`;

if (adminContent.includes(oldInvalidate)) {
    adminContent = adminContent.replace(oldInvalidate, newInvalidate);
    fs.writeFileSync(adminPath, adminContent, 'utf8');
    console.log('Fixed admin.html to clear localStorage on edit.');
} else {
    console.log('Could not find invalidateAdminCache function.');
}
