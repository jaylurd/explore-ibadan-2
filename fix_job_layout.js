const fs = require('fs');
const path = require('path');

// 1. Update frontend.js
const frontendPath = path.join(__dirname, 'frontend.js');
let frontend = fs.readFileSync(frontendPath, 'utf8');

const oldDiv = '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.75rem;">';
const newDiv = '<div class="job-card-actions">';

if (frontend.includes(oldDiv)) {
    frontend = frontend.replace(oldDiv, newDiv);
    fs.writeFileSync(frontendPath, frontend, 'utf8');
    console.log('Updated frontend.js with job-card-actions class');
}

// 2. Update style.css
const stylePath = path.join(__dirname, 'style.css');
let style = fs.readFileSync(stylePath, 'utf8');

const newCSS = `
/* ── JOB CARD ACTIONS ── */
.job-card-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;
}

@media (max-width: 768px) {
  .job-card-actions {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.5rem;
    border-top: 1px solid rgba(0,0,0,0.05);
    padding-top: 1rem;
  }
  .job-card-actions button {
    width: auto;
    flex: 1;
    margin-left: 1rem;
    justify-content: center;
  }
}
`;

if (!style.includes('.job-card-actions')) {
    style += newCSS;
    fs.writeFileSync(stylePath, style, 'utf8');
    console.log('Added job-card-actions to style.css');
}
