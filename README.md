import json
import random
import math

categories = ["Smartphones", "Laptops", "Kitchen Appliances", "Shoes", "Televisions", "Audio", "Watches"]

brands = {
    "Smartphones": ["Apple", "Samsung", "OnePlus", "Xiaomi", "Realme", "Google", "Vivo", "Oppo"],
    "Laptops": ["Apple", "Dell", "HP", "Lenovo", "Asus", "Acer", "MSI"],
    "Kitchen Appliances": ["Philips", "Bajaj", "Prestige", "Bosch", "LG", "Samsung", "Panasonic"],
    "Shoes": ["Nike", "Adidas", "Puma", "Reebok", "Skechers", "Bata", "Woodland"],
    "Televisions": ["Samsung", "LG", "Sony", "TCL", "Vu", "Hisense", "OnePlus"],
    "Audio": ["Sony", "JBL", "Boat", "Sennheiser", "Apple", "Samsung", "Bose"],
    "Watches": ["Casio", "Titan", "Fossil", "Garmin", "Apple", "Samsung", "Amazfit"]
}

adjectives = ["Pro", "Max", "Ultra", "Plus", "Elite", "Lite", "Smart", "Classic", "Premium", "Essential"]

category_images = {
    "Smartphones": [
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1533228100845-08145b01de14?q=80&w=800&auto=format&fit=crop"
    ],
    "Laptops": [
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1531297172868-245bff229d00?q=80&w=800&auto=format&fit=crop"
    ],
    "Kitchen Appliances": [
        "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?q=80&w=800&auto=format&fit=crop"
    ],
    "Shoes": [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop"
    ],
    "Televisions": [
        "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1601944177325-f8867652837f?q=80&w=800&auto=format&fit=crop"
    ],
    "Audio": [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop"
    ],
    "Watches": [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=800&auto=format&fit=crop"
    ]
}

platforms = ["Amazon", "Flipkart", "Meesho"]

products = []
listings = []

product_id_counter = 1
listing_id_counter = 1

def generate_base_price(category):
    if category == "Smartphones": return random.randint(10000, 150000)
    elif category == "Laptops": return random.randint(30000, 250000)
    elif category == "Kitchen Appliances": return random.randint(1000, 20000)
    elif category == "Shoes": return random.randint(1500, 15000)
    elif category == "Televisions": return random.randint(15000, 200000)
    elif category == "Audio": return random.randint(1000, 30000)
    elif category == "Watches": return random.randint(2000, 50000)
    return random.randint(1000, 10000)

for i in range(650):
    category = random.choice(categories)
    brand = random.choice(brands[category])
    name = f"{brand} {random.choice(['X', 'Z', 'A', 'M', 'Series', 'Galaxy', 'Air', 'Blade', 'Sound', 'Vision', 'Run', 'Fit'])}{random.randint(1, 99)} {random.choice(adjectives)}"
    
    base_price = generate_base_price(category)
    
    product = {
        "product_id": f"P{product_id_counter:04d}",
        "product_name": name,
        "category": category,
        "brand": brand,
        "description": f"High quality {category.lower()} by {brand}. Features premium build and advanced technology.",
        "image": random.choice(category_images[category])
    }
    products.append(product)
    
    # Generate listings
    num_listings = random.randint(2, 4)
    selected_platforms = random.sample(platforms, num_listings) if num_listings <= len(platforms) else platforms + ["Reliance Digital"]
    
    for platform in selected_platforms:
        variation = random.uniform(0.9, 1.1)
        price = int(base_price * variation)
        original_price = int(price * random.uniform(1.1, 1.4))
        discount = int(((original_price - price) / original_price) * 100)
        
        rating = round(random.uniform(2.5, 5.0), 1)
        review_count = random.randint(100, 35000)
        
        listing = {
            "listing_id": f"L{listing_id_counter:05d}",
            "product_id": product["product_id"],
            "platform": platform,
            "price": price,
            "original_price": original_price,
            "discount_percentage": discount,
            "rating": rating,
            "review_count": review_count,
            "delivery_time": f"{random.randint(1, 7)} days",
            "seller_name": f"{brand} Authorized" if random.random() > 0.5 else f"SuperRetail {random.randint(1,99)}"
        }
        listings.append(listing)
        listing_id_counter += 1
        
    product_id_counter += 1

js_content = f"""// Auto-generated initial data
let rawProducts = {json.dumps(products)};
let rawListings = {json.dumps(listings)};

// Helper to initialize local storage
function initData() {{
    if (!localStorage.getItem('products')) {{
        localStorage.setItem('products', JSON.stringify(rawProducts));
    }}
    if (!localStorage.getItem('listings')) {{
        localStorage.setItem('listings', JSON.stringify(rawListings));
    }}
}}

// Initialize on load
initData();

function getProducts() {{
    return JSON.parse(localStorage.getItem('products')) || [];
}}

function getListings() {{
    return JSON.parse(localStorage.getItem('listings')) || [];
}}

function getListingsForProduct(productId) {{
    return getListings().filter(l => l.product_id === productId);
}}
"""

with open("c:/Users/luxma/Desktop/fuzzy project/smart-compare/data.js", "w", encoding="utf-8") as f:
    f.write(js_content)

print("data.js created successfully with 650 products.")
