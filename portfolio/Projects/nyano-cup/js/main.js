
const menuItems = [
    { id: 'm1', type: 'menu', tag: 'Signature Fusion', name: 'Himalayan Latte', price: 280, desc: 'Silky, velvet micro-foamed milk carefully poured over organic single-origin espresso and enhanced with local cardamom accents.', img: 'https://gurkhason.wordpress.com/wp-content/uploads/2012/07/img_2232d.jpg' },
    { id: 'm2', type: 'menu', tag: 'Intense Extraction', name: 'Gorkha Espresso', price: 180, desc: 'A powerful, clean double ristretto shot extracted precisely from dark-roasted high-altitude Typica varietal crop batches.', img: 'https://media-cdn.tripadvisor.com/media/photo-s/11/5a/96/14/photo1jpg.jpg' },
    { id: 'm3', type: 'menu', tag: 'Traditional Classic', name: 'Traditional Chhiya', price: 120, desc: 'Fine hand-rolled organic tea leaves slow-boiled with whole milk, fresh ginger root, cloves, and hillsides spices.', img: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop' },
    { id: 'm4', type: 'menu', tag: 'Heritage Pastry', name: 'Crispy Sel Roti', price: 90, desc: 'A delicate ring-shaped crispy pastry mixed from ground rice flour, clarified butter, and raw sugar, deep-fried to a golden hue.', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg4Dtam7yNc0ME44R5JG0gHRWFzubJtUQB92Id1gNrzg&s=10' },
    { id: 'b1', type: 'beans', tag: 'Whole Beans Bag', name: 'Gulmi Supreme Bag', price: 1200, desc: 'Premium hand-selected dark roast coffee beans from natural Gulmi hill micro-lots.', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRK1YYH-Qzl4xsoITkuc1D24EvXHLTdx1O2bKrVr-y28g&s=10' },
    { id: 'b2', type: 'beans', tag: 'Whole Beans Bag', name: 'Nuwakot High-Altitude Bag', price: 1350, desc: 'Bold structured flavor profile grown near organic mountain ranges under protective shade.', img: 'https://www.bodhileafcoffee.com/cdn/shop/files/DSF1411-resize_2000x.jpg?v=1777661179' },
    { id: 'b3', type: 'beans', tag: 'Whole Beans Bag', name: 'Lalitpur Honey Roast Bag', price: 1500, desc: 'Sweet profile processed continuously through artisanal honey micro-lot techniques.', img: 'https://static.wixstatic.com/media/302bc4_fc91e76b16cd4b6ea88b4a49f76c7560~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/302bc4_fc91e76b16cd4b6ea88b4a49f76c7560~mv2.png' }
];

let cart = JSON.parse(localStorage.getItem('nyano_cart')) || [];

document.addEventListener("DOMContentLoaded", () => {
    initScrollIntersectionObserver();
    initTopProgressBar();
    renderDynamicCatalog();
    initCartEngine();
    initFormsEngine();
    updatePortalNavButtonState();
});

function initScrollIntersectionObserver() {
    const sections = document.querySelectorAll("section, .hero-split-section");
    const navLinks = document.querySelectorAll("nav ul li a");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible-scroll");
                const currentId = entry.target.getAttribute("id");
                navLinks.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${currentId}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }, { root: null, threshold: 0.12 });

    sections.forEach(sec => observer.observe(sec));
}


function initTopProgressBar() {
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const progressBar = document.getElementById('scroll-progress-bar');
        if (progressBar) progressBar.style.width = scrolled + "%";
    });
}

