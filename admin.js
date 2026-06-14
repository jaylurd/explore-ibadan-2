const SUPABASE_URL = 'https://uaokmfmvzxolvvigjjol.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhb2ttZm12enhvbHZ2aWdqam9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMDQwNzEsImV4cCI6MjA5NjU4MDA3MX0.VxOyTUQCc_MzlerTPPFXxPdA4_lHWHqzGMu-yVvNwRo';

if (!window.supabase) {
    alert("CRITICAL ERROR: The Supabase library failed to load. This usually happens if your browser is blocking it, or if you are opening the file directly from your computer instead of using a local server.");
}

const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const loginError = document.getElementById('login-error');

const tabs = document.querySelectorAll('.tab-btn');
const sectionTitle = document.getElementById('current-section-title');
const dataTable = document.getElementById('data-table');
const tableHead = document.getElementById('table-head');
const tableBody = document.getElementById('table-body');
const loading = document.getElementById('loading');

const modal = document.getElementById('modal');
const crudForm = document.getElementById('crud-form');
const formFields = document.getElementById('form-fields');
const closeModal = document.getElementById('close-modal');
const addNewBtn = document.getElementById('add-new-btn');
const modalTitle = document.getElementById('modal-title');
const itemIdInput = document.getElementById('item-id');
const imageUpload = document.getElementById('image-upload');
const existingImageUrl = document.getElementById('existing-image-url');
const saveBtn = document.getElementById('save-btn');

let currentTab = 'events';
let currentData = [];

// Configurations for different entities
const entityConfigs = {
    events: {
        title: 'Manage Events',
        imageField: 'image_url',
        columns: ['Image', 'Title', 'Date', 'Location', 'Actions'],
        fields: [
            { name: 'title', label: 'Event Title', type: 'text', required: true },
            { name: 'date', label: 'Date & Time', type: 'datetime-local', required: true },
            { name: 'location', label: 'Location', type: 'text', required: true },
            { name: 'description', label: 'Description', type: 'textarea', required: false },
            { name: 'rsvp_link', label: 'RSVP Link', type: 'url', required: false }
        ]
    },
    jobs: {
        title: 'Manage Jobs',
        imageField: 'logo_url',
        columns: ['Logo', 'Title', 'Company', 'Type', 'Location', 'Actions'],
        fields: [
            { name: 'title', label: 'Job Title', type: 'text', required: true },
            { name: 'company', label: 'Company Name', type: 'text', required: true },
            { name: 'type', label: 'Job Type (e.g. Full-time, Remote)', type: 'text', required: true },
            { name: 'location', label: 'Location', type: 'text', required: true },
            { name: 'salary', label: 'Salary/Stipend', type: 'text', required: false },
            { name: 'link', label: 'Application Link/Email', type: 'text', required: false },
            { name: 'description', label: 'Job Description', type: 'textarea', required: false },
            { name: 'requirements', label: 'Requirements', type: 'textarea', required: false }
        ]
    },
    vendors: {
        title: 'Manage Vendors',
        imageField: 'image_url',
        columns: ['Image', 'Name', 'Category', 'Location', 'Phone', 'Actions'],
        fields: [
            { name: 'name', label: 'Business Name', type: 'text', required: true },
            { name: 'category', label: 'Category', type: 'text', required: true },
            { name: 'location', label: 'Location', type: 'text', required: true },
            { name: 'phone', label: 'Phone Number', type: 'text', required: true },
            { name: 'description', label: 'Description', type: 'textarea', required: false }
        ]
    },
    services: {
        title: 'Manage Services',
        imageField: 'image_url',
        columns: ['Image', 'Name', 'Category', 'Phone', 'Actions'],
        fields: [
            { name: 'name', label: 'Service Name', type: 'text', required: true },
            { name: 'category', label: 'Category', type: 'text', required: true },
            { name: 'description', label: 'Description', type: 'textarea', required: false },
            { name: 'phone', label: 'Phone Number', type: 'text', required: true }
        ]
    }
};

// Auth State Check
async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        showDashboard();
    } else {
        showLogin();
    }
}

supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') showDashboard();
    if (event === 'SIGNED_OUT') showLogin();
});

function showLogin() {
    loginScreen.style.display = 'flex';
    dashboardScreen.style.display = 'none';
    logoutBtn.style.display = 'none';
}

function showDashboard() {
    loginScreen.style.display = 'none';
    dashboardScreen.style.display = 'block';
    logoutBtn.style.display = 'block';
    loadData();
}

// Login Handler
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.textContent = 'Logging in...';
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            console.error("Login error:", error);
            loginError.textContent = error.message;
        } else if (data.session) {
            console.log("Login successful!", data);
            loginError.textContent = 'Success! Loading dashboard...';
            showDashboard();
        } else {
            console.warn("Login returned no error and no session", data);
            loginError.textContent = 'Please check your email to confirm your account.';
        }
    } catch (err) {
        console.error("Exception during login:", err);
        loginError.textContent = 'Network or configuration error. Open console (F12) for details.';
    }
});

// Logout Handler
logoutBtn.addEventListener('click', async () => {
    await supabase.auth.signOut();
});

// Tabs Handler
tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        tabs.forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        currentTab = e.target.dataset.target;
        loadData();
    });
});

