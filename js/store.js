const Store = {
    // Default configuration for first launch
    defaultConfig: {
        siteName: 'TEMU',
        announcement: 'FREE SHIPPING ON ALL ORDERS | EXTRA 30% OFF FOR NEW USERS',
        shippingBanner: 'Free Shipping on all orders today!',
        showTimer: true,
        shippingPrice: 0,
        hero: {
            headline: 'Spring Mega Sale',
            subtext: 'Up to 90% Off on everything you love!',
            ctaLabel: 'Shop Now',
            ctaLink: '#products',
            backgroundType: 'gradient', // 'color', 'image', 'gradient'
            backgroundValue: 'linear-gradient(135deg, #ff9966, #ff5e62)'
        },
        footer: {
            copyright: '© 2026 TEMU. All rights reserved.',
            columns: [
                { title: 'About Us', links: ['Company Info', 'Careers', 'Policies'] },
                { title: 'Customer Service', links: ['Help Center', 'Returns', 'Contact'] },
                { title: 'Payment Methods', links: ['Cash on Delivery'] }
            ]
        },
        theme: {
            primaryColor: '#FF6600',
            secondaryColor: '#000000',
            bgVariant: 'light'
        },
        categories: [
            { id: 1, name: 'Fashion', slug: 'fashion' },
            { id: 2, name: 'Electronics', slug: 'electronics' },
            { id: 3, name: 'Home & Kitchen', slug: 'home-kitchen' }
        ],
        admin: {
            isSetup: false,
            passwordHash: null,
            username: 'admin'
        }
    },

    init() {
        const savedConfig = localStorage.getItem('temu_config');
        if (!savedConfig) {
            localStorage.setItem('temu_config', JSON.stringify(this.defaultConfig));
        } else {
            // Merge defaults to ensure new fields are added to existing configs
            const current = JSON.parse(savedConfig);
            const merged = { ...this.defaultConfig, ...current, 
                hero: { ...this.defaultConfig.hero, ...current.hero },
                footer: { ...this.defaultConfig.footer, ...current.footer },
                theme: { ...this.defaultConfig.theme, ...current.theme },
                admin: { ...this.defaultConfig.admin, ...current.admin }
            };
            localStorage.setItem('temu_config', JSON.stringify(merged));
        }

        if (!localStorage.getItem('temu_products')) {
            localStorage.setItem('temu_products', JSON.stringify([]));
        }
        if (!localStorage.getItem('temu_orders')) {
            localStorage.setItem('temu_orders', JSON.stringify([]));
        }
    },

    // Config Management
    getConfig() {
        return JSON.parse(localStorage.getItem('temu_config'));
    },

    saveConfig(config) {
        try {
            localStorage.setItem('temu_config', JSON.stringify(config));
            window.dispatchEvent(new CustomEvent('configUpdated', { detail: config }));
        } catch (e) {
            console.error('Failed to save config to localStorage:', e);
            alert('Storage limit reached! Try using smaller images.');
        }
    },

    // Admin Auth
    setupAdmin(username, password) {
        const config = this.getConfig();
        config.admin.username = username;
        config.admin.passwordHash = btoa(password);
        config.admin.isSetup = true;
        this.saveConfig(config);
    },

    checkLogin(username, password) {
        const config = this.getConfig();
        return username === config.admin.username && btoa(password) === config.admin.passwordHash;
    },

    logout() {
        sessionStorage.removeItem('admin_session');
        window.location.href = 'index.html';
    },

    // Product Management
    getProducts() {
        return JSON.parse(localStorage.getItem('temu_products')) || [];
    },

    saveProducts(products) {
        try {
            localStorage.setItem('temu_products', JSON.stringify(products));
            window.dispatchEvent(new CustomEvent('productsUpdated', { detail: products }));
        } catch (e) {
            console.error('Failed to save products to localStorage:', e);
            alert('Storage limit reached! Please use smaller images or remove some products.');
        }
    },

    addProduct(product) {
        const products = this.getProducts();
        product.id = Date.now();
        product.createdAt = new Date().toISOString();
        products.unshift(product);
        this.saveProducts(products);
        return product;
    },

    updateProduct(id, updatedData) {
        const products = this.getProducts();
        const index = products.findIndex(p => p.id == id);
        if (index !== -1) {
            products[index] = { ...products[index], ...updatedData };
            this.saveProducts(products);
        }
    },

    deleteProduct(id) {
        let products = this.getProducts();
        products = products.filter(p => p.id != id);
        this.saveProducts(products);
    },

    getProductById(id) {
        return this.getProducts().find(p => p.id == id);
    },

    // Category Management
    getCategories() {
        return this.getConfig().categories;
    },

    saveCategories(categories) {
        const config = this.getConfig();
        config.categories = categories;
        this.saveConfig(config);
    },

    // Order Management (The "Excel" Table)
    getOrders() {
        return JSON.parse(localStorage.getItem('temu_orders')) || [];
    },

    addOrder(order) {
        const orders = this.getOrders();
        order.id = 'ORD-' + Date.now().toString().slice(-6);
        order.date = new Date().toLocaleString();
        order.status = 'Pending';
        orders.unshift(order);
        localStorage.setItem('temu_orders', JSON.stringify(orders));
        return order;
    },

    // Cart Management
    getCart() {
        return JSON.parse(localStorage.getItem('temu_cart')) || [];
    },

    addToCart(product, size) {
        const cart = this.getCart();
        const existing = cart.find(item => item.id == product.id && item.selectedSize == size);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ ...product, selectedSize: size, quantity: 1 });
        }
        localStorage.setItem('temu_cart', JSON.stringify(cart));
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
    },

    removeFromCart(id, size) {
        let cart = this.getCart();
        cart = cart.filter(item => !(item.id == id && item.selectedSize == size));
        localStorage.setItem('temu_cart', JSON.stringify(cart));
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
    },

    clearCart() {
        localStorage.removeItem('temu_cart');
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: [] }));
    },

    // Utility: Image to Base64
    toBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
};

Store.init();
