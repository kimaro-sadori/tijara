document.addEventListener('DOMContentLoaded', () => {
    // 1. Load Configuration
    function applyConfig() {
        const config = Store.getConfig();
        
        // Site Identity
        document.title = `${config.siteName} | Shop Online`;
        document.getElementById('site-logo').innerText = config.siteName;
        document.getElementById('announcement-bar').innerText = config.announcement;

        // Hero
        document.getElementById('hero-headline').innerText = config.hero.headline;
        document.getElementById('hero-subtext').innerText = config.hero.subtext;
        document.getElementById('hero-cta').innerText = config.hero.ctaLabel;
        document.getElementById('hero-cta').href = config.hero.ctaLink;

        const heroSec = document.getElementById('hero-section');
        if (config.hero.backgroundType === 'image') {
            heroSec.style.background = ''; // Clear background color/gradient
            heroSec.style.backgroundImage = `url('${config.hero.backgroundValue}')`;
        } else {
            heroSec.style.backgroundImage = ''; // Clear image
            heroSec.style.background = config.hero.backgroundValue;
        }

        // Timer Visibility
        const flashSaleSection = document.getElementById('flash-sale-section');
        if (flashSaleSection) {
            flashSaleSection.style.display = config.showTimer ? 'block' : 'none';
        }

        // Theme
        document.documentElement.style.setProperty('--primary', config.theme.primaryColor);
        
        // Footer
        document.getElementById('footer-copyright').innerText = config.footer.copyright;
        const footerGrid = document.getElementById('footer-dynamic-grid');
        footerGrid.innerHTML = config.footer.columns.map(col => `
            <div class="footer-col">
                <h4>${col.title}</h4>
                <ul>${col.links.map(link => `<li>${link}</li>`).join('')}</ul>
            </div>
        `).join('');
    }

    // 2. Render Products
    function renderProducts() {
        const products = Store.getProducts();
        console.log('Rendering products:', products);
        const grid = document.getElementById('product-grid');
        
        if (!grid) return;

        if (products.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 60px; color: #999;">No products available. Visit admin to add some!</p>';
            return;
        }

        grid.innerHTML = products.map(p => {
            const img = (p.images && p.images.length > 0) ? p.images[0] : 'https://via.placeholder.com/300x300?text=No+Image';
            return `
                <div class="product-card" onclick="location.href='product.html?id=${p.id}'">
                    <img src="${img}" alt="${p.name}" loading="lazy">
                    <div class="product-info">
                        <h3 class="product-name">${p.name}</h3>
                        <div class="product-price">
                            ${p.price} DH
                            <span class="price-old">${(p.price * 1.4).toFixed(2)} DH</span>
                        </div>
                        <div class="product-footer">
                            <span>Best Seller</span>
                            <span>Free Shipping</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // 3. Cart Badge
    function updateCartBadge() {
        const cart = Store.getCart();
        const count = cart.reduce((acc, item) => acc + item.quantity, 0);
        document.getElementById('cart-count-badge').innerText = count;
    }

    // Initial Load
    applyConfig();
    renderProducts();
    updateCartBadge();

    // Event Listeners
    window.addEventListener('configUpdated', applyConfig);
    window.addEventListener('productsUpdated', renderProducts);
    window.addEventListener('cartUpdated', updateCartBadge);
    
    // Cross-tab synchronization
    window.addEventListener('storage', (e) => {
        if (e.key === 'temu_config') applyConfig();
        if (e.key === 'temu_products') renderProducts();
        if (e.key === 'temu_cart') updateCartBadge();
    });

    // Countdown
    let time = 7200; 
    setInterval(() => {
        time--; if (time < 0) time = 7200;
        const h = Math.floor(time / 3600);
        const m = Math.floor((time % 3600) / 60);
        const s = time % 60;
        const cd = document.getElementById('countdown');
        if (cd) cd.innerText = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }, 1000);
});
