import React, { useState ,useEffect} from "react";
import { ChefHat, Phone, Search } from "lucide-react";
import { menuData } from "../MenuData/menu";
import "./styles/RestaurantMenu.css";

const RestaurantMenu = () => {
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

  const categories = [
    { id: "all", name: "All Items", color: "all" },
    { id: "veg", name: "VEG", color: "veg" },
    { id: "nonVeg", name: "NON-VEG", color: "non-veg" },
    { id: "roti", name: "ROTI", color: "roti" },
    { id: "rice", name: "RICE", color: "rice" },
  ];

  const restaurant = [
    {
      id: 1,
      name: "AWC",
      image:
        "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwcFwTiI3wNF1_v5uniW_gb40QRfYkio1-nkoL_IDgOpZ7rD10TzzaFXuDu0YODIOi7qL5tu0pou6PcQuJUFtJV6MFWfgVl_Sd1NaO9EaY--oohzshaTr2yyShEI6xhNkgZNvjY=s1360-w1360-h1020-rw",
      number: 9650950278,
    },
    {
      id: 2,
      name: "Hindan Veg",
      image:
        "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwcFwTiI3wNF1_v5uniW_gb40QRfYkio1-nkoL_IDgOpZ7rD10TzzaFXuDu0YODIOi7qL5tu0pou6PcQuJUFtJV6MFWfgVl_Sd1NaO9EaY--oohzshaTr2yyShEI6xhNkgZNvjY=s1360-w1360-h1020-rw",
      number: 9650950278,
    }
  ];

  const getFilteredItems = () => {
    let filteredData;

    // Filter by category
    if (activeCategory === "all") {
      filteredData = Object.entries(menuData).map(([category, items]) => ({
        category,
        items,
      }));
    } else {
      filteredData = [
        { category: activeCategory, items: menuData[activeCategory] },
      ];
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      filteredData = filteredData
        .map((section) => ({
          ...section,
          items: section.items.filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((section) => section.items.length > 0);
    }

    return filteredData;
  };

  const getCategoryTitle = (category) => {
    const titles = {
      veg: "VEG",
      nonVeg: "NON-VEG",
      roti: "ROTI",
      rice: "RICE",
    };
    return titles[category];
  };

  return (
    <div className="restaurant-menu">
      {/* Header */}
      <header className="menu-header">
        <div className="header-content">
          <div className="header-left">
            <ChefHat className="chef-icon" />
            <div>
              <h1 className="restaurant-title">AWC Menu</h1>
              <p className="restaurant-tagline">Hindan eats!</p>
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
                <div>+91-9650950278</div>
                <div>+91-9650950261</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {isMobile && (
        <div className="category-filter ">
          <div className="filter-buttons">
            <a
              href="tel:+919650950278"
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
          {categories.map((cat) => (
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
                        <span className="item-price">{item.price}</span>
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
            Marriage • Kitty Parties • Birthday • Family Social • Ruction
            Function & Other Events
          </p>
          <div className="footer-contact">
            <Phone className="footer-phone-icon" />
            <div className="footer-phone-numbers">
              +91-965-095-0278 | +91-965-095-0261
            </div>
          </div>
          <p className="footer-tagline">
            We are not here to make money, our motive is to provide quality food
            to defence personnel at cheapest rate.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RestaurantMenu;
