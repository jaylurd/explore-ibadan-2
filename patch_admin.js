const fs = require('fs');
const path = require('path');

const adminPath = path.join(__dirname, 'admin.html');
let adminContent = fs.readFileSync(adminPath, 'utf8');

const cacheUtil = `
        const ADMIN_CACHE_TTL = 15 * 60 * 1000;
        async function fetchWithCache(cacheKey, queryPromise) {
            const cached = sessionStorage.getItem('admin_' + cacheKey);
            let cachedData = null;
            if (cached) {
                try {
                    const parsed = JSON.parse(cached);
                    if (Date.now() - parsed.timestamp < ADMIN_CACHE_TTL) {
                        cachedData = parsed.data;
                    }
                } catch (e) { console.warn('Cache parse error', e); }
            }
            if (cachedData) {
                queryPromise.then(({ data, error }) => {
                    if (!error && data) sessionStorage.setItem('admin_' + cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
                }).catch(() => {});
                return { data: cachedData, error: null };
            }
            const { data, error } = await queryPromise;
            if (!error && data) {
                sessionStorage.setItem('admin_' + cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
            }
            return { data, error };
        }
        function invalidateAdminCache(tab) {
            sessionStorage.removeItem('admin_' + tab);
            sessionStorage.removeItem('admin_analytics');
            Object.keys(sessionStorage).forEach(k => {
                if (!k.startsWith('admin_')) sessionStorage.removeItem(k);
            });
        }
`;

if (!adminContent.includes('function fetchWithCache(')) {
    adminContent = adminContent.replace(
        /let supabaseClient = null;/,
        match => match + '\n\n' + cacheUtil
    );
}

// Analytics fetch patch
adminContent = adminContent.replace(
    /const \{ data, error \} = await supabaseClient\.from\('analytics'\)\.select\('\*'\)\.order\('created_at', \{ ascending: false \}\);/g,
    "const { data, error } = await fetchWithCache('analytics', supabaseClient.from('analytics').select('*').order('created_at', { ascending: false }));"
);

// Tab fetch patch
adminContent = adminContent.replace(
    /const \{ data, error \} = await supabaseClient\.from\(currentTab\)\.select\('\*'\)\.order\('created_at', \{ ascending: false \}\);/g,
    "const { data, error } = await fetchWithCache(currentTab, supabaseClient.from(currentTab).select('*').order('created_at', { ascending: false }));"
);

// Invalidate on Save (we look for modal.style.display = 'none'; loadData();)
adminContent = adminContent.replace(
    /modal\.style\.display = 'none';\s*loadData\(\);/g,
    "modal.style.display = 'none'; invalidateAdminCache(currentTab); loadData();"
);

// Invalidate on Delete (we look for console.log('Delete success', currentTab, id, data); loadData();)
adminContent = adminContent.replace(
    /console\.log\('Delete success', currentTab, id, data\);\s*loadData\(\);/g,
    "console.log('Delete success', currentTab, id, data); invalidateAdminCache(currentTab); loadData();"
);

fs.writeFileSync(adminPath, adminContent, 'utf8');
console.log('admin.html successfully patched with caching layer.');
