import React, { useState, useMemo } from "react";
import {
  Search,
  Pizza,
  Coffee,
  Sandwich,
  IceCream,
  Wine,
  MapPin,
  Phone,
} from "lucide-react";
import "./styles/urban.css";

const menuData = {
  "Veg Pizzas": {
    icon: Pizza,
    items: [
      { name: "Margherita", sizes: { Regular: 100, Medium: 200, Large: 360 } },
      {
        name: "Cheese & Onion",
        sizes: { Regular: 100, Medium: 200, Large: 360 },
      },
      {
        name: "Onion & Capsicum",
        sizes: { Regular: 140, Medium: 250, Large: 430 },
      },
      {
        name: "Cheese & Corn",
        sizes: { Regular: 140, Medium: 250, Large: 430 },
      },
      {
        name: "Cheese Tomato & Onion",
        sizes: { Regular: 140, Medium: 250, Large: 430 },
      },
      {
        name: "Double Cheese Pizza",
        sizes: { Regular: 170, Medium: 300, Large: 460 },
      },
      {
        name: "Spicy Supreme",
        sizes: { Regular: 170, Medium: 300, Large: 460 },
      },
      {
        name: "Spicy Triple Tango",
        sizes: { Regular: 170, Medium: 300, Large: 460 },
      },
      {
        name: "Mexican Wave Pizza",
        sizes: { Regular: 170, Medium: 300, Large: 460 },
      },
    ],
  },
  "Feast Pizza": {
    icon: Pizza,
    items: [
      {
        name: "Veggie Lover",
        sizes: { Regular: 185, Medium: 335, Large: 535 },
      },
      {
        name: "4 Mushroom Feast Pizza",
        sizes: { Regular: 185, Medium: 335, Large: 535 },
      },
      {
        name: "Tandoori Paneer",
        sizes: { Regular: 185, Medium: 335, Large: 535 },
      },
      {
        name: "Paneer Peppy Pizza",
        sizes: { Regular: 185, Medium: 335, Large: 535 },
      },
      {
        name: "Gourmet Pizza",
        sizes: { Regular: 185, Medium: 335, Large: 535 },
      },
    ],
  },
  "Exotica Pizza": {
    icon: Pizza,
    items: [
      { name: "Exotica", sizes: { Regular: 230, Medium: 400, Large: 600 } },
      {
        name: "Veggie Supreme",
        sizes: { Regular: 230, Medium: 400, Large: 600 },
      },
      {
        name: "Veg Extravaganza",
        sizes: { Regular: 230, Medium: 400, Large: 600 },
      },
    ],
  },
  "Pasta Pizza": {
    icon: Pizza,
    items: [
      { name: "Veg Jamaican Spicy", price: 165, additionalPrice: 310 },
      { name: "Mexican Pasta Pizza", price: 185, additionalPrice: 350 },
    ],
  },
  "Pizza Mania": {
    icon: Pizza,
    items: [
      { name: "Onion", price: 65 },
      { name: "Tomato", price: 65 },
      { name: "Capsicum", price: 75 },
      { name: "Corn", price: 75 },
      { name: "Paneer Onion", price: 95, category: "Double Topping" },
      { name: "Onion & Corn", price: 95, category: "Double Topping" },
      { name: "Corn & Tomato", price: 95, category: "Double Topping" },
      { name: "Onion & Capsicum", price: 95, category: "Double Topping" },
    ],
  },
  Pasta: {
    icon: Coffee,
    items: [
      { name: "White Sauce Pasta", price: 120 },
      { name: "Red Sauce Pasta", price: 120 },
      { name: "Makhani Sauce Pasta", price: 130 },
      { name: "Mixed Sauce Pasta", price: 140 },
    ],
  },
  Sandwich: {
    icon: Sandwich,
    items: [
      { name: "Plain Sandwich", price: 40 },
      { name: "Cheese Sandwich", price: 50, additionalPrice: 80 },
    ],
  },
  Sides: {
    icon: Coffee,
    items: [
      { name: "Garlic Bread Sticks", price: 80 },
      { name: "Stuffed Garlic Bread", price: 100 },
      { name: "Garlic Bread Spicy", price: 100 },
      { name: "Garlic Bread Supreme", price: 100 },
      { name: "Calzone Pocket", price: 100 },
      { name: "Veg Parcel", price: 35 },
      { name: "Grilled Mushroom", price: 80 },
      { name: "French Fries", price: 50, additionalPrice: 80 },
    ],
  },
  Burgers: {
    icon: Coffee,
    items: [
      { name: "Cheese & Onion", price: 40 },
      { name: "Aloo Crunchy Burger", price: 45 },
      { name: "Veggie Burger", price: 55 },
      { name: "Paneer Burger", price: 65 },
      { name: "Add. Cheese Slice", price: 20 },
    ],
  },
  Shakes: {
    icon: IceCream,
    items: [
      { name: "Blue Berry Shake", price: 70 },
      { name: "Mango Shake", price: 70 },
      { name: "Strawberry Shake", price: 80 },
      { name: "Oreo Shake", price: 80 },
      { name: "Kit kat Shake", price: 90 },
    ],
  },
  "Refreshing Drinks": {
    icon: Wine,
    items: [
      { name: "Ice Tea", price: 40 },
      { name: "Mint Mojito", price: 50 },
      { name: "Blue Curacao", price: 60 },
      { name: "Green Apple", price: 60 },
      { name: "Gold Coffee", price: 60 },
    ],
  },
  Dessert: {
    icon: IceCream,
    items: [{ name: "Choco Lava Cake", price: 80 }],
  },
};

