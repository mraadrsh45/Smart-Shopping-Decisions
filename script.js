# COMPARE.IO - AI-Powered Product Comparison Engine

COMPARE.IO is a massive, highly-responsive frontend single-page application built to simulate a smart, AI-driven product comparison tool. It aggregates thousands of simulated listings across platforms like Amazon, Flipkart, and Meesho to help users find the absolute best deals, highlight overpriced items, and rank sellers by trust.

## Core Features

1. **Massive Generated Dataset:** 
   Features a Python-based data generator (`generate_data.py`) that produces 650+ realistic multi-category products (Smartphones, Laptops, Kitchen Appliances, etc.) mapped directly to real, high-quality Unsplash image URLs. This data is converted to JSON and stored directly into the browser's `localStorage` to ensure a lightning-fast offline experience.

2. **Fuzzy Logic Trust Scoring:**
   Implements a custom Mathematical Fuzzy Logic Inference System in JavaScript to analyze a seller's Rating alongside their Review Count to dynamically compute a 1-100 "Trust Score". Extremely high trust scores (80+) grant the product a "Highly Trusted" badge.

3. **Smart AI Analysis:**
   The comparison engine dynamically ranks listings by lowest price and highest rating, tagging them with custom badges: "Best Deal", "Budget Pick", or "Overpriced" depending on the statistical variance in the market. 

4. **Multi-Product Side-by-Side Comparison:**
   Users can select up to 4 items and view them in a dedicated comparison grid that clearly highlights the lowest price, the top rating, and the highest overall AI Value Score.

5. **Integrated Admin Dashboard:**
   Includes a full `/admin.html` portal mimicking a real backend system. Access it by logging in with `admin@smartcompare.com` / `admin123`. Allows you to Add, Edit, Delete, or Bulk Upload items to your database directly through the UI.

## Getting Started

Because the app is a pure front-end application leveraging `localStorage`, you can run it securely with a simple local server.

1. Open your terminal in the project directory.
2. Run the following command:
   ```bash
   python -m http.server 8000
   ```
3. Open your browser and navigate to `http://localhost:8000`.

## Directory Structure

* `index.html` - The main consumer-facing web application.
* `admin.html` - The backend management dashboard.
* `style.css` / `admin.css` - Custom clean, minimalist design systems (SHOP.CO light theme inspired).
* `app.js` / `admin.js` - The core application logic, including the Fuzzy Logic scoring engine.
* `generate_data.py` - The script responsible for creating `data.js`.
* `data.js` - Contains the 650+ generated product/listing objects injected into your browser's local storage.
