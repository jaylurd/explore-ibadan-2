const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');

// Extract everything up to the end of header
const headerEnd = indexHtml.indexOf('<!-- ═══════ MAIN ═══════ -->');
const headAndHeader = indexHtml.substring(0, headerEnd);

// Extract footer to end of file
const footerStart = indexHtml.indexOf('<!-- ═══════ FOOTER ═══════ -->');
let footerAndEnd = indexHtml.substring(footerStart);

// Create the main content
const mainContent = `<!-- ═══════ MAIN ═══════ -->
<main style="max-width:1280px;margin:0 auto;padding:6rem 1.5rem 8rem;display:flex;align-items:center;justify-content:center;min-height:60vh;">
  <div style="background:#fff;border:1px solid rgba(184,135,11,0.15);padding:4rem 3rem;border-radius:8px;text-align:center;max-width:500px;width:100%;box-shadow:0 10px 40px rgba(0,0,0,0.05);">
    <span class="iconify" data-icon="solar:check-circle-bold" style="font-size:5rem;color:var(--forest);margin-bottom:1.5rem;"></span>
    <h1 style="font-family:'Cormorant Garamond',serif;font-size:2.5rem;font-weight:700;color:var(--charcoal);margin-bottom:1rem;">Thank You!</h1>
    <p style="color:var(--mid);font-size:1.1rem;line-height:1.6;margin-bottom:2.5rem;">Your feedback has been received. We will get back to you as soon as possible.</p>
    <a href="index.html" class="btn-primary" style="display:inline-block;padding:1rem 2.5rem;text-decoration:none;font-size:0.9rem;">Back to Home</a>
  </div>
</main>

`;

const finalHtml = headAndHeader + mainContent + footerAndEnd;

fs.writeFileSync('thank-you.html', finalHtml);
console.log('Created thank-you.html successfully.');