function renderDynamicCatalog() {
    const menuGrid = document.getElementById('menu-grid-target');
    const shopGrid = document.getElementById('shop-grid-target');
    
    if (menuGrid) menuGrid.innerHTML = '';
    if (shopGrid) shopGrid.innerHTML = '';

    menuItems.forEach(item => {
        const cardHtml = `
            <div class="menu-card">
                <div class="card-img-wrapper">
                    <img src="${item.img}" alt="${item.name}">
                </div>
                <div class="card-content-box">
                    <div>
                        <span class="menu-tag">${item.tag}</span>
                        <h3 style="font-size: 18px; margin-bottom: 8px;">${item.name}</h3>
                        <p style="color: #7F8C8D; font-size: 13px; margin-bottom: 12px; min-height: 38px;">${item.desc}</p>
                    </div>
                    <div>
                        <span class="price-text">Rs. ${item.price}</span>
                        ${item.type === 'menu' 
                            ? `<button onclick="addToCart('${item.id}')" class="basic-btn" style="width: 100%; border-radius:12px;">Add to Basket</button>`
                            : `<div style="display:flex; gap:10px;">
                                 <button onclick="openProductModal('${item.id}')" class="secondary-btn" style="flex:1; padding:12px; font-size:12px; border-radius:12px;">Details</button>
                                 <button onclick="addToCart('${item.id}')" class="basic-btn" style="flex:1; padding:12px; font-size:12px; border-radius:12px;">Add Bag</button>
                               </div>`
                        }
                    </div>
                </div>
            </div>
        `;

        if (item.type === 'menu' && menuGrid) menuGrid.innerHTML += cardHtml;
        if (item.type === 'beans' && shopGrid) shopGrid.innerHTML += cardHtml;
    });
}

function initCartEngine() {
    window.addToCart = (id) => {
        const catalogItem = menuItems.find(i => i.id === id);
        if (!catalogItem) return;

        const cartItem = cart.find(i => i.id === id);
        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            cart.push({ id: catalogItem.id, name: catalogItem.name, price: catalogItem.price, img: catalogItem.img, quantity: 1 });
        }
        syncCartState();
    };

    window.removeItem = (index) => {
        cart.splice(index, 1);
        syncCartState();
    };

    window.syncCartState = () => {
        localStorage.setItem('nyano_cart', JSON.stringify(cart));
        renderCartUI();
    };

    window.renderCartUI = () => {
        const container = document.getElementById('cart-items-container');
        const countBadge = document.getElementById('cart-nav-count');
        const subtotalText = document.getElementById('breakdown-subtotal');
        const rateLabel = document.getElementById('breakdown-rate-label');
        const discountText = document.getElementById('breakdown-discount-val');
        const finalPriceText = document.getElementById('breakdown-final');
        const promoBanner = document.getElementById('basket-club-promo');

        if (!container) return;
        container.innerHTML = '';
        let subtotal = 0;
        let unitsCount = 0;

        if (cart.length === 0) {
            container.innerHTML = '<p style="color:#7F8C8D; text-align:center; padding:30px;">Your basket selection is empty.</p>';
            if (subtotalText) subtotalText.innerText = 'Rs. 0';
            if (discountText) discountText.innerText = '- Rs. 0';
            if (finalPriceText) finalPriceText.innerText = 'Rs. 0';
            if (countBadge) countBadge.style.display = 'none';
            return;
        }

        cart.forEach((item, index) => {
            let rowTotal = item.price * item.quantity;
            subtotal += rowTotal;
            unitsCount += item.quantity;
            container.innerHTML += `
                <div class="basket-item-row">
                    <div style="display:flex; align-items:center; gap:15px;">
                        <img src="${item.img}" style="width:65px; height:65px; object-fit:cover; border-radius:12px; border:1px solid rgba(0,0,0,0.05);" alt="${item.name}">
                        <div>
                            <strong style="color:var(--charcoal); font-size:15px; display:block;">${item.name}</strong>
                            <span style="font-size:13px; color:#7F8C8D;">Rs. ${item.price} &times; ${item.quantity}</span>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <span style="font-weight:800; color:var(--terracotta); display:block; font-size:16px;">Rs. ${rowTotal}</span>
                        <button onclick="removeItem(${index})" style="color:var(--error-red); cursor:pointer; background:none; border:none; font-size:12px; font-weight:700; text-decoration: underline;">Remove</button>
                    </div>
                </div>
            `;
        });

        const isMember = localStorage.getItem('userAuthenticated') === 'true';
        let discountRate = isMember ? 0.10 : 0.00; 
        let calculatedDiscount = subtotal * discountRate;
        let finalPayable = subtotal - calculatedDiscount;

        if (subtotalText) subtotalText.innerText = `Rs. ${subtotal}`;
        if (rateLabel) rateLabel.innerText = isMember ? '10%' : '0%';
        if (discountText) discountText.innerText = `- Rs. ${calculatedDiscount}`;
        if (finalPriceText) finalPriceText.innerText = `Rs. ${finalPayable}`;
        
        if (promoBanner) {
            if (isMember) {
                promoBanner.innerHTML = `🎉 <strong>Club Status Verified:</strong> You saved <strong>Rs. ${calculatedDiscount}</strong> on this order!`;
            } else {
                promoBanner.innerHTML = `✨ <strong>Exclusive Reward Club Rate:</strong> <span style="text-decoration:underline; cursor:pointer; font-weight:bold;" onclick="handlePortalClick()">Sign in / Register</span> to unlock an instant 10% Club Member discount on this entire order!`;
            }
        }

        if (countBadge) {
            countBadge.innerText = unitsCount;
            countBadge.style.display = 'inline-block';
        }
    };

    window.executeCheckout = () => {
        if (cart.length === 0) {
            alert('Your basket is empty!');
            return;
        }
        const isMember = localStorage.getItem('userAuthenticated') === 'true';
        let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        let finalPayable = isMember ? (subtotal * 0.90) : subtotal;

        alert(`Dhanyabad! Order successfully processed.\nTotal Paid: Rs. ${finalPayable}`);
        cart = [];
        syncCartState();
    };

    renderCartUI();
}

