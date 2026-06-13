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
        _supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return _supabaseClient;
}

function getFallbackImage(type) {
    if (type === 'event') return 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=100&auto=format&fit=crop';
    if (type === 'vendor') return 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=800&q=100&auto=format&fit=crop';
    if (type === 'service') return 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=100&auto=format&fit=crop';
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
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1d ago';
    if (diffDays < 7) return diffDays + 'd ago';
    if (diffDays < 14) return '1w ago';
    if (diffDays < 30) return Math.floor(diffDays / 7) + 'w ago';
    return Math.floor(diffDays / 30) + 'mo ago';
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
                logoHtml = `<img src="${job.logo_url}" alt="${job.company}" style="width:100%;height:100%;object-fit:cover;border-radius:2px;">`;
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
                        <a href="${job.link || '#'}" target="_blank" class="btn-primary" style="font-size:0.7rem;padding:0.55rem 1.2rem;">
                            ${job.link && job.link.includes('wa.me') ? '<span class="iconify" data-icon="logos:whatsapp-icon" style="font-size:0.9rem;"></span> Enquire' : 'Apply Now'}
                        </a>
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
                    <a href="${job.link || '#'}" target="_blank" class="btn-primary" style="width:100%;justify-content:center;">
                        ${job.link && job.link.includes('wa.me') ? '<span class="iconify" data-icon="logos:whatsapp-icon" style="font-size:1.1rem;margin-right:0.3rem;"></span> Enquire' : 'Apply Now'}
                    </a>
                `;
            }
            container.appendChild(card);
        });

        // Force all cards visible
        setTimeout(() => {
            container.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
            if (typeof window.applyFilters === 'function') {
                window.applyFilters();
            }
        }, 50);

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

            const card = document.createElement('div');
            
            if (containerId === 'events-page-container') {
                card.className = 'event-card reveal';
                card.innerHTML = `
                    <div style="position:relative;">
                        <img src="${imgUrl}" class="event-img" alt="${event.title}">
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
                        <a href="${event.rsvp_link || '#'}" class="btn-ghost" style="width:100%;justify-content:center;">View Details</a>
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
                        <a href="${event.rsvp_link || '#'}" target="_blank" class="btn-primary" style="width:100%;justify-content:center;">RSVP Now</a>
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
            card.innerHTML = `
                <div style="height:180px;background:#eee;position:relative;">
                    <img src="${imgUrl}" style="width:100%;height:100%;object-fit:cover;" alt="${vendor.category || 'Vendor'}">
                </div>
                <div style="padding:1.5rem;">
                    <div style="display:inline-block;font-size:0.65rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;padding:0.25rem 0.7rem;background:var(--gold-pale);color:var(--gold);border-radius:1px;margin-bottom:0.75rem;">${vendor.category || 'Vendor'}</div>
                    <h3 style="font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-weight:600;color:var(--charcoal);margin-bottom:0.5rem;">${vendor.name}</h3>
                    <p style="color:var(--muted);font-size:0.8rem;line-height:1.5;margin-bottom:1.25rem;">${vendor.description || 'Premium local and continental dishes.'}</p>
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <div style="color:var(--gold);font-size:0.8rem;">★★★★★ <span style="color:var(--muted)">(24)</span></div>
                        <a href="${vendor.link || '#'}" target="_blank" class="btn-ghost" style="padding:0.4rem 1rem;font-size:0.65rem;">Contact</a>
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
                    <img src="${imgUrl}" alt="${service.name}" style="width:100%;height:100%;object-fit:cover;border-radius:4px 4px 0 0;">
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
