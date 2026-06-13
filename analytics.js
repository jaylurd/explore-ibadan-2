// Simple Analytics Tracker for Explore Ibadan
(function() {
    // Only run if supabase is available and we aren't viewing as a local file (to prevent spam during dev)
    // Actually, we want to test it locally, so let's run it anyway if supabase exists
    if (!window.supabase) return;

    const SUPABASE_URL = 'https://uaokmfmvzxolvvigjjol.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhb2ttZm12enhvbHZ2aWdqam9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMDQwNzEsImV4cCI6MjA5NjU4MDA3MX0.VxOyTUQCc_MzlerTPPFXxPdA4_lHWHqzGMu-yVvNwRo';

    // To prevent multiple initializations if script is loaded twice
    if (window._analyticsTracked) return;
    window._analyticsTracked = true;

    // Use a short delay so we don't block page rendering
    setTimeout(async () => {
        try {
            const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            
            // Get simple browser info
            let ua = navigator.userAgent;
            let browser = "Unknown";
            if (ua.includes("Chrome")) browser = "Chrome";
            else if (ua.includes("Firefox")) browser = "Firefox";
            else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
            else if (ua.includes("Edge")) browser = "Edge";
            
            let device = /Mobile|Android|iP(ad|hone)/.test(ua) ? "Mobile" : "Desktop";
            
            const payload = {
                page_url: window.location.pathname.split('/').pop() || 'index.html',
                user_agent: `${device} - ${browser}`
            };

            // Don't track admin panel views
            if (payload.page_url === 'admin.html') return;

            // Insert asynchronously
            await supabase.from('analytics').insert([payload]);
            console.log("Analytics logged.");
        } catch (e) {
            // Silently fail for analytics to not disturb user experience
            console.error("Analytics error:", e);
        }
    }, 1500);
})();