function Urban() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", ...Object.keys(menuData)];

  const filteredItems = useMemo(() => {
    let items = [];

    if (selectedCategory === "All") {
      Object.entries(menuData).forEach(([category, data]) => {
        data.items.forEach((item) => {
          items.push({ ...item, category });
        });
      });
    } else {
      menuData[selectedCategory]?.items.forEach((item) => {
        items.push({ ...item, category: selectedCategory });
      });
    }

    if (searchQuery) {
      items = items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return items;
  }, [selectedCategory, searchQuery]);

  return (
    <>
      <style>{`
      /* Global Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* App Container */
.app-container {
  min-height: 100vh;
  background: linear-gradient(to bottom right, #eff6ff, #fae8ff, #fef2f2);
}

/* Header Styles */
.header {
  background: linear-gradient(to right, #1e3a8a, #6b21a8, #991b1b, #b91c1c);
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem;
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.brand-name {
  font-size: 1.5rem;
  font-weight: bold;
}

.tagline {
  font-size: 0.75rem;
  color: #dbeafe;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: white;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
}

.btn-location {
  color: #1e3a8a;
}

.btn-location:hover {
  background: #eff6ff;
}

.btn-call {
  color: #b91c1c;
}

.btn-call:hover {
  background: #fef2f2;
}

.btn-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Search Bar */
.search-container {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  width: 1.25rem;
  height: 1.25rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border-radius: 0.5rem;
  border: none;
  color: #111827;
  font-size: 1rem;
  outline: none;
}

.search-input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

.search-input::placeholder {
  color: #6b7280;
}

/* Category Filter */
.category-filter {
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 196px;
  z-index: 40;
}

.category-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem;
  overflow-x: auto;
}

.category-list {
  display: flex;
  gap: 0.5rem;
  min-width: max-content;
}

.category-btn {
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-weight: 500;
  white-space: nowrap;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  background: #f3f4f6;
  color: #374151;
}

.category-btn:hover {
  background: #e5e7eb;
}

.category-btn.active {
  background: linear-gradient(to right, #1e3a8a, #6b21a8, #b91c1c);
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Main Content */
.main-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.no-results {
  text-align: center;
  padding: 3rem 0;
}

.no-results p {
  color: #6b7280;
  font-size: 1.125rem;
}

/* Menu List */
.menu-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.menu-item {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  padding: 0.75rem;
  border: 1px solid #f3f4f6;
  transition: box-shadow 0.2s;
}

.menu-item:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.menu-item-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
}

.item-icon {
  background: #fef2f2;
  padding: 0.375rem;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

.item-icon .icon {
  width: 1rem;
  height: 1rem;
  color: #b91c1c;
}

.item-details {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-weight: 600;
  font-size: 0.875rem;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-category {
  font-size: 0.75rem;
  color: #1e3a8a;
}

/* Pricing */
.item-pricing {
  flex-shrink: 0;
}

.size-pricing {
  display: flex;
  gap: 0.5rem;
  font-size: 0.75rem;
}

.size-option {
  text-align: center;
}

.size-label {
  color: #6b7280;
  font-size: 0.625rem;
}

.size-price {
  font-weight: 600;
  color: #111827;
}

.single-price {
  text-align: right;
}

.price {
  font-weight: 600;
  color: #111827;
}

.additional-price {
  font-size: 0.75rem;
  color: #6b7280;
}

/* Footer */
.footer {
  background: linear-gradient(to right, #1e3a8a, #6b21a8, #991b1b, #b91c1c);
  color: white;
  padding: 1.5rem 0;
  margin-top: 3rem;
}

.footer-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
}

.copyright {
  color: #f3f4f6;
}

.footer-tagline {
  font-size: 0.875rem;
  color: #dbeafe;
  margin-top: 0.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .brand-name {
    font-size: 1.25rem;
  }
  
  .logo {
    width: 2.5rem;
    height: 2.5rem;
  }
  
  .category-filter {
    top: 188px;
  }
}

@media (max-width: 480px) {
  .header-content {
    padding: 0.75rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
      `}</style>
      <div className="app-container">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <div className="header-top">
              <div className="logo-section">
                <img
                  src="https://scontent.fdel74-1.fna.fbcdn.net/v/t39.30808-6/272934116_108183371839801_3887798230827438263_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=9KXc9L9xYYsQ7kNvgF_xTCt&_nc_zt=23&_nc_ht=scontent.fdel74-1.fna&_nc_gid=AFyLdKWb3MqYiJLhFFfOm2A&oh=00_AYB7aCGzUb5_xyXqe1i1Y0FvEz9_APOgGw3S1gZi8WTcFA&oe=677FE2F9"
                  alt="Urban Pizza Logo"
                  className="logo"
                />
                <div>
                  <h1 className="brand-name">Urban Pizza</h1>
                  <p className="tagline">Pizza, Pasta, Burger & More...</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button
                onClick={() => window.open("https://maps.google.com", "_blank")}
                className="btn btn-location"
              >
                <MapPin className="btn-icon" />
                Location
              </button>
              <button
                onClick={() => (window.location.href = "tel:+1234567890")}
                className="btn btn-call"
              >
                <Phone className="btn-icon" />
                Call Us
              </button>
            </div>

            {/* Search Bar */}
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </header>

        {/* Category Filter */}
        <div className="category-filter">
          <div className="category-content">
            <div className="category-list">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`category-btn ${
                    selectedCategory === category ? "active" : ""
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <main className="main-content">
          {filteredItems.length === 0 ? (
            <div className="no-results">
              <p>No items found matching your search.</p>
            </div>
          ) : (
            <div className="menu-list">
              {filteredItems.map((item, index) => {
                const Icon = menuData[item.category]?.icon || Pizza;

                return (
                  <div key={index} className="menu-item">
                    <div className="menu-item-content">
                      <div className="item-info">
                        <div className="item-icon">
                          <Icon className="icon" />
                        </div>
                        <div className="item-details">
                          <h3 className="item-name">{item.name}</h3>
                          <p className="item-category">{item.category}</p>
                        </div>
                      </div>

                      <div className="item-pricing">
                        {item.sizes ? (
                          <div className="size-pricing">
                            {Object.entries(item.sizes).map(([size, price]) => (
                              <div key={size} className="size-option">
                                <div className="size-label">
                                  {size.charAt(0)}
                                </div>
                                <div className="size-price">₹{price}</div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="single-price">
                            <span className="price">
                              ₹{item.price}
                              {item.additionalPrice && (
                                <span className="additional-price">
                                  {" "}
                                  / ₹{item.additionalPrice}
                                </span>
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <p className="copyright">
              © 2026 Urban Pizza. All rights reserved.
            </p>
            <p className="footer-tagline">Pizza, Pasta, Burger & More... 🍕</p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Urban;
