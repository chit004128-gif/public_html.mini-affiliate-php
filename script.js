document.addEventListener('DOMContentLoaded', () => {
    // =================================================================
    // 1. STATE & GLOBAL VARIABLES
    // =================================================================
    let allProducts = [];
    let settings = {};
    let clicks = JSON.parse(localStorage.getItem('mini_affiliate_clicks_v2')) || {};
    let toastTimeout;

    // =================================================================
    // 2. DOM ELEMENT SELECTORS
    // =================================================================
    const productGrid = document.getElementById('product-grid');
    const noResultsDiv = document.getElementById('no-results');
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const sortBy = document.getElementById('sort-by');
    const totalClicksStat = document.getElementById('total-clicks-stat');
    const totalProductsStat = document.getElementById('total-products-stat');
    const toast = document.getElementById('toast');

    // Modals & Forms
    const addModal = document.getElementById('add-modal');
    const settingsModal = document.getElementById('settings-modal');
    const addForm = document.getElementById('add-product-form');
    const settingsForm = document.getElementById('settings-form');

    // =================================================================
    // 3. CORE FUNCTIONS
    // =================================================================

    /**
     * ดึงข้อมูลเริ่มต้นจากเซิร์ฟเวอร์ (สินค้าและการตั้งค่า)
     */
    async function initializeApp() {
        try {
            const response = await fetch('api/get_data.php');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            allProducts = data.products;
            settings = data.settings;

            updateUI();
        } catch (error) {
            console.error('Failed to initialize app:', error);
            showToast('เกิดข้อผิดพลาดในการโหลดข้อมูล');
        }
    }

    /**
     * อัปเดตส่วนแสดงผลทั้งหมด (สินค้า, สถิติ, ฟอร์มตั้งค่า)
     */
    function updateUI() {
        renderProducts();
        updateStats();
        updateSettingsForm();
    }

    /**
     * กรอง, จัดเรียง และแสดงผลสินค้าลงบนหน้าเว็บ (ส่วนนี้ถูกอัปเดตสำหรับดีไซน์ใหม่)
     */
    function renderProducts() {
        const filters = {
            search: searchInput.value.toLowerCase().trim(),
            category: categoryFilter.value,
            sort: sortBy.value
        };

        let filtered = [...allProducts];

        // 1. Filter by category
        if (filters.category !== 'ทั้งหมด') {
            filtered = filtered.filter(p => p.category === filters.category);
        }
        // 2. Filter by search query
        if (filters.search) {
            filtered = filtered.filter(p => p.name.toLowerCase().includes(filters.search));
        }
        // 3. Sort the results
        switch (filters.sort) {
            case 'price_asc':
                filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                break;
            case 'name_asc':
                filtered.sort((a, b) => a.name.localeCompare(b.name, 'th'));
                break;
            case 'popularity':
            default:
                filtered.sort((a, b) => parseInt(b.sold) - parseInt(a.sold));
                break;
        }

        productGrid.innerHTML = ''; // Clear previous products

        if (filtered.length === 0) {
            noResultsDiv.classList.remove('hidden');
        } else {
            noResultsDiv.classList.add('hidden');
            filtered.forEach(p => {
                const affiliateUrl = buildAffiliateLink(p.url);
                const card = document.createElement('div');
                card.className = 'product-card';

                // **** HTML TEMPLATE ใหม่สำหรับ Product Card ****
                card.innerHTML = `
                    <img src="${p.image || 'https://via.placeholder.com/400x300.png?text=No+Image'}" alt="${p.name}" class="product-card-image" loading="lazy">
                    <div class="product-card-content">
                        <div class="product-card-header">
                            <h3>${p.name}</h3>
                            <span class="rating-badge">⭐ ${Number(p.rating).toFixed(1)}</span>
                        </div>
                        <div class="price">฿${Number(p.price).toLocaleString()}</div>
                        <div class="sold-count">ขายแล้ว ${Number(p.sold).toLocaleString()}</div>
                        <div class="product-card-footer">
                            <div class="product-card-buttons">
                                <button class="primary-button buy-btn" data-url="${affiliateUrl}" data-id="${p.id}">🛒 ซื้อบน Shopee</button>
                                <button class="ghost-button copy-btn" data-url="${affiliateUrl}" data-id="${p.id}">📋 คัดลอกลิงก์</button>
                            </div>
                            <div class="card-link">🔗 ${affiliateUrl}</div>
                        </div>
                    </div>
                `;
                productGrid.appendChild(card);
            });
        }
    }

    /**
     * อัปเดตตัวเลขสถิติ (จำนวนคลิกและจำนวนสินค้า)
     */
    function updateStats() {
        const totalClicks = Object.values(clicks).reduce((sum, count) => sum + (count || 0), 0);
        totalClicksStat.textContent = totalClicks.toLocaleString();
        totalProductsStat.textContent = allProducts.length.toLocaleString();
    }

    /**
     * อัปเดตค่าในฟอร์มตั้งค่าให้ตรงกับข้อมูลปัจจุบัน
     */
    function updateSettingsForm() {
        for (const key in settings) {
            if (settingsForm.elements[key]) {
                settingsForm.elements[key].value = settings[key];
            }
        }
    }

    // =================================================================
    // 4. HELPER FUNCTIONS
    // =================================================================

    function buildAffiliateLink(baseUrl) {
        try {
            const url = new URL(baseUrl);
            if (settings.affiliateParamKey && settings.affiliateId) url.searchParams.set(settings.affiliateParamKey, settings.affiliateId);
            if (settings.subIdKey && settings.subIdValue) url.searchParams.set(settings.subIdKey, settings.subIdValue);
            if (settings.utmSource) url.searchParams.set("utm_source", settings.utmSource);
            if (settings.utmMedium) url.searchParams.set("utm_medium", settings.utmMedium);
            if (settings.utmCampaign) url.searchParams.set("utm_campaign", settings.utmCampaign);
            return url.toString();
        } catch { return baseUrl; }
    }

    function trackClick(productId) {
        clicks[productId] = (clicks[productId] || 0) + 1;
        localStorage.setItem('mini_affiliate_clicks_v2', JSON.stringify(clicks));
        updateStats();
    }

    function showToast(message) {
        toast.textContent = message;
        toast.classList.remove('hidden');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => toast.classList.add('hidden'), 2500);
    }

    // =================================================================
    // 5. API CALL HANDLERS
    // =================================================================

    async function handleAddProduct(event) {
        event.preventDefault();
        const formData = new FormData(addForm);
        try {
            const response = await fetch('api/add_product.php', { method: 'POST', body: formData });
            const result = await response.json();
            if (result.success) {
                addForm.reset();
                addModal.classList.add('hidden');
                showToast('เพิ่มสินค้าสำเร็จ!');
                initializeApp();
            } else { showToast('เกิดข้อผิดพลาด: ' + result.message); }
        } catch { showToast('เกิดข้อผิดพลาดในการเชื่อมต่อ'); }
    }

    async function handleUpdateSettings(event) {
        event.preventDefault();
        const formData = new FormData(settingsForm);
        try {
            const response = await fetch('api/update_settings.php', { method: 'POST', body: formData });
            const result = await response.json();
            if (result.success) {
                settingsModal.classList.add('hidden');
                showToast('บันทึกการตั้งค่าแล้ว!');
                initializeApp();
            } else { showToast('เกิดข้อผิดพลาด: ' + result.message); }
        } catch { showToast('เกิดข้อผิดพลาดในการเชื่อมต่อ'); }
    }
    
    // หมายเหตุ: ฟังก์ชันลบสินค้ายังคงอยู่ แต่ไม่มีปุ่มให้กดในดีไซน์นี้
    // หากต้องการใช้ สามารถเพิ่มปุ่มกลับเข้าไปใน card.innerHTML ได้
    async function handleDeleteProduct(productId) {
        const formData = new FormData();
        formData.append('id', productId);
        try {
            const response = await fetch('api/delete_product.php', { method: 'POST', body: formData });
            const result = await response.json();
            if (result.success) {
                showToast('ลบสินค้าสำเร็จ!');
                initializeApp();
            } else { showToast('เกิดข้อผิดพลาด: ' + result.message); }
        } catch { showToast('เกิดข้อผิดพลาดในการเชื่อมต่อ'); }
    }


    // =================================================================
    // 6. EVENT LISTENERS
    // =================================================================

    function setupEventListeners() {
        searchInput.addEventListener('input', renderProducts);
        categoryFilter.addEventListener('change', renderProducts);
        sortBy.addEventListener('change', renderProducts);

        document.getElementById('open-add-modal-btn').addEventListener('click', () => addModal.classList.remove('hidden'));
        document.getElementById('open-settings-modal-btn').addEventListener('click', () => settingsModal.classList.remove('hidden'));
        
        document.querySelectorAll('.close-modal-btn, .modal-overlay').forEach(el => {
            el.addEventListener('click', () => {
                addModal.classList.add('hidden');
                settingsModal.classList.add('hidden');
            });
        });

        addForm.addEventListener('submit', handleAddProduct);
        settingsForm.addEventListener('submit', handleUpdateSettings);
        
        productGrid.addEventListener('click', (event) => {
            const button = event.target.closest('button');
            if (!button) return;

            const productId = button.dataset.id;
            const affiliateUrl = button.dataset.url;

            if (button.classList.contains('copy-btn')) {
                navigator.clipboard.writeText(affiliateUrl);
                showToast('คัดลอกลิงก์แล้ว!');
                trackClick(productId);
            } else if (button.classList.contains('buy-btn')) {
                window.open(affiliateUrl, '_blank');
                trackClick(productId);
            }
            // หากต้องการใช้ฟังก์ชันลบ ให้เพิ่มปุ่มที่มีคลาส delete-btn กลับเข้ามา
            // else if (button.classList.contains('delete-btn')) {
            //     if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?')) {
            //         handleDeleteProduct(productId);
            //     }
            // }
        });
    }

    // =================================================================
    // 7. APP INITIALIZATION
    // =================================================================
    setupEventListeners();
    initializeApp();
});