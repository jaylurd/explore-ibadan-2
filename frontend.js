// Frontend Integration with Supabase
// Lazy-initialized to avoid race condition with CDN loading
const SUPABASE_URL = 'https://uaokmfmvzxolvvigjjol.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhb2ttZm12enhvbHZ2aWdqam9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMDQwNzEsImV4cCI6MjA5NjU4MDA3MX0.VxOyTUQCc_MzlerTPPFXxPdA4_lHWHqzGMu-yVvNwRo';

let _supabaseClient = null;

function getSupabase() {
    if (!_supabaseClient) {
        if (!window.supabase) {
            console.error('Supabase JS library not loaded yet!');
            return null;
        }
        _supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false
            }
        });
    }
    return _supabaseClient;
}

function getFallbackImage(type) {
    if (type === 'event') return 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=75&auto=format&fit=crop';
    if (type === 'vendor') return 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=600&q=75&auto=format&fit=crop';
    if (type === 'service') return 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=75&auto=format&fit=crop';
    return '';
}

function formatDate(dateString) {
    if (!dateString) return { day: '00', month: 'Unk' };
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    return { day, month };
}

function timeAgo(dateString) {
    if (!dateString) return '';
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    if (diffMs < 0) return 'Just now';
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return diffMins + 'm ago';
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return diffHours + 'h ago';
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return '1d ago';
    if (diffDays < 7) return diffDays + 'd ago';
    if (diffDays < 14) return '1w ago';
    if (diffDays < 30) return Math.floor(diffDays / 7) + 'w ago';
    if (diffDays < 365) return Math.floor(diffDays / 30) + 'mo ago';
    return Math.floor(diffDays / 365) + 'y ago';
}

