import React, { useState } from "react";
import Cards from "./cards";
import {
  X,
  SlidersHorizontal,
  ArrowUpDown,
} from "lucide-react";

export default function ProductsPage(props) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showMobileSort, setShowMobileSort] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const styles = {
    // Main Content
    mainContainer: {
      maxWidth: "1400px",
      padding: "24px",
    },
    contentWrapper: {
      display: "flex",
      gap: "24px",
      position: "relative",
    },

    // Mobile Filter Buttons
    mobileFilterBar: {
      display: "none",
      gap: "12px",
      marginBottom: "20px",
    },
    mobileFilterButton: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      padding: "12px 20px",
      backgroundColor: "#FFFFFF",
      border: "2px solid #E5E7EB",
      borderRadius: "12px",
      fontSize: "15px",
      fontWeight: 600,
      color: "#1F2937",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },

    // Sidebar (Desktop)
    sidebar: {
      width: "280px",
      flexShrink: 0,
      backgroundColor: "#FFFFFF",
      borderRadius: "16px",
      padding: "24px",
      height: "fit-content",
      position: "sticky",
      top: "90px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    },
    sidebarTitle: {
      fontSize: "20px",
      fontWeight: 700,
      color: "#1F2937",
      marginBottom: "24px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    filterSection: {
      marginBottom: "28px",
    },
    filterLabel: {
      fontSize: "15px",
      fontWeight: 600,
      color: "#4B5563",
      marginBottom: "12px",
      display: "block",
    },
    filterOption: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "10px 0",
      cursor: "pointer",
      transition: "color 0.2s ease",
    },
    checkbox: {
      width: "18px",
      height: "18px",
      cursor: "pointer",
      accentColor: "#2563EB",
    },
    radioButton: {
      width: "18px",
      height: "18px",
      cursor: "pointer",
      accentColor: "#2563EB",
    },

    // Products Area
    productsArea: {
      flex: 1,
      minWidth: 0,
    },
    productsHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "24px",
      flexWrap: "wrap",
      gap: "16px",
    },
    resultsCount: {
      fontSize: "18px",
      fontWeight: 600,
      color: "#1F2937",
    },
    sortDropdown: {
      padding: "10px 16px",
      border: "2px solid #E5E7EB",
      borderRadius: "12px",
      fontSize: "14px",
      fontWeight: 500,
      backgroundColor: "#FFFFFF",
      cursor: "pointer",
      outline: "none",
      color: "#4B5563",
    },
    productsGrid: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    productCard: {
      backgroundColor: "#FFFFFF",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      transition: "all 0.3s ease",
      cursor: "pointer",
      display: "flex",
      flexDirection: "row",
      gap: "20px",
      padding: "16px",
    },
    productImage: {
      width: "200px",
      height: "200px",
      flexShrink: 0,
      position: "relative",
      borderRadius: "12px",
      overflow: "hidden",
    },
    favoriteBtn: {
      position: "absolute",
      top: "12px",
      right: "12px",
      backgroundColor: "#FFFFFF",
      border: "none",
      borderRadius: "50%",
      width: "36px",
      height: "36px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      transition: "all 0.3s ease",
    },
    productInfo: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    productCategory: {
      fontSize: "12px",
      fontWeight: 600,
      color: "#2563EB",
      textTransform: "uppercase",
      marginBottom: "8px",
    },
    productTitle: {
      fontSize: "20px",
      fontWeight: 600,
      color: "#1F2937",
      marginBottom: "12px",
      lineHeight: "1.4",
    },
    productPrice: {
      fontSize: "28px",
      fontWeight: 700,
      color: "#2563EB",
      marginBottom: "12px",
    },
    productMeta: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontSize: "14px",
      color: "#6B7280",
      marginTop: "8px",
      paddingTop: "12px",
      borderTop: "1px solid #E5E7EB",
    },
    productDescription: {
      fontSize: "14px",
      color: "#6B7280",
      lineHeight: "1.6",
      marginBottom: "12px",
    },
    productSpecs: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      marginBottom: "12px",
    },
    specItem: {
      fontSize: "13px",
      color: "#4B5563",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    specBullet: {
      width: "4px",
      height: "4px",
      backgroundColor: "#6B7280",
      borderRadius: "50%",
    },
    productRating: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },

    // Mobile Modal
    mobileModal: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 2000,
      display: "flex",
      alignItems: "flex-end",
    },
    mobileModalContent: {
      backgroundColor: "#FFFFFF",
      borderTopLeftRadius: "24px",
      borderTopRightRadius: "24px",
      width: "100%",
      maxHeight: "80vh",
      overflowY: "auto",
      padding: "24px",
    },
    modalHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "24px",
    },
    modalTitle: {
      fontSize: "20px",
      fontWeight: 700,
      color: "#1F2937",
    },
    closeButton: {
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "8px",
    },
    applyButton: {
      width: "100%",
      padding: "14px",
      backgroundColor: "#2563EB",
      color: "white",
      border: "none",
      borderRadius: "12px",
      fontSize: "16px",
      fontWeight: 600,
      cursor: "pointer",
      marginTop: "20px",
    },
  };


  const FilterContent = () => (
    <>
      <div style={styles.filterSection}>
        <label style={styles.filterLabel}>Category</label>
        <div style={styles.filterOption}>
          <input
            type="radio"
            name="category"
            value="all"
            checked={selectedCategory === "all"}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={styles.radioButton}
          />
          <span>All Categories</span>
        </div>
        <div style={styles.filterOption}>
          <input
            type="radio"
            name="category"
            value="electronics"
            checked={selectedCategory === "electronics"}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={styles.radioButton}
          />
          <span>Electronics</span>
        </div>
        <div style={styles.filterOption}>
          <input
            type="radio"
            name="category"
            value="fashion"
            checked={selectedCategory === "fashion"}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={styles.radioButton}
          />
          <span>Fashion</span>
        </div>
        <div style={styles.filterOption}>
          <input
            type="radio"
            name="category"
            value="vehicles"
            checked={selectedCategory === "vehicles"}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={styles.radioButton}
          />
          <span>Vehicles</span>
        </div>
        <div style={styles.filterOption}>
          <input
            type="radio"
            name="category"
            value="home"
            checked={selectedCategory === "home"}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={styles.radioButton}
          />
          <span>Home & Living</span>
        </div>
      </div>

      <div style={styles.filterSection}>
        <label style={styles.filterLabel}>Price Range</label>
        <div style={styles.filterOption}>
          <input
            type="radio"
            name="price"
            value="all"
            checked={selectedPriceRange === "all"}
            onChange={(e) => setSelectedPriceRange(e.target.value)}
            style={styles.radioButton}
          />
          <span>All Prices</span>
        </div>
        <div style={styles.filterOption}>
          <input
            type="radio"
            name="price"
            value="0-10000"
            checked={selectedPriceRange === "0-10000"}
            onChange={(e) => setSelectedPriceRange(e.target.value)}
            style={styles.radioButton}
          />
          <span>Under ₹10,000</span>
        </div>
        <div style={styles.filterOption}>
          <input
            type="radio"
            name="price"
            value="10000-50000"
            checked={selectedPriceRange === "10000-50000"}
            onChange={(e) => setSelectedPriceRange(e.target.value)}
            style={styles.radioButton}
          />
          <span>₹10,000 - ₹50,000</span>
        </div>
        <div style={styles.filterOption}>
          <input
            type="radio"
            name="price"
            value="50000-100000"
            checked={selectedPriceRange === "50000-100000"}
            onChange={(e) => setSelectedPriceRange(e.target.value)}
            style={styles.radioButton}
          />
          <span>₹50,000 - ₹1,00,000</span>
        </div>
        <div style={styles.filterOption}>
          <input
            type="radio"
            name="price"
            value="100000+"
            checked={selectedPriceRange === "100000+"}
            onChange={(e) => setSelectedPriceRange(e.target.value)}
            style={styles.radioButton}
          />
          <span>Above ₹1,00,000</span>
        </div>
      </div>

      <div style={styles.filterSection}>
        <label style={styles.filterLabel}>Condition</label>
        <div style={styles.filterOption}>
          <input
            type="radio"
            name="condition"
            value="all"
            checked={selectedCondition === "all"}
            onChange={(e) => setSelectedCondition(e.target.value)}
            style={styles.radioButton}
          />
          <span>All</span>
        </div>
        <div style={styles.filterOption}>
          <input
            type="radio"
            name="condition"
            value="new"
            checked={selectedCondition === "new"}
            onChange={(e) => setSelectedCondition(e.target.value)}
            style={styles.radioButton}
          />
          <span>New</span>
        </div>
        <div style={styles.filterOption}>
          <input
            type="radio"
            name="condition"
            value="used"
            checked={selectedCondition === "used"}
            onChange={(e) => setSelectedCondition(e.target.value)}
            style={styles.radioButton}
          />
          <span>Used</span>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .logo-text-responsive { display: none !important; }
          .search-container-responsive { 
            order: 3 !important;
            flex: 1 1 100% !important;
            max-width: 100% !important;
          }
          .desktop-sidebar { display: none !important; }
          .mobile-filter-bar { display: flex !important; }
          .products-grid-responsive {
            display: flex !important;
            flex-direction: column !important;
            gap: 12px !important;
          }
          .product-card {
            flex-direction: column !important;
            padding: 0 !important;
            gap: 0 !important;
          }
          .product-image-mobile {
            width: 100% !important;
            height: 250px !important;
            border-radius: 0 !important;
          }
          .product-info-mobile {
            padding: 16px !important;
          }
          .product-title-mobile {
            font-size: 18px !important;
            margin-bottom: 12px !important;
          }
          .product-price-mobile {
            font-size: 24px !important;
            margin-bottom: 12px !important;
          }
          .product-specs {
            display: none !important;
          }
          .product-rating-mobile {
            display: none !important;
          }
          .product-original-price {
            display: none !important;
          }
          .compare-checkbox {
            display: none !important;
          }
          .product-meta-mobile {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
          }
        }
        @media (min-width: 769px) and (max-width: 968px) {
          .desktop-sidebar { display: none !important; }
          .mobile-filter-bar { display: flex !important; }
        }
        .search-button:hover { background-color: #1E40AF; }
        .user-avatar:hover { 
          transform: scale(1.05);
          border-color: #2563EB;
        }
        .icon-button:hover { background-color: #F3F4F6; }
        .mobile-filter-button:hover {
          border-color: #2563EB;
          background-color: #EEF2FF;
        }
        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }
        .favorite-btn:hover {
          background-color: #FEE2E2;
          transform: scale(1.1);
        }
        .filter-option:hover {
          color: #2563EB;
        }
        .apply-button:hover {
          background-color: #1E40AF;
        }
      `}</style>


      {/* Main Content */}
      <div style={styles.mainContainer}>
        {/* Mobile Filter Buttons */}
        <div style={styles.mobileFilterBar} className="mobile-filter-bar">
          <button
            style={styles.mobileFilterButton}
            className="mobile-filter-button"
            onClick={() => setShowMobileFilters(true)}
          >
            <SlidersHorizontal size={20} />
            <span>Filter</span>
          </button>
          <button
            style={styles.mobileFilterButton}
            className="mobile-filter-button"
            onClick={() => setShowMobileSort(true)}
          >
            <ArrowUpDown size={20} />
            <span>Sort</span>
          </button>
        </div>

        <div style={styles.contentWrapper}>
          {/* Desktop Sidebar */}
          <aside style={styles.sidebar} className="desktop-sidebar">
            <h3 style={styles.sidebarTitle}>
              <SlidersHorizontal size={22} />
              Filters
            </h3>
            <FilterContent />
          </aside>

          {/* Products Area */}
          <div style={styles.productsArea}>
            <div style={styles.productsHeader}>
              {/* <div style={styles.resultsCount}>
                {products.length} Products Found
              </div> */}
              <select
                style={styles.sortDropdown}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            <Cards search={props.search} ></Cards>

          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div
          style={styles.mobileModal}
          onClick={() => setShowMobileFilters(false)}
        >
          <div
            style={styles.mobileModalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Filters</h3>
              <button
                style={styles.closeButton}
                onClick={() => setShowMobileFilters(false)}
              >
                <X size={24} />
              </button>
            </div>
            <FilterContent />
            <button
              style={styles.applyButton}
              className="apply-button"
              onClick={() => setShowMobileFilters(false)}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Mobile Sort Modal */}
      {showMobileSort && (
        <div
          style={styles.mobileModal}
          onClick={() => setShowMobileSort(false)}
        >
          <div
            style={styles.mobileModalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Sort By</h3>
              <button
                style={styles.closeButton}
                onClick={() => setShowMobileSort(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div style={styles.filterSection}>
              <div style={styles.filterOption}>
                <input
                  type="radio"
                  name="sort"
                  value="newest"
                  checked={sortBy === "newest"}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={styles.radioButton}
                />
                <span>Newest First</span>
              </div>
              <div style={styles.filterOption}>
                <input
                  type="radio"
                  name="sort"
                  value="price-low"
                  checked={sortBy === "price-low"}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={styles.radioButton}
                />
                <span>Price: Low to High</span>
              </div>
              <div style={styles.filterOption}>
                <input
                  type="radio"
                  name="sort"
                  value="price-high"
                  checked={sortBy === "price-high"}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={styles.radioButton}
                />
                <span>Price: High to Low</span>
              </div>
              <div style={styles.filterOption}>
                <input
                  type="radio"
                  name="sort"
                  value="rating"
                  checked={sortBy === "rating"}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={styles.radioButton}
                />
                <span>Highest Rated</span>
              </div>
            </div>
            <button
              style={styles.applyButton}
              className="apply-button"
              onClick={() => setShowMobileSort(false)}
            >
              Apply Sort
            </button>
          </div>
        </div>
      )}
    </>
  );
}
