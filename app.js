<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Admin - SmartCompare</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="admin.css"/>
</head>
<body>

<!-- ═══════════════ LOGIN SCREEN ═══════════════ -->
<div class="login-screen" id="loginScreen">
  <div class="login-card">
    <div class="login-logo">
      <span class="l-icon">⚙️</span>
      <h1>Admin Portal</h1>
      <p>Manage SmartCompare Data</p>
    </div>
    <form id="loginForm">
      <div class="form-group">
        <label>Email Address</label>
        <input type="email" id="loginEmail" class="form-input" placeholder="admin@smartcompare.com" required value="admin@smartcompare.com"/>
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" id="loginPass" class="form-input" placeholder="••••••••" required value="admin123"/>
      </div>
      <button type="submit" class="login-btn">Login to Dashboard</button>
      <div class="login-error hidden" id="loginError">Invalid credentials. Use admin@smartcompare.com / admin123</div>
    </form>
  </div>
</div>

<!-- ═══════════════ ADMIN LAYOUT ═══════════════ -->
<div class="admin-layout hidden" id="adminLayout">
  <!-- SIDEBAR -->
  <aside class="sidebar">
    <div class="sidebar-logo">
      <div style="display:flex;align-items:center;gap:8px;">
        <span class="sl-icon">⚡</span>
        <span class="sl-text">SmartCompare</span>
      </div>
      <div class="sl-sub">Admin Dashboard</div>
    </div>
    <div class="nav-item active" data-target="dashboard">
      <span class="ni-icon">📊</span> Dashboard
    </div>
    <div class="nav-sep"></div>
    <div class="nav-item" data-target="products">
      <span class="ni-icon">📦</span> Manage Products
    </div>
    <div class="nav-item" data-target="add-product">
      <span class="ni-icon">➕</span> Add Product
    </div>
    <div class="nav-sep"></div>
    <div class="nav-item" data-target="listings">
      <span class="ni-icon">🏷️</span> Manage Listings
    </div>
    <div class="nav-item" data-target="add-listing">
      <span class="ni-icon">💵</span> Add Listing
    </div>
    <div class="nav-sep"></div>
    <div class="nav-item" data-target="bulk">
      <span class="ni-icon">📂</span> Bulk Upload
    </div>
    
    <div class="sidebar-footer">
      <button class="logout-btn" id="logoutBtn">Logout</button>
    </div>
  </aside>

  <!-- CONTENT -->
  <main class="admin-content">
    <div class="admin-topbar">
      <div class="at-title" id="topbarTitle">Dashboard</div>
      <div class="at-user">
        <div class="at-avatar">A</div>
        <span>Admin User</span>
      </div>
    </div>

    <!-- DASHBOARD -->
    <div class="admin-page active" id="page-dashboard">
      <div class="section-title">System Overview</div>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-val" id="statProducts">0</div>
          <div class="stat-label">Total Products</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🏷️</div>
          <div class="stat-val" id="statListings">0</div>
          <div class="stat-label">Total Listings</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🛒</div>
          <div class="stat-val">3</div>
          <div class="stat-label">Platforms Tracked</div>
        </div>
      </div>
      <div class="form-card" style="margin-bottom:20px;">
        <h3>Quick Actions</h3>
        <div style="display:flex;gap:10px;">
          <button class="submit-btn" onclick="document.querySelector('[data-target=add-product]').click()">+ New Product</button>
          <button class="submit-btn" style="background:var(--bg3);color:var(--text);border:1px solid var(--border);" onclick="document.querySelector('[data-target=add-listing]').click()">+ New Listing</button>
          <button class="submit-btn" style="background:var(--bg3);color:var(--text);border:1px solid var(--border);" onclick="window.location.href='index.html'">View Website</button>
        </div>
      </div>
    </div>

    <!-- MANAGE PRODUCTS -->
    <div class="admin-page" id="page-products">
      <div class="section-title">Manage Products (Main Catalog)</div>
      <div class="admin-table-wrap">
        <div class="table-header">
          <h3>All Products</h3>
          <input type="text" class="search-tbl" id="searchProducts" placeholder="Search products..."/>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="productsTbody"></tbody>
        </table>
        <div class="paginator" id="productsPaginator"></div>
      </div>
    </div>

    <!-- ADD PRODUCT -->
    <div class="admin-page" id="page-add-product">
      <div class="section-title">Add New Main Product</div>
      <div class="form-card">
        <form id="addProductForm">
          <div class="form-row">
            <div class="form-group">
              <label>Product Name</label>
              <input type="text" id="pName" class="form-input" required placeholder="e.g. iPhone 15 Pro Max"/>
            </div>
            <div class="form-group">
              <label>Brand</label>
              <input type="text" id="pBrand" class="form-input" required placeholder="e.g. Apple"/>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Category</label>
              <select id="pCategory" class="form-select" required>
                <option value="Smartphones">Smartphones</option>
                <option value="Laptops">Laptops</option>
                <option value="Kitchen Appliances">Kitchen Appliances</option>
                <option value="Shoes">Shoes</option>
                <option value="Televisions">Televisions</option>
                <option value="Audio">Audio</option>
                <option value="Watches">Watches</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="form-group">
              <label>Image Emoji / URL</label>
              <input type="text" id="pImage" class="form-input" required placeholder="📱"/>
            </div>
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea id="pDesc" class="form-textarea" required placeholder="Product details..."></textarea>
          </div>
          <div class="form-btns">
            <button type="submit" class="submit-btn">Save Product</button>
            <button type="button" class="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- MANAGE LISTINGS -->
    <div class="admin-page" id="page-listings">
      <div class="section-title">Manage Listings (Prices & Shops)</div>
      <div class="admin-table-wrap">
        <div class="table-header">
          <h3>All Listings</h3>
          <input type="text" class="search-tbl" id="searchListings" placeholder="Search by Product ID or Platform..."/>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>List ID</th>
              <th>Prod ID</th>
              <th>Platform</th>
              <th>Price (₹)</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="listingsTbody"></tbody>
        </table>
        <div class="paginator" id="listingsPaginator"></div>
      </div>
    </div>

    <!-- ADD LISTING -->
    <div class="admin-page" id="page-add-listing">
      <div class="section-title">Add Listing to Product</div>
      <div class="form-card">
        <form id="addListingForm">
          <div class="form-row">
            <div class="form-group">
              <label>Select Product</label>
              <select id="lProduct" class="form-select" required></select>
            </div>
            <div class="form-group">
              <label>Platform / Shop Name</label>
              <input type="text" id="lPlatform" class="form-input" required placeholder="e.g. Amazon, Custom Shop"/>
            </div>
          </div>
          <div class="form-row three">
            <div class="form-group">
              <label>Selling Price (₹)</label>
              <input type="number" id="lPrice" class="form-input" required/>
            </div>
            <div class="form-group">
              <label>Original Price (₹)</label>
              <input type="number" id="lOrig" class="form-input" required/>
            </div>
            <div class="form-group">
              <label>Discount %</label>
              <input type="number" id="lDisc" class="form-input" required/>
              <div class="form-hint">Auto-calculated if left blank</div>
            </div>
          </div>
          <div class="form-row three">
            <div class="form-group">
              <label>Rating (1-5)</label>
              <input type="number" step="0.1" max="5" min="1" id="lRating" class="form-input" required/>
            </div>
            <div class="form-group">
              <label>Review Count</label>
              <input type="number" id="lReviews" class="form-input" required/>
            </div>
            <div class="form-group">
              <label>Delivery Time</label>
              <input type="text" id="lDel" class="form-input" required placeholder="e.g. 2 days"/>
            </div>
          </div>
          <div class="form-group" style="width:32%">
            <label>Seller Name</label>
            <input type="text" id="lSeller" class="form-input" required placeholder="e.g. Appario Retail"/>
          </div>
          <div class="form-btns">
            <button type="submit" class="submit-btn">Save Listing</button>
            <button type="button" class="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- BULK UPLOAD -->
    <div class="admin-page" id="page-bulk">
      <div class="section-title">Bulk Upload Data</div>
      <div class="form-card">
        <p style="margin-bottom:20px;font-size:14px;color:var(--text2);">Upload a JSON array containing Products and their Listings.</p>
        <div class="upload-zone" id="uploadZone">
          <div class="upload-icon">📥</div>
          <h3>Click or Drag JSON File Here</h3>
          <p>Only .json files supported</p>
          <input type="file" id="fileInput" accept=".json" class="hidden"/>
        </div>
        <div id="uploadPreview" class="upload-preview hidden"></div>
        <div class="form-btns hidden" id="uploadBtns" style="margin-top:20px;">
          <button class="submit-btn" id="confirmUpload">Import Data</button>
          <button class="cancel-btn" id="cancelUpload">Cancel</button>
        </div>
      </div>
    </div>
  </main>
</div>

<div class="toast hidden" id="toast"></div>

<script src="data.js"></script>
<script src="admin.js"></script>
</body>
</html>