async function fetchJobs(containerId, limit) {
    const sb = getSupabase();
    if (!sb) return;
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        let query = sb.from('jobs').select('*').order('created_at', { ascending: false });
        if (limit) query = query.limit(limit);

        const { data: jobs, error } = await query;
        if (error) throw error;

        container.innerHTML = '';
        if (!jobs || jobs.length === 0) {
            container.innerHTML = '<p style="color:var(--muted);grid-column:1/-1;text-align:center;padding:2rem;">No jobs available at the moment.</p>';
            return;
        }

        jobs.forEach((job, index) => {
            let logoHtml = '';
            if (job.logo_url && job.logo_url.startsWith('http')) {
                logoHtml = `<img src="${job.logo_url}" alt="${job.company}" loading="lazy" style="width:100%;height:100%;object-fit:cover;border-radius:2px;">`;
            } else {
                const initials = (job.company || 'J').substring(0, 2).toUpperCase();
                logoHtml = `<span style="font-family:'Cormorant Garamond',serif;font-weight:700;color:var(--forest);font-size:1.1rem;">${initials}</span>`;
            }

            const card = document.createElement('div');

            if (containerId === 'job-listings') {
                card.className = 'job-card reveal';
                // Set data attributes for filtering
                card.dataset.type = job.type || '';
                card.dataset.industry = job.industry || '';

                card.innerHTML = `
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;flex-wrap:wrap;">
                      <div style="display:flex;gap:1rem;align-items:flex-start;">
                        <div style="width:52px;height:52px;background:#E3F0FF;border:1px solid rgba(0,80,200,0.15);border-radius:2px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                            ${logoHtml}
                        </div>
                        <div>
                          <h3 style="font-family:'Cormorant Garamond',serif;font-size:1.25rem;font-weight:600;color:var(--charcoal);margin:0 0 0.25rem;">${job.title}</h3>
                          <p style="font-size:0.8rem;color:var(--muted);margin:0 0 0.75rem;">${job.company}</p>
                          <div style="display:flex;gap:1rem;flex-wrap:wrap;">
                            <span style="display:flex;align-items:center;gap:0.3rem;font-size:0.76rem;color:var(--mid);"><span class="iconify" data-icon="solar:map-point-linear" style="color:var(--gold);"></span> ${job.location}</span>
                            <span style="display:flex;align-items:center;gap:0.3rem;font-size:0.76rem;color:var(--mid);"><span class="iconify" data-icon="solar:clock-circle-linear" style="color:var(--gold);"></span> ${job.salary || 'Negotiable'}</span>
                            <span style="display:flex;align-items:center;gap:0.3rem;font-size:0.76rem;color:var(--mid);"><span class="iconify" data-icon="solar:calendar-linear" style="color:var(--gold);"></span> Posted ${timeAgo(job.created_at)}</span>
                          </div>
                        </div>
                      </div>
                      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.75rem;">
                        <span class="job-tag" style="border-color:rgba(11,46,11,0.2);color:var(--forest);background:#EBF4EB;">${job.type || 'Job'}</span>
                        <button onclick="openJobModal('${job.id}')" class="btn-primary" style="font-size:0.7rem;padding:0.55rem 1.2rem;border:none;cursor:pointer;">
                            View Job Description
                        </button>
                      </div>
                    </div>
                `;
            } else {
                card.className = 'card reveal';
                card.style.cssText = 'padding:1.75rem;';

                card.innerHTML = `
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.25rem;">
                        <div style="width:48px;height:48px;background:var(--gold-pale);border:1px solid rgba(184,135,11,0.2);border-radius:2px;display:flex;align-items:center;justify-content:center;overflow:hidden;">
                            ${logoHtml}
                        </div>
                        <span style="font-size:0.65rem;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;padding:0.3rem 0.75rem;border:1px solid rgba(11,46,11,0.2);color:var(--forest);background:#EBF4EB;border-radius:1px;">${job.type || 'Job'}</span>
                    </div>
                    <h3 style="font-family:'Cormorant Garamond',serif;font-size:1.2rem;font-weight:600;color:var(--charcoal);margin-bottom:0.4rem;">${job.title}</h3>
                    <p style="font-size:0.78rem;color:var(--muted);margin-bottom:1rem;">${job.company}</p>
                    <div style="display:flex;flex-wrap:wrap;gap:0.75rem;margin-bottom:1.25rem;">
                        <span style="display:flex;align-items:center;gap:0.3rem;font-size:0.75rem;color:var(--mid);"><span class="iconify" data-icon="solar:map-point-linear" style="color:var(--gold);"></span> ${job.location}</span>
                        <span style="display:flex;align-items:center;gap:0.3rem;font-size:0.75rem;color:var(--mid);"><span class="iconify" data-icon="solar:clock-circle-linear" style="color:var(--gold);"></span> ${job.salary || 'Negotiable'}</span>
                        <span style="display:flex;align-items:center;gap:0.3rem;font-size:0.75rem;color:var(--mid);"><span class="iconify" data-icon="solar:calendar-linear" style="color:var(--gold);"></span> Posted ${timeAgo(job.created_at)}</span>
                    </div>
                    <button onclick="openJobModal('${job.id}')" class="btn-primary" style="width:100%;justify-content:center;border:none;cursor:pointer;">
                        View Job Description
                    </button>
                `;
            }
            container.appendChild(card);
            
            // Store job data for modal
            window.jobsData = window.jobsData || {};
            window.jobsData[job.id] = job;
        });

        // Force all cards visible using requestAnimationFrame for better performance
        requestAnimationFrame(() => {
            container.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
            if (typeof window.applyFilters === 'function') {
                window.applyFilters();
            }
        });

    } catch (err) {
        console.error('Error fetching jobs:', err);
        container.innerHTML = '<p style="color:#c00;grid-column:1/-1;text-align:center;padding:2rem;">Error loading jobs. Please refresh the page.</p>';
    }
}