// Load Data
async function loadData() {
    loading.style.display = 'block';
    tableBody.innerHTML = '';
    tableHead.innerHTML = '';

    const config = entityConfigs[currentTab];
    sectionTitle.textContent = config.title;

    // Render Headers
    config.columns.forEach(col => {
        const th = document.createElement('th');
        th.textContent = col;
        tableHead.appendChild(th);
    });

    const { data, error } = await supabase.from(currentTab).select('*').order('created_at', { ascending: false });

    loading.style.display = 'none';

    if (error) {
        console.error(error);
        alert('Error loading data');
        return;
    }

    currentData = data;
    renderTable(data);
}

function renderTable(data) {
    const config = entityConfigs[currentTab];

    if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="${config.columns.length}" style="text-align:center; padding: 2rem;">No data found.</td></tr>`;
        return;
    }

    data.forEach(item => {
        const tr = document.createElement('tr');

        // Image Column
        const tdImg = document.createElement('td');
        const imgUrl = item[config.imageField] || 'https://via.placeholder.com/40';
        tdImg.innerHTML = `<img src="${imgUrl}" alt="image">`;
        tr.appendChild(tdImg);

        // Dynamic Columns based on tab
        if (currentTab === 'events') {
            tr.innerHTML += `
                <td>${item.title}</td>
                <td>${new Date(item.date).toLocaleString()}</td>
                <td>${item.location}</td>
            `;
        } else if (currentTab === 'jobs') {
            tr.innerHTML += `
                <td>${item.title}</td>
                <td>${item.company}</td>
                <td>${item.type}</td>
                <td>${item.location}</td>
            `;
        } else if (currentTab === 'vendors') {
            tr.innerHTML += `
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td>${item.location}</td>
                <td>${item.phone}</td>
            `;
        } else if (currentTab === 'services') {
            tr.innerHTML += `
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td>${item.phone}</td>
            `;
        }

        // Actions Column
        const tdActions = document.createElement('td');
        tdActions.className = 'action-btns';
        tdActions.innerHTML = `
            <button onclick="editItem('${item.id}')"><span class="iconify" data-icon="solar:pen-bold"></span></button>
            <button class="delete" onclick="deleteItem('${item.id}')"><span class="iconify" data-icon="solar:trash-bin-trash-bold"></span></button>
        `;
        tr.appendChild(tdActions);

        tableBody.appendChild(tr);
    });
}

// Modal Handlers
addNewBtn.addEventListener('click', () => {
    openModal();
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

function openModal(item = null) {
    const config = entityConfigs[currentTab];
    modalTitle.textContent = item ? `Edit ${currentTab.slice(0, -1)}` : `Add New ${currentTab.slice(0, -1)}`;
    formFields.innerHTML = '';
    crudForm.reset();
    itemIdInput.value = item ? item.id : '';
    existingImageUrl.value = item ? (item[config.imageField] || '') : '';

    config.fields.forEach(field => {
        const div = document.createElement('div');
        div.className = 'form-group';

        const label = document.createElement('label');
        label.textContent = field.label;
        div.appendChild(label);

        let input;
        if (field.type === 'textarea') {
            input = document.createElement('textarea');
            input.rows = 4;
        } else {
            input = document.createElement('input');
            input.type = field.type;
        }

        input.id = `field-${field.name}`;
        input.name = field.name;
        input.required = field.required;

        if (item) {
            if (field.type === 'datetime-local' && item[field.name]) {
                // Convert UTC to local datetime for input
                const date = new Date(item[field.name]);
                date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
                input.value = date.toISOString().slice(0, 16);
            } else {
                input.value = item[field.name] || '';
            }
        }

        div.appendChild(input);
        formFields.appendChild(div);
    });

    modal.style.display = 'flex';
}

window.editItem = function (id) {
    const item = currentData.find(d => d.id === id);
    if (item) openModal(item);
}

window.deleteItem = async function (id) {
    if (!confirm('Are you sure you want to delete this item?')) return;

    const { error } = await supabase.from(currentTab).delete().eq('id', id);
    if (error) {
        alert('Error deleting item: ' + error.message);
    } else {
        loadData();
    }
}

// Image Upload
async function uploadImage(file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${currentTab}/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

    if (uploadError) {
        throw uploadError;
    }

    const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

    return data.publicUrl;
}

// Form Submit (Create / Update)
crudForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    saveBtn.textContent = 'Saving...';
    saveBtn.disabled = true;

    try {
        const config = entityConfigs[currentTab];
        const id = itemIdInput.value;
        const formData = new FormData(crudForm);
        const payload = {};

        config.fields.forEach(f => {
            payload[f.name] = formData.get(f.name);
            // Handle empty dates or strings if needed
        });

        // Handle Image Upload
        const file = imageUpload.files[0];
        if (file) {
            const publicUrl = await uploadImage(file);
            payload[config.imageField] = publicUrl;
        } else if (existingImageUrl.value) {
            payload[config.imageField] = existingImageUrl.value;
        }

        if (id) {
            // Update
            const { error } = await supabase.from(currentTab).update(payload).eq('id', id);
            if (error) throw error;
        } else {
            // Insert
            const { error } = await supabase.from(currentTab).insert([payload]);
            if (error) throw error;
        }

        modal.style.display = 'none';
        loadData();
    } catch (error) {
        console.error(error);
        alert('Error saving data: ' + error.message);
    } finally {
        saveBtn.textContent = 'Save';
        saveBtn.disabled = false;
    }
});

// Initialize
checkAuth();