window.openProductModal = (id) => {
    const p = menuItems.find(item => item.id === id);
    if (p) {
        document.getElementById('modal-image-slot').innerHTML = `<img src="${p.img}" style="width:100%; height:100%; object-fit:cover; border-radius:12px;" alt="${p.name}">`;
        document.getElementById('modal-title').innerText = p.name;
        document.getElementById('modal-desc').innerText = p.desc;
        document.getElementById('modal-price').innerText = `Rs. ${p.price}`;
        document.getElementById('modal-action-slot').innerHTML = `
            <button onclick="addToCart('${p.id}'); closeModal();" class="basic-btn" style="width:100%; border-radius:12px;">Add Bag To Selection Basket</button>
        `;
        document.getElementById('product-modal').style.display = 'flex';
    }
};

window.closeModal = () => { document.getElementById('product-modal').style.display = 'none'; };

window.openPortalModal = (type) => {
    const body = document.getElementById('portal-modal-body');
    if (!body) return;

    if (type === 'login') {
        body.innerHTML = `
            <h3 style="color: var(--terracotta); font-size: 22px; margin-bottom: 5px;">Rewards Club Access</h3>
            <div id="portal-alert" class="portal-alert"></div>
            <form id="portalLoginForm">
                <div class="form-group"><label>Email Address</label><input type="email" id="portalEmail" placeholder="example@domain.com" required></div>
                <div class="form-group"><label>Password</label><input type="password" id="portalPassword" placeholder="••••••••" required></div>
                <button type="submit" class="basic-btn" style="width:100%; border-radius:12px;">Sign In</button>
                <p style="margin-top:20px; font-size:13px; text-align: center; color:#566573;">
                    New member? <span style="color:var(--terracotta); font-weight:700; cursor:pointer; text-decoration:underline;" onclick="openPortalModal('register')">Create Account</span>
                </p>
            </form>
        `;
    } else if (type === 'register') {
        body.innerHTML = `
            <h3 style="color: var(--terracotta); font-size: 22px; margin-bottom: 5px;">Join Club Membership</h3>
            <div id="portal-alert" class="portal-alert"></div>
            <form id="portalRegForm">
                <div class="form-group"><label>Full Name</label><input type="text" id="regName" placeholder="e.g., Bibek" required></div>
                <div class="form-group"><label>Email Address</label><input type="email" id="regEmail" placeholder="name@domain.com" required></div>
                <div class="form-group"><label>Create Password</label><input type="password" id="regPassword" minlength="6" required></div>
                <button type="submit" class="basic-btn" style="width:100%; border-radius:12px;">Register</button>
                <p style="margin-top:20px; font-size:13px; text-align: center; color:#566573;">
                    Already a member? <span style="color:var(--terracotta); font-weight:700; cursor:pointer; text-decoration:underline;" onclick="openPortalModal('login')">Log In</span>
                </p>
            </form>
        `;
    } else if (type === 'dashboard') {
        const activeUser = localStorage.getItem('clubUserName') || 'Valued Member';
        body.innerHTML = `
            <h3 style="color: var(--terracotta); font-size: 22px; margin-bottom: 5px;">Namaste, ${activeUser}!</h3>
            <div style="background:rgba(166,75,42,0.06); padding:20px; margin-bottom: 20px; border-radius:14px; text-align: center;">
                <h2 style="color:var(--marigold); font-size:32px; font-weight: 800;">150 Points</h2>
                <p style="font-size: 12px; color: #2C3E50;">Your persistent reward savings are live.</p>
            </div>
            <button onclick="terminateSession()" class="basic-btn" style="background:#BDC3C7; color:var(--charcoal); width:100%; border-radius:12px;">Sign Out</button>
        `;
    }
    document.getElementById('portal-modal').style.display = 'flex';
    attachPortalListeners();
};

