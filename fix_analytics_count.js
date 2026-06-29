const fs = require('fs');
const path = require('path');

const adminPath = path.join(__dirname, 'admin.html');
let adminContent = fs.readFileSync(adminPath, 'utf8');

// Replace the analytics loading logic
const oldAnalyticsLogic = `                const { data, error } = await fetchWithCache('analytics', supabaseClient.from('analytics').select('*').order('created_at', { ascending: false }));
                loading.style.display = 'none';

                if (error) {
                    alert('Error loading analytics: ' + error.message);
                    return;
                }

                document.getElementById('total-views').textContent = data.length;
                const tbody = document.getElementById('analytics-table-body');
                tbody.innerHTML = '';
                data.slice(0, 50).forEach(item => { // Show last 50`;

const newAnalyticsLogic = `                // Get exact count, bypassing the 1000 row limit
                const countResponse = await supabaseClient.from('analytics').select('*', { count: 'exact', head: true });
                const exactCount = countResponse.count || 0;
                
                // Get latest 50 for the table
                const { data, error } = await fetchWithCache('analytics_latest', supabaseClient.from('analytics').select('*').order('created_at', { ascending: false }).limit(50));
                loading.style.display = 'none';

                if (error) {
                    alert('Error loading analytics: ' + error.message);
                    return;
                }

                // Add offset of 1008 as requested by user
                document.getElementById('total-views').textContent = exactCount + 1008;
                
                const tbody = document.getElementById('analytics-table-body');
                tbody.innerHTML = '';
                (data || []).forEach(item => { // Show last 50`;

if (adminContent.includes(oldAnalyticsLogic)) {
    adminContent = adminContent.replace(oldAnalyticsLogic, newAnalyticsLogic);
    fs.writeFileSync(adminPath, adminContent, 'utf8');
    console.log('Fixed analytics live count limit and added 1008 offset in admin.html');
} else {
    console.log('Could not find analytics logic in admin.html');
}
