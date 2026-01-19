import React, { useEffect, useState } from "react";
import { Phone, Search } from "lucide-react";
import "./styles/one.css";
import { menuData } from "../MenuData/menu";
import { restaurants } from "../MenuData/restaurantslist";
import { useParams } from "react-router-dom";

const HindanVegMenu = () => {
  const { id } = useParams();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
   
    useEffect(() => {
      const mq = window.matchMedia("(max-width: 768px)");
      const handleChange = (e) => setIsMobile(e.matches);
  
      setIsMobile(mq.matches);
      mq.addEventListener("change", handleChange);
      return () => mq.removeEventListener("change", handleChange);
    }, []);

  const selectedRestaurant = restaurants.find((res) => res.id == id);

  const getFilteredItems = () => {
    let filtered = [];

    if (activeCategory === "all") {
      filtered = Object.entries(menuData)
        .map(([category, items]) => ({
          category,
          items: items.filter((item) => item.RestaurantsListid == id),
        }))
        .filter((section) => section.items.length > 0);
    } else {
      filtered = [
        {
          category: activeCategory,
          items:
            menuData[activeCategory]?.filter(
              (item) => item.RestaurantsListid == id
            ) || [],
        },
      ];
    }

    if (searchQuery.trim()) {
      filtered = filtered
        .map((section) => ({
          ...section,
          items: section.items.filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((section) => section.items.length > 0);
    }

    return filtered;
  };


  const getCategoryTitle = (categoryId) => {
    const category = selectedRestaurant.categories.find(
      (cat) => cat.id === categoryId
    );
    return category?.name || "";
  };


  return (
    <div className="hindan-menu">
      {/* Header */}
      <header className="menu-header">
        <div className="header-content">
          <div className="header-left">
            <div className="hindan-logo">
              <div className="logo-circle">🍽️</div>
              <div className="logo-text">{selectedRestaurant.name}</div>
            </div>
            <div>
              <h1 className="restaurant-title">Hindan Eats!</h1>
              <p className="restaurant-tagline">
                Find the best dining experience near you
              </p>
            </div>
          </div>

          {/* Search Bar in Header */}
          <div className="header-search">
            <div className="search-box">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search for dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="clear-btn"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="header-right">
            <div className="contact-info">
              <Phone className="phone-icon" />
              <div>
                {selectedRestaurant.phone.split(",").map((numberString) => (
                  <div>{numberString.trim()}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {isMobile && (
        <div className="category-filter ">
          <div className="filter-buttons">
            <a
              href={`tel:${selectedRestaurant.phone.split(",")[0]}`}
              className="filter-btn"
              style={{
                border: "1px solid black",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <Phone className="phone-icon" />
              &nbsp;Call & place Your Order
            </a>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="category-filter">
        <div className="filter-buttons">
          {selectedRestaurant.categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`filter-btn ${cat.color} ${
                activeCategory === cat.id ? "active" : ""
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="menu-container">
        {getFilteredItems().length > 0 ? (
          getFilteredItems().map(({ category, items }) => (
            <div key={category} className="menu-section">
              <div className="section-header">
                <h2 className="section-title" style={{ color: "white" }}>
                  {getCategoryTitle(category)}
                </h2>
              </div>
              <div className="section-content">
                <div className="menu-grid">
                  {items.map((item, index) => (
                    <div key={index} className="menu-item">
                      <div className="item-content">
                        <div className="item-left">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="item-image"
                          />
                          <div className="item-info">
                            <span className="item-star">★</span>
                            <span className="item-name">{item.name}</span>
                          </div>
                        </div>
                        <div className="item-prices">
                          {item.quantity ? (
                            Object.keys(item.quantity).length > 0 &&
                            Object.entries(item.quantity).map(
                              ([key, value]) => (
                                <div className="price-item" key={key}>
                                  <span className="price-label">{key}</span>
                                  <span className="item-price">{value}</span>
                                </div>
                              )
                            )
                          ) : (
                            <div className="price-item">
                              <span className="item-price">₹{item.price}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p className="no-results-text">
              No items found matching "{searchQuery}"
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="reset-search-btn"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="menu-footer">
        <div className="footer-content">
          <p className="footer-heading">We arrange for:</p>
          <p className="footer-events">
            Marriage • Kitty Parties • Birthday • Family Social • Functions &
            Other Events
          </p>
          <div className="footer-contact">
            <Phone className="footer-phone-icon" />
            <div className="footer-phone-numbers">
              {selectedRestaurant.phone.split(",").map((numberString) => (
                <div>{numberString.trim()}</div>
              ))}
            </div>
          </div>
          <p className="footer-tagline">
            Authentic vegetarian cuisine with the finest ingredients
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HindanVegMenu;