window.closePortalModal = () => { document.getElementById('portal-modal').style.display = 'none'; };

window.handlePortalClick = () => {
    if (localStorage.getItem('userAuthenticated') === 'true') {
        openPortalModal('dashboard');
    } else {
        openPortalModal('login');
    }
};

function displayAlert(text, type) {
    const box = document.getElementById('portal-alert');
    if (!box) return;
    box.className = `portal-alert ${type}`;
    box.innerText = text;
    box.style.display = 'block';
}

function attachPortalListeners() {
    document.getElementById('portalLoginForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('portalEmail').value.trim().toLowerCase();
        const pass = document.getElementById('portalPassword').value;

        if (email === localStorage.getItem('clubUserEmail') && pass === localStorage.getItem('clubUserPassword')) {
            localStorage.setItem('userAuthenticated', 'true');
            updatePortalNavButtonState();
            openPortalModal('dashboard');
        } else {
            displayAlert('Authentication Rejected.', 'error');
        }
    });

    document.getElementById('portalRegForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        localStorage.setItem('clubUserEmail', document.getElementById('regEmail').value.trim().toLowerCase());
        localStorage.setItem('clubUserPassword', document.getElementById('regPassword').value);
        localStorage.setItem('clubUserName', document.getElementById('regName').value.trim());
        localStorage.setItem('userAuthenticated', 'true');
        updatePortalNavButtonState();
        displayAlert('Welcome aboard!', 'success');
        setTimeout(() => { closePortalModal(); }, 1000);
    });
}

function updatePortalNavButtonState() {
    const btn = document.getElementById('portal-nav-btn');
    if (!btn) return;
    if (localStorage.getItem('userAuthenticated') === 'true') {
        btn.innerText = "My Dashboard";
        btn.style.background = "var(--terracotta)";
    } else {
        btn.innerText = "Club Login";
        btn.style.background = "var(--charcoal)";
    }
    if (typeof renderCartUI === 'function') renderCartUI();
}

window.terminateSession = () => {
    localStorage.removeItem('userAuthenticated');
    updatePortalNavButtonState();
    closePortalModal();
};

function initFormsEngine() {
    document.getElementById('bookingForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert(`Reservation parameters transmitted successfully.`);
        e.target.reset();
    });
    document.getElementById('contactForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Message successfully transmitted to Desk.');
        e.target.reset();
    });
}