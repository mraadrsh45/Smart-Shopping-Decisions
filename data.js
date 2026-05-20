document.addEventListener("DOMContentLoaded", () => {
    // ══════════ LOGIN ══════════
    const loginScreen = document.getElementById("loginScreen");
    const adminLayout = document.getElementById("adminLayout");
    const loginForm = document.getElementById("loginForm");
    const loginError = document.getElementById("loginError");

    const isLoggedIn = sessionStorage.getItem("adminLogged");
    if (isLoggedIn) {
        loginScreen.classList.add("hidden");
        adminLayout.classList.remove("hidden");
        initAdmin();
    }

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("loginEmail").value;
        const pass = document.getElementById("loginPass").value;
        if (email === "admin@smartcompare.com" && pass === "admin123") {
            sessionStorage.setItem("adminLogged", "true");
            loginScreen.classList.add("hidden");
            adminLayout.classList.remove("hidden");
            initAdmin();
        } else {
            loginError.classList.remove("hidden");
        }
    });

    document.getElementById("logoutBtn").addEventListener("click", () => {
        sessionStorage.removeItem("adminLogged");
        window.location.reload();
    });

    // ══════════ DATA & STATE ══════════
    let products = [];
    let listings = [];
    
    function loadData() {
        products = getProducts();
        listings = getListings();
        document.getElementById("statProducts").textContent = products.length.toLocaleString();
        document.getElementById("statListings").textContent = listings.length.toLocaleString();
    }

    function saveData() {
        localStorage.setItem("products", JSON.stringify(products));
        localStorage.setItem("listings", JSON.stringify(listings));
        loadData();
    }

    // ══════════ NAVIGATION ══════════
    const navItems = document.querySelectorAll(".nav-item");
    const pages = document.querySelectorAll(".admin-page");
    const topbarTitle = document.getElementById("topbarTitle");

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            navItems.forEach(nav => nav.classList.remove("active"));
            pages.forEach(p => p.classList.remove("active"));
            
            item.classList.add("active");
            const target = item.dataset.target;
            document.getElementById(`page-${target}`).classList.add("active");
            
            topbarTitle.textContent = item.textContent.trim();

            if (target === "products") renderProductsTable();
            if (target === "listings") renderListingsTable();
            if (target === "add-listing") populateProductSelect();
        });
    });

    // ══════════ PRODUCTS TABLE ══════════
    const productsTbody = document.getElementById("productsTbody");
    const searchProducts = document.getElementById("searchProducts");
    const productsPaginator = document.getElementById("productsPaginator");
    let pPage = 1;
    const itemsPerPage = 15;

    function renderProductsTable() {
        const query = searchProducts.value.toLowerCase();
        let filtered = products;
        if (query) {
            filtered = products.filter(p => p.product_name.toLowerCase().includes(query) || p.product_id.toLowerCase().includes(query));
        }

        const totalPages = Math.ceil(filtered.length / itemsPerPage);
        if (pPage > totalPages && totalPages > 0) pPage = totalPages;

        const start = (pPage - 1) * itemsPerPage;
        const pageItems = filtered.slice(start, start + itemsPerPage);

        productsTbody.innerHTML = pageItems.map(p => `
            <tr>
                <td><strong>${p.product_id}</strong></td>
                <td><img src="${p.image}" style="width:40px;height:40px;object-fit:cover;border-radius:4px;"/></td>
                <td>${p.product_name}</td>
                <td><span class="badge-sm" style="background:var(--bg3);border:1px solid var(--border)">${p.category}</span></td>
                <td>${p.brand}</td>
                <td>
                    <div class="tbl-actions">
                        <button class="tbl-btn tbl-btn-edit">Edit</button>
                        <button class="tbl-btn tbl-btn-del" onclick="deleteProduct('${p.product_id}')">Delete</button>
                    </div>
                </td>
            </tr>
        `).join("");

        renderPaginator(productsPaginator, totalPages, pPage, (newPage) => { pPage = newPage; renderProductsTable(); });
    }

    searchProducts.addEventListener("input", () => { pPage = 1; renderProductsTable(); });

    window.deleteProduct = (id) => {
        if(confirm("Are you sure? This will delete the product and ALL its listings!")) {
            products = products.filter(p => p.product_id !== id);
            listings = listings.filter(l => l.product_id !== id);
            saveData();
            renderProductsTable();
            showToast("Product deleted successfully");
        }
    };

    // ══════════ LISTINGS TABLE ══════════
    const listingsTbody = document.getElementById("listingsTbody");
    const searchListings = document.getElementById("searchListings");
    const listingsPaginator = document.getElementById("listingsPaginator");
    let lPage = 1;

    function renderListingsTable() {
        const query = searchListings.value.toLowerCase();
        let filtered = listings;
        if (query) {
            filtered = listings.filter(l => l.product_id.toLowerCase().includes(query) || l.platform.toLowerCase().includes(query));
        }

        const totalPages = Math.ceil(filtered.length / itemsPerPage);
        if (lPage > totalPages && totalPages > 0) lPage = totalPages;

        const start = (lPage - 1) * itemsPerPage;
        const pageItems = filtered.slice(start, start + itemsPerPage);

        listingsTbody.innerHTML = pageItems.map(l => `
            <tr>
                <td><strong>${l.listing_id}</strong></td>
                <td>${l.product_id}</td>
                <td><span class="badge-sm" style="background:var(--bg3);border:1px solid var(--border);color:var(--text)">${l.platform}</span></td>
                <td><span style="color:var(--green);font-weight:700">₹${l.price.toLocaleString()}</span></td>
                <td>⭐ ${l.rating}</td>
                <td>
                    <div class="tbl-actions">
                        <button class="tbl-btn tbl-btn-edit">Edit</button>
                        <button class="tbl-btn tbl-btn-del" onclick="deleteListing('${l.listing_id}')">Delete</button>
                    </div>
                </td>
            </tr>
        `).join("");

        renderPaginator(listingsPaginator, totalPages, lPage, (newPage) => { lPage = newPage; renderListingsTable(); });
    }

    searchListings.addEventListener("input", () => { lPage = 1; renderListingsTable(); });

    window.deleteListing = (id) => {
        if(confirm("Are you sure you want to delete this listing?")) {
            listings = listings.filter(l => l.listing_id !== id);
            saveData();
            renderListingsTable();
            showToast("Listing deleted successfully");
        }
    };

    // ══════════ FORMS ══════════
    const addProductForm = document.getElementById("addProductForm");
    addProductForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const pId = "P" + String(Date.now()).slice(-6);
        const newProd = {
            product_id: pId,
            product_name: document.getElementById("pName").value,
            brand: document.getElementById("pBrand").value,
            category: document.getElementById("pCategory").value,
            image: document.getElementById("pImage").value,
            description: document.getElementById("pDesc").value
        };
        products.push(newProd);
        saveData();
        addProductForm.reset();
        showToast("Product added successfully");
        document.querySelector('[data-target="products"]').click();
    });

    const lProductSelect = document.getElementById("lProduct");
    function populateProductSelect() {
        lProductSelect.innerHTML = products.map(p => `<option value="${p.product_id}">${p.product_name} (${p.product_id})</option>`).join("");
    }

    const addListingForm = document.getElementById("addListingForm");
    addListingForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const lId = "L" + String(Date.now()).slice(-6);
        const price = parseInt(document.getElementById("lPrice").value);
        const orig = parseInt(document.getElementById("lOrig").value);
        let disc = document.getElementById("lDisc").value;
        if (!disc) {
            disc = Math.round(((orig - price) / orig) * 100);
        } else {
            disc = parseInt(disc);
        }

        const newListing = {
            listing_id: lId,
            product_id: document.getElementById("lProduct").value,
            platform: document.getElementById("lPlatform").value,
            price: price,
            original_price: orig,
            discount_percentage: disc,
            rating: parseFloat(document.getElementById("lRating").value),
            review_count: parseInt(document.getElementById("lReviews").value),
            delivery_time: document.getElementById("lDel").value,
            seller_name: document.getElementById("lSeller").value
        };
        listings.push(newListing);
        saveData();
        addListingForm.reset();
        showToast("Listing added successfully");
        document.querySelector('[data-target="listings"]').click();
    });

    // ══════════ BULK UPLOAD ══════════
    const uploadZone = document.getElementById("uploadZone");
    const fileInput = document.getElementById("fileInput");
    const uploadPreview = document.getElementById("uploadPreview");
    const uploadBtns = document.getElementById("uploadBtns");
    let bulkData = null;

    uploadZone.addEventListener("click", () => fileInput.click());
    
    fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                bulkData = JSON.parse(ev.target.result);
                uploadPreview.textContent = JSON.stringify(bulkData, null, 2);
                uploadPreview.classList.remove("hidden");
                uploadBtns.classList.remove("hidden");
            } catch(err) {
                showToast("Invalid JSON file");
            }
        };
        reader.readAsText(file);
    });

    document.getElementById("cancelUpload").addEventListener("click", () => {
        fileInput.value = "";
        bulkData = null;
        uploadPreview.classList.add("hidden");
        uploadBtns.classList.add("hidden");
    });

    document.getElementById("confirmUpload").addEventListener("click", () => {
        if(bulkData && Array.isArray(bulkData)) {
            // Very naive bulk upload logic (assuming array of products with nested listings or array of flat items)
            showToast("Bulk upload successful! (Demo implementation)");
            fileInput.value = "";
            bulkData = null;
            uploadPreview.classList.add("hidden");
            uploadBtns.classList.add("hidden");
        }
    });

    // ══════════ UTILS ══════════
    function renderPaginator(container, total, current, callback) {
        if (total <= 1) { container.innerHTML = ""; return; }
        let html = `<span>Page ${current} of ${total}</span><div style="margin-left:auto;display:flex;gap:4px">`;
        if (current > 1) html += `<button class="page-btn" data-page="${current-1}">Prev</button>`;
        
        let startPage = Math.max(1, current - 2);
        let endPage = Math.min(total, current + 2);
        
        for (let i = startPage; i <= endPage; i++) {
            html += `<button class="page-btn ${i===current?'active':''}" data-page="${i}">${i}</button>`;
        }

        if (current < total) html += `<button class="page-btn" data-page="${current+1}">Next</button>`;
        html += `</div>`;
        container.innerHTML = html;

        container.querySelectorAll(".page-btn").forEach(btn => {
            btn.addEventListener("click", () => callback(parseInt(btn.dataset.page)));
        });
    }

    const toast = document.getElementById("toast");
    function showToast(msg) {
        toast.textContent = msg;
        toast.classList.remove("hidden");
        setTimeout(() => toast.classList.add("hidden"), 3000);
    }

    function initAdmin() {
        loadData();
    }
});