async function fetchEvents(containerId, limit) {
    const sb = getSupabase();
    if (!sb) return;
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        let query = sb.from('events').select('*').order('date', { ascending: true });
        if (limit) query = query.limit(limit);

        const { data: events, error } = await query;
        if (error) throw error;

        container.innerHTML = '';
        if (!events || events.length === 0) {
            container.innerHTML = '<p style="color:var(--muted);grid-column:1/-1;text-align:center;padding:2rem;">No upcoming events at the moment.</p>';
            return;
        }

        events.forEach((event, index) => {
            const imgUrl = event.image_url || getFallbackImage('event');
            const dateObj = formatDate(event.date);

            let waLink = event.rsvp_link || '#';
            if (waLink !== '#' && !waLink.includes('http')) {
                let phoneNum = waLink.replace(/[^\d+]/g, '');
                if (phoneNum) {
                    if (phoneNum.startsWith('0')) {
                        phoneNum = '234' + phoneNum.substring(1);
                    } else if (phoneNum.startsWith('+')) {
                        phoneNum = phoneNum.substring(1);
                    }
                    waLink = `https://wa.me/${phoneNum}`;
                } else {
                    waLink = '#';
                }
            }

            const card = document.createElement('div');

            if (containerId === 'events-page-container') {
                card.className = 'event-card reveal';
                card.innerHTML = `
                    <div style="position:relative;">
                        <img src="${imgUrl}" class="event-img" alt="${event.title}" loading="lazy">
                        <div class="date-badge">
                        <div class="day">${dateObj.day}</div>
                        <div class="month">${dateObj.month}</div>
                        </div>
                    </div>
                    <div style="padding:1.5rem;flex:1;display:flex;flex-direction:column;">
                        <div class="event-tag">${event.category || 'Event'}</div>
                        <h3 style="font-family:'Cormorant Garamond',serif;font-size:1.35rem;font-weight:600;color:var(--charcoal);margin-bottom:0.75rem;">${event.title}</h3>
                        <p style="font-size:0.85rem;color:var(--mid);line-height:1.6;margin-bottom:1.5rem;flex:1;">${event.description ? event.description.substring(0, 100) + '...' : ''}</p>
                        <div style="display:flex;flex-direction:column;gap:0.4rem;margin-bottom:1.5rem;">
                        <span style="display:flex;align-items:center;gap:0.4rem;font-size:0.75rem;color:var(--muted);"><span class="iconify" data-icon="solar:clock-circle-linear" style="color:var(--gold);"></span> ${event.time || 'TBD'}</span>
                        <span style="display:flex;align-items:center;gap:0.4rem;font-size:0.75rem;color:var(--muted);"><span class="iconify" data-icon="solar:map-point-linear" style="color:var(--gold);"></span> ${event.location}</span>
                        </div>
                        <a href="${waLink}" target="_blank" class="btn-ghost" style="width:100%;justify-content:center;color:#25D366;border-color:#25D366;">
                            <span class="iconify" data-icon="logos:whatsapp-icon" style="font-size:1.1rem;margin-right:0.4rem;"></span> Enquire
                        </a>
                    </div>
                `;
            } else {
                card.className = 'card reveal';
                card.innerHTML = `
                    <div class="card-img" style="position:relative;height:220px;">
                        <img src="${imgUrl}" alt="${event.title}" style="width:100%;height:100%;object-fit:cover;">
                        <div class="img-overlay"></div>
                        <div style="position:absolute;top:1rem;left:1rem;background:var(--forest);color:#fff;text-align:center;padding:0.5rem 0.75rem;border-radius:2px;min-width:50px;">
                            <div style="font-size:1.4rem;font-weight:700;line-height:1;">${dateObj.day}</div>
                            <div style="font-size:0.65rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;opacity:0.8;">${dateObj.month}</div>
                        </div>
                    </div>
                    <div style="padding:1.5rem;">
                        <h3 style="font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-weight:600;color:var(--charcoal);margin-bottom:0.75rem;">${event.title}</h3>
                        <div style="display:flex;flex-direction:column;gap:0.4rem;margin-bottom:1.25rem;">
                            <span style="display:flex;align-items:center;gap:0.5rem;font-size:0.8rem;color:var(--mid);"><span class="iconify" data-icon="solar:map-point-linear" style="color:var(--forest);"></span> ${event.location}</span>
                            ${event.description ? `<span style="display:flex;align-items:center;gap:0.5rem;font-size:0.8rem;color:var(--mid);"><span class="iconify" data-icon="solar:info-circle-linear" style="color:var(--forest);"></span> ${event.description.substring(0, 60)}...</span>` : ''}
                        </div>
                        <a href="${waLink}" target="_blank" class="btn-primary" style="width:100%;justify-content:center;background:#25D366;border-color:#25D366;color:#fff;">
                            <span class="iconify" data-icon="logos:whatsapp-icon" style="font-size:1.1rem;margin-right:0.4rem;"></span> WhatsApp
                        </a>
                    </div>
                `;
            }
            container.appendChild(card);
        });

        setTimeout(() => {
            container.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
        }, 50);

    } catch (err) {
        console.error('Error fetching events:', err);
        container.innerHTML = '<p style="color:#c00;grid-column:1/-1;text-align:center;padding:2rem;">Error loading events. Please refresh the page.</p>';
    }
}

