document.addEventListener('DOMContentLoaded', () => {
    const config = Store.getConfig();
    
    // 1. Auth & Initial Navigation
    if (!config.admin.isSetup) {
        window.location.href = 'setup.html';
        return;
    }

    const loginScreen = document.getElementById('admin-login-screen');
    const dashboard = document.getElementById('admin-dashboard');
    const loginForm = document.getElementById('admin-login-form');

    if (sessionStorage.getItem('admin_session') === 'true') {
        loginScreen.style.display = 'none';
        dashboard.style.display = 'grid';
        loadAdminData();
        switchTab('dashboard');
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('login-username').value;
        const pass = document.getElementById('login-password').value;
        if (Store.checkLogin(user, pass)) {
            sessionStorage.setItem('admin_session', 'true');
            loginScreen.style.display = 'none';
            dashboard.style.display = 'grid';
            loadAdminData();
            switchTab('dashboard');
        } else {
            alert('Invalid credentials!');
        }
    });

    // 2. Data Loading & Dashboard Stats
    function loadAdminData() {
        const config = Store.getConfig();
        const orders = Store.getOrders();
        const products = Store.getProducts();

        // Stats
        const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total.replace('$', '')), 0);
        document.getElementById('stat-revenue').innerText = `$${totalRevenue.toFixed(2)}`;
        document.getElementById('stat-orders').innerText = orders.length;
        document.getElementById('stat-products').innerText = products.length;

        // Settings Load
        document.getElementById('set-site-name').value = config.siteName;
        document.getElementById('set-announcement').value = config.announcement;
        document.getElementById('set-shipping-banner').value = config.shippingBanner || '';
        document.getElementById('set-hero-headline').value = config.hero.headline;
        document.getElementById('set-hero-subtext').value = config.hero.subtext;
        document.getElementById('set-hero-cta').value = config.hero.ctaLabel;
        document.getElementById('set-hero-bg-type').value = config.hero.backgroundType;
        document.getElementById('set-hero-bg-value').value = config.hero.backgroundValue;

        renderOrders();
        renderProductList();
        renderFooterEditor();
        renderCategoryList();
    }

    // 3. Orders Management
    function renderOrders() {
        const orders = Store.getOrders();
        const recentList = document.getElementById('recent-orders-list');
        const fullList = document.getElementById('full-orders-list');

        const recentHtml = orders.slice(0, 5).map(o => `
            <tr><td>${o.id}</td><td>${o.customer.name}</td><td>${o.total}</td><td><span class="badge" style="background:#fff3cd; color:#856404; padding:4px 8px; border-radius:5px; font-size:11px;">${o.status}</span></td></tr>
        `).join('');
        recentList.innerHTML = recentHtml || '<tr><td colspan="4" style="text-align:center;">No recent orders</td></tr>';

        const fullHtml = orders.map(o => `
            <tr>
                <td><strong>${o.id}</strong></td>
                <td>${o.date}</td>
                <td>${o.customer.name}<br><small>${o.customer.phone}</small></td>
                <td style="font-size:12px;">${o.details.replace(/\n/g, '<br>')}</td>
                <td><strong>${o.total}</strong></td>
                <td><select onchange="updateOrderStatus('${o.id}', this.value)" style="padding:5px; border-radius:5px; border:1px solid #ddd;">
                    <option value="Pending" ${o.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Processing" ${o.status === 'Processing' ? 'selected' : ''}>Processing</option>
                    <option value="Shipped" ${o.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                    <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                </select></td>
            </tr>
        `).join('');
        fullList.innerHTML = fullHtml || '<tr><td colspan="6" style="text-align:center;">No orders found</td></tr>';
    }

    window.updateOrderStatus = (id, status) => {
        const orders = Store.getOrders();
        const order = orders.find(o => o.id === id);
        if (order) {
            order.status = status;
            localStorage.setItem('temu_orders', JSON.stringify(orders));
            alert('Order status updated!');
        }
    };

    // 4. Products Management & Image Upload
    window.renderProductList = () => {
        const products = Store.getProducts();
        const list = document.getElementById('admin-product-list');
        list.innerHTML = products.map(p => `
            <tr>
                <td><img src="${p.images[0]}" style="width:50px; height:50px; object-fit:cover; border-radius:8px;"></td>
                <td>${p.name}</td>
                <td>$${p.price}</td>
                <td><small>${p.sizes.join(', ')}</small></td>
                <td>
                    <button class="btn-save" style="padding:5px 10px; background:#3498db;" onclick="editProduct(${p.id})"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn-save" style="padding:5px 10px; background:#e74c3c;" onclick="deleteProduct(${p.id})"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    };

    window.handleProductImgUpload = async (input) => {
        const previews = document.getElementById('p-image-previews');
        const imagesTextarea = document.getElementById('p-images');
        let currentImages = imagesTextarea.value ? imagesTextarea.value.split('\n') : [];
        
        for (let file of input.files) {
            const base64 = await Store.toBase64(file);
            currentImages.push(base64);
            const img = document.createElement('img');
            img.src = base64;
            img.style.width = '60px'; img.style.height = '60px'; img.style.objectFit = 'cover'; img.style.borderRadius = '5px';
            previews.appendChild(img);
        }
        imagesTextarea.value = currentImages.join('\n');
    };

    window.handleHeroUpload = async (input) => {
        if (input.files && input.files[0]) {
            const base64 = await Store.toBase64(input.files[0]);
            document.getElementById('set-hero-bg-value').value = base64;
            document.getElementById('set-hero-bg-type').value = 'image';
        }
    };

    // 5. Settings, Footer, Categories
    window.renderFooterEditor = () => {
        const config = Store.getConfig();
        const editor = document.getElementById('footer-editor');
        editor.innerHTML = config.footer.columns.map((col, i) => `
            <div class="admin-card" style="border: 1px solid #eee;">
                <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                    <input type="text" value="${col.title}" onchange="updateFooterCol(${i}, 'title', this.value)" style="font-weight:bold; width:70%;">
                    <button style="color:red; border:none; background:none; cursor:pointer;" onclick="removeFooterCol(${i})"><i class="fa-solid fa-times"></i></button>
                </div>
                <textarea onchange="updateFooterCol(${i}, 'links', this.value)" style="height:60px;">${col.links.join('\n')}</textarea>
            </div>
        `).join('');
    };

    window.updateFooterCol = (index, field, value) => {
        const config = Store.getConfig();
        if (field === 'title') config.footer.columns[index].title = value;
        else config.footer.columns[index].links = value.split('\n').filter(l => l.trim() !== '');
        Store.saveConfig(config);
    };

    window.addFooterColumn = () => {
        const config = Store.getConfig();
        config.footer.columns.push({ title: 'New Column', links: ['Link 1'] });
        Store.saveConfig(config);
        renderFooterEditor();
    };

    window.removeFooterCol = (index) => {
        const config = Store.getConfig();
        config.footer.columns.splice(index, 1);
        Store.saveConfig(config);
        renderFooterEditor();
    };

    window.renderCategoryList = () => {
        const cats = Store.getCategories();
        const list = document.getElementById('category-list-admin');
        list.innerHTML = cats.map((cat, i) => `
            <div style="display:flex; gap:10px; margin-bottom:10px;">
                <input type="text" value="${cat.name}" onchange="updateCatAdmin(${i}, this.value)" style="flex:1;">
                <button onclick="removeCatAdmin(${i})" style="color:red; border:none; background:none; cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
            </div>
        `).join('');
    };

    window.updateCatAdmin = (index, name) => {
        const cats = Store.getCategories();
        cats[index].name = name;
        cats[index].slug = name.toLowerCase().replace(/ /g, '-');
        Store.saveCategories(cats);
    };

    window.addCategoryAdmin = () => {
        const cats = Store.getCategories();
        cats.push({ id: Date.now(), name: 'New Category', slug: 'new-category' });
        Store.saveCategories(cats);
        renderCategoryList();
    };

    window.removeCatAdmin = (index) => {
        const cats = Store.getCategories();
        cats.splice(index, 1);
        Store.saveCategories(cats);
        renderCategoryList();
    };

    // 6. Save Config
    window.saveSettings = () => {
        const config = Store.getConfig();
        config.siteName = document.getElementById('set-site-name').value;
        config.announcement = document.getElementById('set-announcement').value;
        config.shippingBanner = document.getElementById('set-shipping-banner').value;
        config.hero.headline = document.getElementById('set-hero-headline').value;
        config.hero.subtext = document.getElementById('set-hero-subtext').value;
        config.hero.ctaLabel = document.getElementById('set-hero-cta').value;
        config.hero.backgroundType = document.getElementById('set-hero-bg-type').value;
        config.hero.backgroundValue = document.getElementById('set-hero-bg-value').value;

        Store.saveConfig(config);
        alert('All settings saved successfully!');
    };

    // Global UI Logic
    window.switchTab = (tab) => {
        document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
        document.getElementById(`tab-${tab}`).style.display = 'block';
        document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
        const activeLink = document.querySelector(`.sidebar-nav a[onclick*="${tab}"]`);
        if (activeLink) activeLink.classList.add('active');
        if (tab === 'dashboard') loadAdminData(); // Refresh stats
    };

    window.logout = () => { Store.logout(); };

    // Product Modal Logic
    const productModal = document.getElementById('product-modal');
    const productForm = document.getElementById('product-form');

    window.openProductModal = () => {
        document.getElementById('modal-title').innerText = 'Add Product';
        productForm.reset();
        document.getElementById('p-id').value = '';
        document.getElementById('p-image-previews').innerHTML = '';
        productModal.style.display = 'flex';
    };

    window.closeModal = () => { productModal.style.display = 'none'; };

    window.editProduct = (id) => {
        const p = Store.getProductById(id);
        if (!p) return;
        document.getElementById('modal-title').innerText = 'Edit Product';
        document.getElementById('p-id').value = p.id;
        document.getElementById('p-name').value = p.name;
        document.getElementById('p-price').value = p.price;
        document.getElementById('p-desc').value = p.description;
        document.getElementById('p-sizes').value = p.sizes.join(', ');
        document.getElementById('p-images').value = p.images.join('\n');
        
        const previews = document.getElementById('p-image-previews');
        previews.innerHTML = p.images.map(img => `<img src="${img}" style="width:60px; height:60px; object-fit:cover; border-radius:5px;">`).join('');
        
        productModal.style.display = 'flex';
    };

    window.deleteProduct = (id) => {
        if (confirm('Delete this product?')) { Store.deleteProduct(id); renderProductList(); }
    };

    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('p-id').value;
        const data = {
            name: document.getElementById('p-name').value,
            price: document.getElementById('p-price').value,
            description: document.getElementById('p-desc').value,
            sizes: document.getElementById('p-sizes').value.split(',').map(s => s.trim()),
            images: document.getElementById('p-images').value.split('\n').filter(i => i.trim() !== '')
        };
        if (id) Store.updateProduct(id, data); else Store.addProduct(data);
        closeModal(); renderProductList();
    });
});
