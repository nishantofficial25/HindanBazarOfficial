import React, { useState } from "react";
import { ChefHat, Phone, Search, MapPin, Star ,Clock} from "lucide-react";
import { menuData } from "../MenuData/menu";
import { restaurants } from "../MenuData/restaurantslist";
import "./styles/restaurants.css";

const RestaurantsList = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter logic
  const getFilteredContent = () => {
    // 1️⃣ No search → show restaurants
    if (searchQuery.trim() === "") {
      return { type: "restaurants", data: restaurants };
    }

    // 2️⃣ Flatten menuData into single array
    const allDishes = Object.entries(menuData).flatMap(([category, items]) =>
      items.map((item) => ({
        ...item,
        category,
      }))
    );

    // 3️⃣ Filter dishes by name
    const filteredDishes = allDishes.filter((dish) =>
      dish.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return {
      type: "dishes",
      data: filteredDishes,
    };
  };

  const filteredContent = getFilteredContent();

  const openmenu = (id) => {
    window.location.href = `/restaurants/${id}`;
  };

  return (
    <div className="restaurants-page">
      {/* Header */}
      <header className="page-header">
        <div className="header-content">
          <div className="header-left">
            <ChefHat className="chef-icon" />
            <div>
              <h1 className="page-title">Hindan Eats!</h1>
              <p className="page-tagline">
                Find the best dining experience near you
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="header-search">
            <div className="search-box">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search restaurants or dishes..."
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
            <div className="header-badge">
              {filteredContent.type === "restaurants"
                ? restaurants.length
                : filteredContent.data.length}{" "}
              {filteredContent.type === "restaurants"
                ? "Restaurants"
                : "Dishes"}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-container">
          {/* Results Header */}
          <div className="results-header">
            <h2 className="results-title">
              {filteredContent.type === "restaurants"
                ? "All Restaurants"
                : `Search Results for "${searchQuery}"`}
            </h2>
            <p className="results-count">
              Showing {filteredContent.data.length}{" "}
              {filteredContent.type === "restaurants"
                ? "restaurants"
                : "dishes"}
            </p>
          </div>

          {/* Content Grid */}
          {filteredContent.data.length > 0 ? (
            filteredContent.type === "restaurants" ? (
              <div className="content-grid">
                {/* Restaurant Cards */}
                {filteredContent.data.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className="restaurant-card"
                    onClick={() => openmenu(restaurant.id)}
                  >
                    <div className="card-image-container">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="card-image"
                      />
                      <div className="rating-badge">
                        <Star className="star-icon" />
                        {restaurant.rating}
                      </div>
                    </div>
                    <div className="card-content">
                      <h3 className="restaurant-name">{restaurant.name}</h3>

                      <div className="restaurant-info">
                        <div className="info-item">
                          <MapPin className="info-icon" />
                          <span>{restaurant.location}</span>
                        </div>

                        <div className="info-item">
                          <span className="cuisine-tag">
                            {restaurant.cuisine}
                          </span>
                        </div>

                        <div className="info-item">
                          <Phone className="info-icon" />
                          <span>{restaurant.phone}</span>
                        </div>

                        <div className="info-item">
                          <Clock className="info-icon" />
                          <span>{restaurant.openTime}</span>
                        </div>
                      </div>

                      <button className="view-menu-btn">View Menu</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="dishes-list">
                {/* Dish Items */}
                {filteredContent.data.map((dish) => (
                  <div key={dish.id} className="dish-item">
                    <div className="dish-item-content">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="dish-item-image"
                      />
                      <div className="dish-main-info">
                        <div className="dish-name-section">
                          <span className="dish-star">★</span>
                          <span className="dish-name">{dish.name}</span>
                        </div>
                        <div className="dish-restaurant-info">
                          <ChefHat className="mini-chef-icon" />
                          <span className="restaurant-name">
                            {
                              restaurants.find(
                                (r) => r.id === dish.RestaurantsListid
                              )?.name
                            }
                          </span>
                          <br />
                          <span>
                            <MapPin className="info-icon" />
                          </span>
                          <span className="restaurant-name">
                            {
                              restaurants.find(
                                (r) => r.id === dish.RestaurantsListid
                              )?.location
                            }
                          </span>
                        </div>
                      </div>
                      <div className="dish-pricing">
                        {dish.quantity ? (
                          Object.keys(dish.quantity).length > 0 &&
                          Object.entries(dish.quantity).map(([key, value]) => (
                            <div className="price-row" key={key}>
                              <span className="price-label">{key}</span>
                              <span className="price-value">{value}</span>
                            </div>
                          ))
                        ) : (
                          <div className="price-item">
                            <span className="item-price">₹{dish.price}</span>
                          </div>
                        )}
                      </div>
                      <a
                        href={`tel:${
                          restaurants
                            .find((res) => res.id == dish.RestaurantsListid)
                            .phone.split(",")[0]
                        }`}
                        className="dish-call-btn"
                      >
                        <Phone className="call-icon" />
                        Call
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <p className="no-results-text">
                No dishes found matching "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="reset-button"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="page-footer">
        <div className="footer-content">
          <p className="footer-text">Partner with us</p>
          <p className="footer-copyright">
            <Phone className="info-icon" style={{ color: "white" }} />
            <span>+91-882597108</span>
          </p>
          <p className="footer-text">
            We help restaurants reach more customers and grow their business
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RestaurantsList;