async function fetchVendors(containerId) {
    const sb = getSupabase();
    if (!sb) return;
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const { data: vendors, error } = await sb.from('vendors').select('*').order('created_at', { ascending: false });
        if (error) throw error;

        container.innerHTML = '';
        if (!vendors || vendors.length === 0) {
            container.innerHTML = '<p style="color:var(--muted);grid-column:1/-1;text-align:center;padding:2rem;">No vendors listed yet.</p>';
            return;
        }

        vendors.forEach(vendor => {
            const imgUrl = vendor.image_url || getFallbackImage('vendor');

            const card = document.createElement('div');
            card.className = 'card reveal';

            // Build WhatsApp link from phone number
            let waLink = vendor.phone || '#';
            if (waLink !== '#') {
                const vendorName = vendor.name || 'your business';
                const messageBody = `Hello, I discovered you on the Explore Ibadan page and I want to make an inquiry about ${vendorName}.`;

                let phoneNum = waLink.replace(/[^\d+]/g, '');
                if (phoneNum) {
                    if (phoneNum.startsWith('0')) {
                        phoneNum = '234' + phoneNum.substring(1);
                    } else if (phoneNum.startsWith('+')) {
                        phoneNum = phoneNum.substring(1);
                    }
                    waLink = `https://wa.me/${phoneNum}?text=${encodeURIComponent(messageBody)}`;
                } else {
                    waLink = '#';
                }
            }

            card.innerHTML = `
                <div style="height:260px;background:#f9f9f9;position:relative;display:flex;align-items:center;justify-content:center;border-bottom:1px solid #eee;">
                    <img src="${imgUrl}" style="width:100%;height:100%;object-fit:contain;" alt="${vendor.category || 'Vendor'}">
                </div>
                <div style="padding:1.5rem;">
                    <div style="display:inline-block;font-size:0.65rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;padding:0.25rem 0.7rem;background:var(--gold-pale);color:var(--gold);border-radius:1px;margin-bottom:0.75rem;">${vendor.category || 'Vendor'}</div>
                    <h3 style="font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-weight:600;color:var(--charcoal);margin-bottom:0.4rem;">${vendor.name}</h3>
                    ${vendor.vendor_name ? `<div style="display:flex;align-items:center;gap:0.4rem;font-size:0.75rem;color:var(--charcoal);font-weight:500;margin-bottom:0.4rem;"><span class="iconify" data-icon="solar:user-circle-linear" style="color:var(--forest);"></span> ${vendor.vendor_name}</div>` : ''}
                    ${vendor.location ? `<div style="display:flex;align-items:center;gap:0.4rem;font-size:0.75rem;color:var(--muted);margin-bottom:0.8rem;"><span class="iconify" data-icon="solar:map-point-linear" style="color:var(--gold);"></span> ${vendor.location}</div>` : ''}
                    ${vendor.description ? `<p style="color:var(--muted);font-size:0.8rem;line-height:1.5;margin-bottom:1.25rem;">${vendor.description}</p>` : `<div style="margin-bottom:1.25rem;"></div>`}
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <div style="color:var(--gold);font-size:0.8rem;">★★★★★ <span style="color:var(--muted)">(24)</span></div>
                        <a href="${waLink}" target="_blank" class="btn-ghost" style="padding:0.4rem 1rem;font-size:0.65rem;">Contact</a>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

        setTimeout(() => {
            container.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
        }, 50);

        const countEl = document.getElementById('vendor-count');
        if (countEl) countEl.innerText = vendors.length;

    } catch (err) {
        console.error('Error fetching vendors:', err);
        container.innerHTML = '<p style="color:#c00;grid-column:1/-1;text-align:center;padding:2rem;">Error loading vendors. Please refresh the page.</p>';
    }
}

async function fetchServices(containerId) {
    const sb = getSupabase();
    if (!sb) return;
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const { data: services, error } = await sb.from('services').select('*').order('created_at', { ascending: false });
        if (error) throw error;

        container.innerHTML = '';
        if (!services || services.length === 0) {
            container.innerHTML = '<p style="color:var(--muted);grid-column:1/-1;text-align:center;padding:2rem;">No services listed yet.</p>';
            return;
        }

        services.forEach(service => {
            const imgUrl = service.image_url || getFallbackImage('service');

            const card = document.createElement('div');
            card.className = 'card reveal';
            card.style.cssText = 'display:flex;flex-direction:column;';
            card.innerHTML = `
                <div style="height:200px;position:relative;">
                    <img src="${imgUrl}" alt="${service.name}" loading="lazy" style="width:100%;height:100%;object-fit:cover;border-radius:4px 4px 0 0;">
                    <div style="position:absolute;top:1rem;right:1rem;background:rgba(0,0,0,0.6);color:#fff;font-size:0.7rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;padding:0.3rem 0.6rem;border-radius:2px;backdrop-filter:blur(4px);">
                        ${service.category}
                    </div>
                </div>
                <div style="padding:1.5rem;display:flex;flex-direction:column;flex-grow:1;">
                    <h3 style="font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-weight:600;color:var(--charcoal);margin-bottom:0.5rem;">${service.name}</h3>
                    <p style="font-size:0.8rem;color:var(--muted);line-height:1.6;margin-bottom:1.5rem;flex-grow:1;">
                        ${service.description || 'Professional service based in Ibadan.'}
                    </p>
                    <a href="tel:${service.phone}" class="btn-primary" style="width:100%;justify-content:center;">
                        <span class="iconify" data-icon="solar:phone-linear" style="font-size:1.1rem;margin-right:0.3rem;"></span> Book Service
                    </a>
                </div>
            `;
            container.appendChild(card);
        });

        setTimeout(() => {
            container.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
        }, 50);

        const countEl = document.getElementById('service-count');
        if (countEl) countEl.innerText = services.length;

    } catch (err) {
        console.error('Error fetching services:', err);
        container.innerHTML = '<p style="color:#c00;grid-column:1/-1;text-align:center;padding:2rem;">Error loading services. Please refresh the page.</p>';
    }
}

async function fetchGallery(containerId, limit) {
    const sb = getSupabase();
    if (!sb) return;
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        let query = sb.from('gallery').select('*').order('created_at', { ascending: false });
        if (limit) query = query.limit(limit);

        const { data: photos, error } = await query;
        if (error) throw error;

        container.innerHTML = '';
        container.style.display = 'block'; // Remove grid

        if (!photos || photos.length === 0) {
            container.innerHTML = '<p style="color:var(--muted);text-align:center;padding:2rem;">No gallery photos yet.</p>';
            return;
        }

        // Create the track wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'gallery-track-wrapper';
        wrapper.style.padding = '1rem 0';
        
        const track = document.createElement('div');
        track.className = 'gallery-track gallery-scroll-left';

        // Duplicate photos array for seamless infinite scroll
        const scrollPhotos = [...photos, ...photos, ...photos];

        scrollPhotos.forEach((photo, index) => {
            const imgUrl = photo.image_url;
            if (!imgUrl) return;

            const item = document.createElement('div');
            item.className = 'gallery-member';
            // Optional: slight variations in height for a more dynamic look
            const heightOffsets = ['280px', '320px', '260px', '300px'];
            item.style.height = heightOffsets[index % heightOffsets.length];
            item.style.width = '240px';

            item.innerHTML = `
                <img src="${imgUrl}" alt="${photo.title || 'Gallery photo'}" loading="lazy" loading="lazy">
                ${photo.title ? `
                <div class="gallery-overlay">
                    <p class="gallery-name">${photo.title}</p>
                </div>` : ''}
            `;

            track.appendChild(item);
        });

        wrapper.appendChild(track);
        container.appendChild(wrapper);

    } catch (err) {
        console.error('Error fetching gallery:', err);
        container.innerHTML = '<p style="color:#c00;text-align:center;padding:2rem;grid-column:1/-1;">Error loading gallery. Please refresh the page.</p>';
    }
}

// Job Modal Logic
window.openJobModal = function(jobId) {
    const job = window.jobsData && window.jobsData[jobId];
    if (!job) return;

    let modal = document.getElementById('job-detail-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'job-detail-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;opacity:0;pointer-events:none;transition:opacity 0.3s;padding:1rem;';
        
        modal.innerHTML = `
            <div style="background:#fff;border-radius:8px;width:100%;max-width:600px;max-height:90vh;display:flex;flex-direction:column;box-shadow:0 10px 30px rgba(0,0,0,0.2);transform:translateY(20px);transition:transform 0.3s;">
                <div style="display:flex;justify-content:space-between;align-items:center;padding:1.5rem;border-bottom:1px solid #eee;">
                    <h3 id="job-modal-title" style="font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:600;margin:0;">Job Title</h3>
                    <button onclick="closeJobModal()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:var(--muted);">&times;</button>
                </div>
                <div style="padding:1.5rem;overflow-y:auto;flex:1;">
                    <div style="display:flex;flex-wrap:wrap;gap:1rem;margin-bottom:1.5rem;background:#f9f9f9;padding:1rem;border-radius:4px;">
                        <div style="flex:1;min-width:120px;">
                            <div style="font-size:0.75rem;color:var(--muted);margin-bottom:0.2rem;">Company</div>
                            <div id="job-modal-company" style="font-weight:600;"></div>
                        </div>
                        <div style="flex:1;min-width:120px;">
                            <div style="font-size:0.75rem;color:var(--muted);margin-bottom:0.2rem;">Location</div>
                            <div id="job-modal-location" style="font-weight:600;"></div>
                        </div>
                        <div style="flex:1;min-width:120px;">
                            <div style="font-size:0.75rem;color:var(--muted);margin-bottom:0.2rem;">Type</div>
                            <div id="job-modal-type" style="font-weight:600;"></div>
                        </div>
                        <div style="flex:1;min-width:120px;">
                            <div style="font-size:0.75rem;color:var(--muted);margin-bottom:0.2rem;">Salary</div>
                            <div id="job-modal-salary" style="font-weight:600;"></div>
                        </div>
                    </div>
                    
                    <h4 style="font-size:1rem;font-weight:600;margin-bottom:0.75rem;color:var(--charcoal);">Job Description</h4>
                    <div id="job-modal-description" style="font-size:0.9rem;color:var(--mid);line-height:1.6;margin-bottom:1.5rem;white-space:pre-wrap;"></div>
                    
                    <h4 style="font-size:1rem;font-weight:600;margin-bottom:0.75rem;color:var(--charcoal);">Requirements</h4>
                    <div id="job-modal-requirements" style="font-size:0.9rem;color:var(--mid);line-height:1.6;margin-bottom:1.5rem;white-space:pre-wrap;"></div>
                </div>
                <div style="padding:1.5rem;border-top:1px solid #eee;display:flex;justify-content:flex-end;gap:1rem;">
                    <button onclick="closeJobModal()" class="btn-ghost" style="padding:0.7rem 1.5rem;">Cancel</button>
                    <a id="job-modal-apply" href="#" target="_blank" class="btn-primary" style="padding:0.7rem 1.5rem;">Apply Now</a>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    document.getElementById('job-modal-title').textContent = job.title || 'Job Description';
    document.getElementById('job-modal-company').textContent = job.company || '-';
    document.getElementById('job-modal-location').textContent = job.location || '-';
    document.getElementById('job-modal-type').textContent = job.type || '-';
    document.getElementById('job-modal-salary').textContent = job.salary || 'Negotiable';
    document.getElementById('job-modal-description').textContent = job.description || 'No description provided.';
    document.getElementById('job-modal-requirements').textContent = job.requirements || 'No specific requirements listed.';
    
    const applyBtn = document.getElementById('job-modal-apply');
    
    let applyLink = job.link || '#';
    let isEmail = false;
    let isWhatsApp = false;

    if (applyLink !== '#') {
        const jobTitle = job.title || 'Job';
        const company = job.company || 'your company';
        const messageBody = `Hello, I discovered the ${jobTitle} job posting on the Explore Ibadan website. I would love to submit an application for this position at ${company}. Please find my details below:`;

        const cleanPhone = applyLink.replace(/[\s\-\(\)\+]/g, '');
        if (/^\d{10,15}$/.test(cleanPhone) && !applyLink.includes('@') && !applyLink.includes('http')) {
            let waNumber = cleanPhone;
            if (waNumber.startsWith('0')) {
                waNumber = '234' + waNumber.substring(1);
            }
            applyLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(messageBody)}`;
            isWhatsApp = true;
        } else if (applyLink.includes('@') && !applyLink.includes('http')) {
            isEmail = true;
            let emailAddress = applyLink.replace('mailto:', '').trim();
            applyLink = `mailto:${emailAddress}?subject=${encodeURIComponent('Application for ' + jobTitle + ' - Explore Ibadan')}&body=${encodeURIComponent(messageBody)}`;
        }
    }

    applyBtn.href = applyLink;

    if (isWhatsApp || (job.link && job.link.includes('wa.me'))) {
        applyBtn.innerHTML = '<span class="iconify" data-icon="logos:whatsapp-icon" style="font-size:1.1rem;margin-right:0.3rem;"></span> Enquire on WhatsApp';
        applyBtn.style.background = '#25D366';
        applyBtn.style.borderColor = '#25D366';
        applyBtn.style.color = '#fff';
    } else if (isEmail) {
        applyBtn.innerHTML = '<span class="iconify" data-icon="logos:google-gmail" style="font-size:1.1rem;margin-right:0.3rem;"></span> Apply via Gmail';
        applyBtn.style.background = '#EA4335';
        applyBtn.style.borderColor = '#EA4335';
        applyBtn.style.color = '#fff';
    } else {
        applyBtn.innerHTML = 'Apply Now';
        applyBtn.style.background = 'var(--terra)';
        applyBtn.style.borderColor = 'var(--terra)';
        applyBtn.style.color = '#fff';
    }
    
    modal.style.pointerEvents = 'auto';
    modal.style.opacity = '1';
    modal.querySelector('div').style.transform = 'translateY(0)';
};

window.closeJobModal = function() {
    const modal = document.getElementById('job-detail-modal');
    if (modal) {
        modal.style.opacity = '0';
        modal.style.pointerEvents = 'none';
        modal.querySelector('div').style.transform = 'translateY(20px)';
    }
};
