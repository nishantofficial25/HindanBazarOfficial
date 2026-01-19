import { useState ,useEffect} from "react";
import {
  ChevronRight,
  // CATEGORY ICONS
  Timer,
  Smartphone,
  Shirt,
  Sofa,
  Tv,
  Bike
} from "lucide-react";

export default function Home() {

  const [isMobile, setIsMobile] = useState(false);
  
    useEffect(() => {
      const mq = window.matchMedia("(max-width: 768px)");
      const handleChange = (e) => setIsMobile(e.matches);
  
      setIsMobile(mq.matches);
      mq.addEventListener("change", handleChange);
      return () => mq.removeEventListener("change", handleChange);
    }, []);

  const styles = {
    heroSection: {
      background: "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)",
      padding: "80px 24px",
      textAlign: "center",
    },
    heroContainer: {
      maxWidth: "1200px",
      margin: "0 auto",
    },
    heroTitle: {
      fontSize: "56px",
      fontWeight: 800,
      color: "#1F2937",
      marginBottom: "16px",
      lineHeight: "1.2",
    },
    heroSubtitle: {
      fontSize: "28px",
      fontWeight: 600,
      color: "#2563EB",
      marginBottom: "24px",
    },
    heroCTA: {
      fontSize: "20px",
      color: "#4B5563",
      marginBottom: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "16px",
      flexWrap: "wrap",
    },
    ctaItem: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "12px 24px",
      backgroundColor: "white",
      borderRadius: "50px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      fontWeight: 600,
    },

    categoriesSection: {
      padding: "60px 24px",
      backgroundColor: "#F9FAFB",
    },

    productsSection: {
      padding: "80px 24px",
      backgroundColor: "white",
    },
    productsGrid: {
      maxWidth: "1200px",
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: "24px",
    },
    productCard: {
      backgroundColor: "white",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      cursor: "pointer",
    },
    productImage: {
      width: "100%",
      height: "220px",
      objectFit: "cover",
      backgroundColor: "#E5E7EB",
    },
    productInfo: {
      padding: "20px",
    },
    productTitle: {
      fontSize: "18px",
      fontWeight: 600,
      color: "#1F2937",
      marginBottom: "8px",
    },
    productPrice: {
      fontSize: "24px",
      fontWeight: 700,
      color: "#2563EB",
      marginBottom: "8px",
    },
    productLocation: {
      fontSize: "14px",
      color: "#6B7280",
      marginBottom: "12px",
    },
    favoriteButton: {
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "8px",
      borderRadius: "50%",
      transition: "background-color 0.3s ease",
    },
  };

  // ⭐ NEW CATEGORY ICONS USING LUCIDE
  const categories = [
    {
      name: "Mobiles",
      icon: <Smartphone size={40} />,
      href: "/category/mobiles",
    },
    {
      name: "Households",
      icon: <Shirt size={40} />,
      href: "/category/households",
    },
    {
      name: "Electronics",
      icon: <Tv size={40} />,
      href: "/category/electronics",
    },
    {
      name: "Furniture",
      icon: <Sofa size={40} />,
      href: "/category/furnitures",
    },
    {
      name: "Vehicles",
      icon: <Bike size={40} />,
      href: "/category/vehicles",
    },
  ];

  const products = [
    {
      title: "iPhone 14 Pro",
      price: "₹89,999",
      location: "Delhi",
      image: "#3B82F6",
    },
    {
      title: "Gaming Laptop",
      price: "₹75,000",
      location: "Mumbai",
      image: "#8B5CF6",
    },
    {
      title: "Royal Enfield",
      price: "₹1,50,000",
      location: "Bangalore",
      image: "#EF4444",
    },
    {
      title: "Designer Sofa",
      price: "₹35,000",
      location: "Pune",
      image: "#10B981",
    },
  ];

  return (
    <>
      <style>{`
        .categories-flex {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: flex-start;
    gap: 32px;
    overflow-x: auto;
    padding: 15px 0;
    scroll-behavior: smooth;
  }

  /* Visible Scrollbar */
  .categories-flex::-webkit-scrollbar {
    height: 8px;
  }
  .categories-flex::-webkit-scrollbar-track {
    background: #e5e7eb;
    border-radius: 10px;
  }
  .categories-flex::-webkit-scrollbar-thumb {
    background: #2563EB;
    border-radius: 10px;
  }

  .category-item {
    min-width: 80px;
    text-align: center;
    cursor: pointer;
    transition: transform .2s ease;
  }

  .category-item:hover {
    transform: scale(1.08);
  }

  .category-icon {
    margin-bottom: 6px;
  }
    
      `}</style>

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroContainer}>
          <h1 style={styles.heroTitle}>HindanBazar</h1>
          <h2 style={styles.heroSubtitle}>Hindan ka apna OLX</h2>

          <div style={styles.heroCTA}>
            <a
              href={`${import.meta.env.VITE_CLIENT_URL}/products`}
              style={{ color: "black" }}
            >
              <div style={styles.ctaItem}>
                <span>🛒</span>
                <span>Buy</span>
                <ChevronRight size={20} />
              </div>
            </a>

            <a
              href={`${import.meta.env.VITE_CLIENT_URL}/sell`}
              style={{ color: "black" }}
            >
              <div style={styles.ctaItem}>
                <span>🪙</span>
                <span>Sell</span>
                <ChevronRight size={20} />
              </div>
            </a>
            {!isMobile && <label className="orlabel">Or</label>}
            <a
              href={`${import.meta.env.VITE_CLIENT_URL}/restaurants`}
              style={{ color: "black" }}
            >
              <div style={styles.ctaItem}>
                <span>🍟</span>
                <span>Eat</span>
                <ChevronRight size={20} />
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ⭐ NEW CATEGORY SECTION */}
      <section style={styles.categoriesSection}>
        <h2 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "24px" }}>
          Browse Categories
        </h2>

        <div className="categories-flex">
          {categories.map((c, i) => (
            <a className="category-item" key={i} href={c.href}>
              <div className="category-icon" style={{ color: "#6391f4ff" }}>
                {c.icon}
              </div>
              <div>{c.name}</div>
            </a>
          ))}
        </div>
      </section>

      {/* Products Section */}
      {/* <section style={styles.productsSection}>
        <h2 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "24px" }}>
          Featured Products
        </h2>

        <div style={styles.productsGrid}>
          {products.map((product, index) => (
            <div key={index} style={styles.productCard}>
              <div
                style={{
                  ...styles.productImage,
                  backgroundColor: product.image,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "48px",
                    fontWeight: "700",
                  }}
                >
                  {product.title.charAt(0)}
                </div>
              </div>

              <div style={styles.productInfo}>
                <h3 style={styles.productTitle}>{product.title}</h3>
                <div style={styles.productPrice}>{product.price}</div>
                <div style={styles.productLocation}>📍 {product.location}</div>

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <Star size={16} color="#F59E0B" fill="#F59E0B" />
                    <span style={{ fontSize: "14px", color: "#6B7280" }}>
                      4.5
                    </span>
                  </div>

                  <button style={styles.favoriteButton}>
                    <Heart size={20} color="#EF4444" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section> */}
    </>
  );
}
