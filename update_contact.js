const fs = require('fs');

let contactHtml = fs.readFileSync('contact.html', 'utf8');

// 1. Restore the Form action and _next field
const formPattern = /<form id="contact-form"[^>]*>/;
const newFormHeader = `<form id="contact-form" action="https://formsubmit.co/exploreibadan06@gmail.com" method="POST" style="display:flex;flex-direction:column;gap:1.5rem;">
        <input type="hidden" name="_next" value="https://jaylurd.github.io/explore-ibadan-2/thank-you.html">
        <input type="hidden" name="_captcha" value="false">`;
contactHtml = contactHtml.replace(formPattern, newFormHeader);

// Add 'name' attribute to inputs if missing
contactHtml = contactHtml.replace(/id="contact-subject"/, 'name="Subject" id="contact-subject"');
contactHtml = contactHtml.replace(/id="contact-name"/, 'name="Name" id="contact-name"');
contactHtml = contactHtml.replace(/id="contact-email"/, 'name="Email" id="contact-email"');
contactHtml = contactHtml.replace(/id="contact-message"/, 'name="Message" id="contact-message"');

// 2. Remove the AJAX script block
const ajaxPattern = /\/\/ AJAX FormSubmit Integration[\s\S]*?\}\s*<\/script>/;
contactHtml = contactHtml.replace(ajaxPattern, '</script>');

// 3. Remove the thank-you popup HTML
const popupPattern = /<!-- Thank You Popup -->[\s\S]*?<\/div>\s*<\/div>/;
contactHtml = contactHtml.replace(popupPattern, '');

fs.writeFileSync('contact.html', contactHtml);
console.log('Updated contact.html successfully.');
