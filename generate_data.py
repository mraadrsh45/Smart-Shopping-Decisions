document.addEventListener("DOMContentLoaded", () => {
    // ══════════ DOM ELEMENTS ══════════
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const heroSearch = document.getElementById("heroSearch");
    const heroSearchBtn = document.getElementById("heroSearchBtn");
    const tags = document.querySelectorAll(".tag");

    const navHome = document.getElementById("navHome");
    const navCompare = document.getElementById("navCompare");

    const mainContent = document.getElementById("mainContent");
    const homeView = document.getElementById("homeView");
    const resultsView = document.getElementById("resultsView");
    
    const filtersBar = document.getElementById("filtersBar");
    const filterPlatform = document.getElementById("filterPlatform");
    const filterMinPrice = document.getElementById("filterMinPrice");
    const filterMaxPrice = document.getElementById("filterMaxPrice");
    const filterRating = document.getElementById("filterRating");
    const sortBy = document.getElementById("sortBy");
    const applyFiltersBtn = document.getElementById("applyFilters");
    const clearFiltersBtn = document.getElementById("clearFilters");

    const categoryGrid = document.getElementById("categoryGrid");
    const topDealsGrid = document.getElementById("topDealsGrid");
    const bestValueGrid = document.getElementById("bestValueGrid");
    const resultsGrid = document.getElementById("resultsGrid");
    const resultsTitle = document.getElementById("resultsTitle");
    const resultsCount = document.getElementById("resultsCount");
    const noResults = document.getElementById("noResults");

    const modalOverlay = document.getElementById("productModal");
    const modalClose = document.getElementById("modalClose");
    const modalContent = document.getElementById("modalContent");

    const compareTray = document.getElementById("compareTray");
    const trayItems = document.getElementById("trayItems");
    const openCompareBtn = document.getElementById("openCompare");
    const clearCompareBtn = document.getElementById("clearCompare");

    const comparePage = document.getElementById("comparePage");
    const compareContent = document.getElementById("compareContent");
    const backFromCompareBtn = document.getElementById("backFromCompare");

    const personalBar = document.getElementById("personalBar");
    const personalMsg = document.getElementById("personalMsg");

    const toast = document.getElementById("toast");

    // ══════════ STATE ══════════
    let allProducts = getProducts();
    let allListings = getListings();
    let currentSearchResults = [];
    let compareList = []; // Array of product objects
    let history = JSON.parse(localStorage.getItem("search_history") || "[]");

    // Clear old data to load new generated data with real images and fuzzy logic
    if (localStorage.getItem("app_version") !== "1.3") {
        localStorage.clear();
        localStorage.setItem("app_version", "1.3");
        location.reload();
    }

    // ══════════ AI & SCORE LOGIC ══════════
    function calculateValueScore(price, rating, reviewCount) {
        if (!price || price <= 0) return 0;
        return (rating * Math.log(reviewCount + 1)) / price * 10000; // Scaled for readability
    }

    function calculateTrustScore(rating, reviewCount) {
        // FUZZY LOGIC IMPLEMENTATION FOR TRUST SCORE
        
        // 1. Fuzzification
        // Rating: Low (1-3), Med (2-4), High (3.5-5)
        let rLow = Math.max(0, Math.min(1, (3 - rating) / 1));
        let rMed = Math.max(0, Math.min((rating - 2) / 1, (4 - rating) / 1));
        let rHigh = Math.max(0, Math.min(1, (rating - 3.5) / 1.5));

        // Reviews: Few (0-1000), Some (500-5000), Many (3000-10000+)
        let vFew = Math.max(0, Math.min(1, (1000 - reviewCount) / 1000));
        let vSome = Math.max(0, Math.min((reviewCount - 500) / 500, (5000 - reviewCount) / 1000));
        let vMany = Math.max(0, Math.min(1, (reviewCount - 3000) / 2000));
        if (reviewCount > 5000) vMany = 1;
        if (reviewCount > 1000) vFew = 0;

        // 2. Rules Evaluation (Mamdani inference)
        let outLow = rLow; // If Rating Low -> Trust is Low
        outLow = Math.max(outLow, Math.min(rMed, vFew)); // If Rating Med & Reviews Few -> Trust Low
        
        let outMed = Math.min(rMed, vSome); // If Rating Med & Reviews Some -> Trust Med
        outMed = Math.max(outMed, Math.min(rMed, vMany)); // If Rating Med & Reviews Many -> Trust Med
        outMed = Math.max(outMed, Math.min(rHigh, vFew)); // If Rating High & Reviews Few -> Trust Med
        
        let outHigh = Math.min(rHigh, vSome); // If Rating High & Reviews Some -> Trust High
        outHigh = Math.max(outHigh, Math.min(rHigh, vMany)); // If Rating High & Reviews Many -> Trust High

        // 3. Defuzzification (Centroid simplified)
        let num = (outLow * 25) + (outMed * 50) + (outHigh * 85);
        let den = outLow + outMed + outHigh;
        
        if (den === 0) return 0;
        let score = num / den;
        
        // Bonus for extremely high values
        if (rating > 4.5 && reviewCount > 10000) {
            score += (rating - 4.5) * 10 + (reviewCount - 10000)/5000;
        }
        
        return Math.min(100, Math.round(score));
    }

    function getTrustClassAndLabel(score) {
        if (score >= 80) return { class: "trust-high", label: "Highly Trusted ✅" };
        if (score >= 50) return { class: "trust-mid", label: "Moderate Trust" };
        return { class: "trust-low", label: "Low Trust ⚠️" };
    }

    function enrichProduct(product) {
        const listings = getListingsForProduct(product.product_id);
        if (listings.length === 0) return null;

        // Sort listings by price
        listings.sort((a, b) => a.price - b.price);
        
        let lowestPriceListing = listings[0];
        let highestRatingListing = [...listings].sort((a, b) => b.rating - a.rating)[0];
        
        let bestValueScore = -1;
        let bestValueListing = null;

        listings.forEach(l => {
            const valScore = calculateValueScore(l.price, l.rating, l.review_count);
            l.calculated_value_score = valScore;
            if (valScore > bestValueScore) {
                bestValueScore = valScore;
                bestValueListing = l;
            }
        });

        // Smart Tagging
        let avgPrice = listings.reduce((sum, l) => sum + l.price, 0) / listings.length;
        let tags = [];
        
        if (lowestPriceListing === bestValueListing && bestValueScore > 50) {
            tags.push({ type: "value", label: "Best Value For Money", class: "badge-value" });
        }
        if (highestRatingListing.rating > 4.2 && highestRatingListing.price > avgPrice * 1.1) {
            tags.push({ type: "overpriced", label: "High Rating but Overpriced", class: "badge-over" });
        }
        if (lowestPriceListing.price < avgPrice * 0.8 && lowestPriceListing.rating < 3.5) {
            tags.push({ type: "cheap", label: "Cheap but Low Quality", class: "badge-cheap" });
        }
        if (lowestPriceListing.discount_percentage > 40) {
            tags.push({ type: "best", label: "Best Deal", class: "badge-best" });
        }
        
        const maxTrust = Math.max(...listings.map(l => calculateTrustScore(l.rating, l.review_count)));
        if (maxTrust >= 80) {
            tags.push({ type: "trust", label: `Trust Score: ${Math.round(maxTrust)} ✅`, class: "badge-trust" });
        }

        if (tags.length === 0 && lowestPriceListing.price < 5000) {
            tags.push({ type: "budget", label: "Budget Pick", class: "badge-cheap" });
        }

        return {
            ...product,
            listings,
            lowestPriceListing,
            highestRatingListing,
            bestValueListing,
            bestValueScore,
            tags
        };
    }

    const enrichedProducts = allProducts.map(enrichProduct).filter(p => p !== null);

    // ══════════ INITIALIZATION ══════════
    function init() {
        renderCategories();
        renderTopDeals();
        renderBestValue();
        updateCompareTray();
        checkPersonalization();
    }

    function renderCategories() {
        const categories = [...new Set(allProducts.map(p => p.category))];
        categoryGrid.innerHTML = categories.map(cat => {
            let emoji = "📦";
            if (cat==="Smartphones") emoji = "📱";
            if (cat==="Laptops") emoji = "💻";
            if (cat==="Kitchen Appliances") emoji = "🥘";
            if (cat==="Shoes") emoji = "👟";
            if (cat==="Televisions") emoji = "📺";
            if (cat==="Audio") emoji = "🎧";
            if (cat==="Watches") emoji = "⌚";
            return `
                <div class="cat-card" onclick="searchByCategory('${cat}')">
                    <div class="cat-icon">${emoji}</div>
                    <div class="cat-name">${cat}</div>
                </div>
            `;
        }).join("");
    }

    function renderTopDeals() {
        // Products with highest discount
        const sorted = [...enrichedProducts].sort((a, b) => b.lowestPriceListing.discount_percentage - a.lowestPriceListing.discount_percentage);
        renderProductGrid(sorted.slice(0, 8), topDealsGrid);
    }

    function renderBestValue() {
        // Products with highest value score
        const sorted = [...enrichedProducts].sort((a, b) => b.bestValueScore - a.bestValueScore);
        renderProductGrid(sorted.slice(0, 8), bestValueGrid);
    }

    function renderProductGrid(productsToRender, container) {
        container.innerHTML = productsToRender.map(p => {
            const l = p.lowestPriceListing;
            const inCompare = compareList.some(item => item.product_id === p.product_id);
            const tagHtml = p.tags.slice(0,2).map(t => `<span class="badge ${t.class}">${t.label}</span>`).join("");
            
            const platformsHtml = p.listings.slice(0,3).map(list => {
                let pClass = "plt-custom";
                if(list.platform === "Amazon") pClass = "plt-amazon";
                if(list.platform === "Flipkart") pClass = "plt-flipkart";
                if(list.platform === "Meesho") pClass = "plt-meesho";
                return `<span class="plt-tag ${pClass}">${list.platform}</span>`;
            }).join("");

            return `
                <div class="product-card" onclick="openProductModal('${p.product_id}')">
                    <div class="card-badges">${tagHtml}</div>
                    <input type="checkbox" class="compare-checkbox" ${inCompare ? "checked" : ""} onclick="event.stopPropagation(); toggleCompare('${p.product_id}', this.checked)"/>
                    <div class="card-img-wrap"><img src="${p.image}" style="width:100%;height:100%;object-fit:cover;" alt="${p.product_name}"/></div>
                    <div class="card-body">
                        <div class="card-brand">${p.brand}</div>
                        <div class="card-name">${p.product_name}</div>
                        <div class="card-price-row">
                            <span class="card-price">₹${l.price.toLocaleString()}</span>
                            <span class="card-orig">₹${l.original_price.toLocaleString()}</span>
                            <span class="card-discount">${l.discount_percentage}% off</span>
                        </div>
                        <div class="card-rating">
                            <span class="stars">⭐ ${l.rating}</span>
                            <span class="review-count">(${l.review_count.toLocaleString()})</span>
                        </div>
                        <div class="card-platforms">${platformsHtml}${p.listings.length > 3 ? `<span class="plt-tag plt-custom">+${p.listings.length-3}</span>` : ''}</div>
                        <div class="card-footer">
                            <button class="card-btn card-btn-primary">View Deals</button>
                        </div>
                    </div>
                </div>
            `;
        }).join("");
    }

    // ══════════ SEARCH & FILTER ══════════
    function performSearch(query, isCategory = false) {
        query = query.trim().toLowerCase();
        if (!query) return;

        // Save history
        if (!isCategory) {
            history = [query, ...history.filter(h => h !== query)].slice(0, 5);
            localStorage.setItem("search_history", JSON.stringify(history));
            checkPersonalization();
        }

        let results = enrichedProducts.filter(p => {
            if (isCategory) return p.category.toLowerCase() === query;
            return p.product_name.toLowerCase().includes(query) || 
                   p.brand.toLowerCase().includes(query) || 
                   p.category.toLowerCase().includes(query);
        });

        currentSearchResults = results;
        applyFilters(); // This will also render the results

        document.getElementById("heroSection").classList.add("hidden");
        homeView.classList.add("hidden");
        resultsView.classList.remove("hidden");
        filtersBar.classList.remove("hidden");
        navHome.classList.remove("active");
        
        resultsTitle.textContent = isCategory ? `Category: ${query}` : `Results for "${query}"`;
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    window.searchByCategory = (cat) => performSearch(cat, true);

    function applyFilters() {
        let res = [...currentSearchResults];
        const platform = filterPlatform.value;
        const minP = parseFloat(filterMinPrice.value) || 0;
        const maxP = parseFloat(filterMaxPrice.value) || Infinity;
        const minRating = parseFloat(filterRating.value) || 0;
        const sort = sortBy.value;

        res = res.filter(p => {
            const validListings = p.listings.filter(l => {
                const platMatch = platform ? l.platform === platform : true;
                const priceMatch = l.price >= minP && l.price <= maxP;
                const ratingMatch = l.rating >= minRating;
                return platMatch && priceMatch && ratingMatch;
            });
            
            // Temporary store valid listings to render correct prices based on filter
            p.filteredListings = validListings;
            return validListings.length > 0;
        });

        // Re-assign lowestPriceListing based on filters
        res.forEach(p => {
            p.lowestPriceListing = [...p.filteredListings].sort((a,b)=>a.price-b.price)[0];
        });

        if (sort === "price_asc") res.sort((a, b) => a.lowestPriceListing.price - b.lowestPriceListing.price);
        else if (sort === "price_desc") res.sort((a, b) => b.lowestPriceListing.price - a.lowestPriceListing.price);
        else if (sort === "rating") res.sort((a, b) => b.highestRatingListing.rating - a.highestRatingListing.rating);
        else if (sort === "value") res.sort((a, b) => b.bestValueScore - a.bestValueScore);

        resultsCount.textContent = `Found ${res.length} products`;
        
        if (res.length === 0) {
            resultsGrid.innerHTML = "";
            noResults.classList.remove("hidden");
        } else {
            noResults.classList.add("hidden");
            renderProductGrid(res, resultsGrid);
        }
    }

    [searchBtn, heroSearchBtn].forEach(btn => {
        btn.addEventListener("click", () => {
            const q = btn.id === "searchBtn" ? searchInput.value : heroSearch.value;
            performSearch(q);
        });
    });

    [searchInput, heroSearch].forEach(input => {
        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") performSearch(input.value);
        });
    });

    tags.forEach(tag => {
        tag.addEventListener("click", () => performSearch(tag.dataset.q));
    });

    applyFiltersBtn.addEventListener("click", applyFilters);
    clearFiltersBtn.addEventListener("click", () => {
        filterPlatform.value = "";
        filterMinPrice.value = "";
        filterMaxPrice.value = "";
        filterRating.value = "0";
        sortBy.value = "relevance";
        applyFilters();
    });

    // ══════════ MODAL ══════════
    window.openProductModal = (id) => {
        const p = enrichedProducts.find(x => x.product_id === id);
        if (!p) return;

        const tagHtml = p.tags.map(t => `<span class="badge ${t.class}">${t.label}</span>`).join("");
        
        let analysisHtml = `
            <div class="ai-analysis">
                <h4>🧠 AI Smart Analysis: Why this product?</h4>
                <div class="ai-point"><div class="ai-dot"></div> Lowest price available on ${p.lowestPriceListing.platform} (₹${p.lowestPriceListing.price.toLocaleString()})</div>
                <div class="ai-point"><div class="ai-dot"></div> Highest rating on ${p.highestRatingListing.platform} (${p.highestRatingListing.rating} ⭐)</div>
                ${p.tags.find(t=>t.type==="value") ? `<div class="ai-point"><div class="ai-dot"></div> Highlighted as Best Value for Money by our engine.</div>` : ''}
            </div>
        `;

        let listingsHtml = p.listings.sort((a,b)=>a.price-b.price).map(l => {
            let pClass = "plt-custom";
            if(l.platform === "Amazon") pClass = "plt-amazon";
            if(l.platform === "Flipkart") pClass = "plt-flipkart";
            if(l.platform === "Meesho") pClass = "plt-meesho";

            const trustScore = calculateTrustScore(l.rating, l.review_count);
            const trustInfo = getTrustClassAndLabel(trustScore);
            
            const isBest = l === p.lowestPriceListing;

            return `
                <div class="listing-row ${isBest ? 'best-listing' : ''}">
                    <div class="lr-platform plt-tag ${pClass}">${l.platform}</div>
                    <div class="lr-price">₹${l.price.toLocaleString()}</div>
                    <div>
                        <span class="lr-orig">₹${l.original_price.toLocaleString()}</span>
                        <span class="lr-disc">(${l.discount_percentage}% off)</span>
                    </div>
                    <div class="lr-rating">⭐ ${l.rating} <span style="color:var(--text3);font-size:11px">(${l.review_count})</span></div>
                    <div class="lr-delivery">🚚 ${l.delivery_time}</div>
                    <div class="lr-seller">Sold by: ${l.seller_name}</div>
                    <div class="lr-trust ${trustInfo.class}">Trust: ${Math.round(trustScore)} (${trustInfo.label})</div>
                    ${isBest ? `<div class="best-deal-tag">Lowest Price</div>` : ''}
                </div>
            `;
        }).join("");

        modalContent.innerHTML = `
            <div class="modal-grid">
                <div class="modal-img-wrap"><img src="${p.image}" style="width:100%;height:100%;object-fit:cover;border-radius:20px;" alt="${p.product_name}"/></div>
                <div class="modal-info">
                    <div class="modal-brand">${p.brand}</div>
                    <div class="modal-title">${p.product_name}</div>
                    <div class="modal-badges">${tagHtml}</div>
                    <div class="modal-desc">${p.description}</div>
                    ${analysisHtml}
                    <div class="listings-section">
                        <h3>Available Listings</h3>
                        ${listingsHtml}
                    </div>
                </div>
            </div>
        `;
        modalOverlay.classList.remove("hidden");
    };

    modalClose.addEventListener("click", () => modalOverlay.classList.add("hidden"));
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) modalOverlay.classList.add("hidden");
    });

    // ══════════ COMPARE SYSTEM ══════════
    window.toggleCompare = (id, isChecked) => {
        if (isChecked) {
            if (compareList.length >= 4) {
                showToast("You can only compare up to 4 products.");
                // uncheck the checkbox visually
                event.target.checked = false;
                return;
            }
            const p = enrichedProducts.find(x => x.product_id === id);
            compareList.push(p);
            showToast("Added to compare");
        } else {
            compareList = compareList.filter(x => x.product_id !== id);
        }
        updateCompareTray();
    };

    window.removeFromCompare = (id) => {
        compareList = compareList.filter(x => x.product_id !== id);
        updateCompareTray();
        // Update checkboxes on UI
        document.querySelectorAll('.compare-checkbox').forEach(cb => {
            if (cb.closest('.product-card').innerHTML.includes(`'${id}'`)) {
                cb.checked = false;
            }
        });
    };

    function updateCompareTray() {
        if (compareList.length > 0) {
            compareTray.classList.remove("hidden");
            trayItems.innerHTML = compareList.map(p => `
                <div class="tray-item">
                    ${p.product_name.substring(0,15)}... 
                    <span class="tray-item-remove" onclick="removeFromCompare('${p.product_id}')">✕</span>
                </div>
            `).join("");
        } else {
            compareTray.classList.add("hidden");
        }
    }

    clearCompareBtn.addEventListener("click", () => {
        compareList = [];
        updateCompareTray();
        document.querySelectorAll('.compare-checkbox').forEach(cb => cb.checked = false);
    });

    openCompareBtn.addEventListener("click", () => {
        if (compareList.length < 2) {
            showToast("Please select at least 2 products to compare.");
            return;
        }
        renderComparePage();
        document.getElementById("heroSection").classList.add("hidden");
        homeView.classList.add("hidden");
        resultsView.classList.add("hidden");
        filtersBar.classList.add("hidden");
        compareTray.classList.add("hidden");
        comparePage.classList.remove("hidden");
        navCompare.classList.add("active");
        navHome.classList.remove("active");
    });

    backFromCompareBtn.addEventListener("click", () => {
        comparePage.classList.add("hidden");
        homeView.classList.remove("hidden");
        document.getElementById("heroSection").classList.remove("hidden");
        navHome.classList.add("active");
        navCompare.classList.remove("active");
        updateCompareTray();
    });

    function renderComparePage() {
        let thHtml = compareList.map(p => `<th><img src="${p.image}" style="width:80px;height:80px;border-radius:8px;object-fit:cover;margin-bottom:8px;display:block;"/><br>${p.product_name}</th>`).join("");
        
        let brandHtml = compareList.map(p => `<td>${p.brand}</td>`).join("");
        
        let priceHtml = compareList.map(p => {
            const isLowest = p.lowestPriceListing.price === Math.min(...compareList.map(x=>x.lowestPriceListing.price));
            return `<td class="${isLowest?'compare-best':''}">₹${p.lowestPriceListing.price.toLocaleString()} <br><span style="font-size:11px;color:var(--text3)">via ${p.lowestPriceListing.platform}</span></td>`;
        }).join("");

        let ratingHtml = compareList.map(p => {
            const isHighest = p.highestRatingListing.rating === Math.max(...compareList.map(x=>x.highestRatingListing.rating));
            return `<td class="${isHighest?'compare-best':''}">⭐ ${p.highestRatingListing.rating} <br><span style="font-size:11px;color:var(--text3)">(${p.highestRatingListing.review_count} reviews)</span></td>`;
        }).join("");

        let valueHtml = compareList.map(p => {
            const isBest = p.bestValueScore === Math.max(...compareList.map(x=>x.bestValueScore));
            return `<td class="${isBest?'compare-best':''}">${Math.round(p.bestValueScore)} Value Score</td>`;
        }).join("");

        let platformsHtml = compareList.map(p => {
            return `<td>${p.listings.map(l=>l.platform).join(", ")}</td>`;
        }).join("");

        compareContent.innerHTML = `
            <div class="compare-table">
                <table>
                    <thead>
                        <tr>
                            <th>Feature</th>
                            ${thHtml}
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>Brand</td>${brandHtml}</tr>
                        <tr><td>Lowest Price</td>${priceHtml}</tr>
                        <tr><td>Top Rating</td>${ratingHtml}</tr>
                        <tr><td>AI Value Score</td>${valueHtml}</tr>
                        <tr><td>Available On</td>${platformsHtml}</tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    // ══════════ PERSONALIZATION ══════════
    function checkPersonalization() {
        if (history.length > 0) {
            personalBar.classList.remove("hidden");
            const topTerm = history[0];
            personalMsg.innerHTML = `Based on your recent search for <b>"${topTerm}"</b>, we found deals you might like. <a href="#" style="color:var(--accent);text-decoration:underline" onclick="performSearch('${topTerm}')">View them here</a>.`;
        }
    }

    // ══════════ UTILS ══════════
    function showToast(msg) {
        toast.textContent = msg;
        toast.classList.remove("hidden");
        setTimeout(() => toast.classList.add("hidden"), 3000);
    }

    navHome.addEventListener("click", () => {
        document.getElementById("heroSection").classList.remove("hidden");
        homeView.classList.remove("hidden");
        resultsView.classList.add("hidden");
        filtersBar.classList.add("hidden");
        comparePage.classList.add("hidden");
        navHome.classList.add("active");
        navCompare.classList.remove("active");
        updateCompareTray();
    });

    init();
});
