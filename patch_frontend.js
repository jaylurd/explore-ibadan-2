const fs = require('fs');
const path = require('path');

const frontendPath = path.join(__dirname, 'frontend.js');
let frontend = fs.readFileSync(frontendPath, 'utf8');

// 1. Inject caching utility at the top (after getSupabase function)
const cacheUtil = `
// --- CACHING LAYER ---
const CACHE_TTL = 15 * 60 * 1000; // 15 mins

async function fetchWithCache(cacheKey, queryPromise) {
    const cached = sessionStorage.getItem(cacheKey);
    let cachedData = null;
    
    if (cached) {
        try {
            const parsed = JSON.parse(cached);
            if (Date.now() - parsed.timestamp < CACHE_TTL) {
                cachedData = parsed.data;
            }
        } catch (e) {
            console.warn('Cache parse error', e);
        }
    }

    if (cachedData) {
        // Fetch in background to keep data fresh (stale-while-revalidate)
        queryPromise.then(({ data, error }) => {
            if (!error && data) {
                sessionStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
            }
        }).catch(() => {});
        return { data: cachedData, error: null };
    }

    // Await query if no cache
    const { data, error } = await queryPromise;
    if (!error && data) {
        sessionStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
    }
    return { data, error };
}
`;

if (!frontend.includes('function fetchWithCache(')) {
    frontend = frontend.replace(
        /function getSupabase\(\) \{[\s\S]*?return _supabaseClient;\s*\}/,
        match => match + '\n\n' + cacheUtil
    );
}

// 2. Patch fetch functions
frontend = frontend.replace(
    /const \{ data: jobs, error \} = await query;/g,
    "const { data: jobs, error } = await fetchWithCache('jobs_' + (limit || 'all'), query);"
);

frontend = frontend.replace(
    /const \{ data: events, error \} = await query;/g,
    "const { data: events, error } = await fetchWithCache('events_' + (limit || 'all'), query);"
);

frontend = frontend.replace(
    /const \{ data: vendors, error \} = await sb\.from\('vendors'\)\.select\('\*'\)\.order\('created_at', \{ ascending: false \}\);/g,
    "const { data: vendors, error } = await fetchWithCache('vendors_all', sb.from('vendors').select('*').order('created_at', { ascending: false }));"
);

frontend = frontend.replace(
    /const \{ data: services, error \} = await sb\.from\('services'\)\.select\('\*'\)\.order\('created_at', \{ ascending: false \}\);/g,
    "const { data: services, error } = await fetchWithCache('services_all', sb.from('services').select('*').order('created_at', { ascending: false }));"
);

frontend = frontend.replace(
    /const \{ data: photos, error \} = await query;/g,
    "const { data: photos, error } = await fetchWithCache('gallery_' + (limit || 'all'), query);"
);

frontend = frontend.replace(
    /const \{ data, error \} = await query;/g,
    "const { data, error } = await fetchWithCache('hr_' + (limit || 'all'), query);"
);

// 3. Remove 50ms timeouts to make animation instantly trigger when data loads
frontend = frontend.replace(/setTimeout\(\(\) => \{([\s\S]*?)\}, 50\);/g, "requestAnimationFrame(() => {$1});");

fs.writeFileSync(frontendPath, frontend, 'utf8');
console.log('frontend.js successfully patched with caching layer.');
