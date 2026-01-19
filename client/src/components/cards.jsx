import { useState, useEffect, useRef, useCallback } from "react";
import { MoreVertical } from "lucide-react";
import { Spinner } from "./loader";
import "../styles/loader.css";
import { useParams } from "react-router-dom";
import {  MapPin } from "lucide-react";

export default function Card(props) {
  const { id } = useParams();

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(3);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [openMenuId, setOpenMenuId] = useState(null);
  const fetching = useRef(false);
  const observer = useRef(null);
  const lastScroll = useRef(0);

  // Toast
  const [toastMessage, setToastMessage] = useState("");
  const notify = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2000);
  };

  /** ---------------------------------------------------------
   * FETCH DATA (limit+page applied correctly)
   * --------------------------------------------------------- */
  const fetchData = useCallback(async (pageNum, limitValue) => {
    if (fetching.current) return;

    fetching.current = true;
    setLoading(true);

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/products?page=${pageNum}&limit=${limitValue}`
      );

      const data = await response.json();

      const imageMap = {};
      data.images.forEach((img) => {
        if (!imageMap[img.productID]) imageMap[img.productID] = [];
        imageMap[img.productID].push(img);
      });

      const merged = data.details.map((p) => ({
        ...p,
        images: imageMap[p._id] || [],
      }));

      setProducts((prev) => {
        const ids = new Set(prev.map((x) => x._id));
        const fresh = merged.filter((p) => !ids.has(p._id));
        return [...prev, ...fresh];
      });

      setHasMore(data.hasMore);
    } catch (err) {
      console.error("Error fetching", err);
    } finally {
      setLoading(false);
      fetching.current = false;
    }
  }, []);

  /** ---------------------------------------------------------
   * INITIAL FETCH
   * --------------------------------------------------------- */
  useEffect(() => {
    fetchData(0, limit);
  }, [limit]);

  /** ---------------------------------------------------------
   * REFRESH FILTERED WHEN PRODUCTS CHANGE
   * --------------------------------------------------------- */
  useEffect(() => {
    let result = [...products];

    if (props.myprod) {
      const email = JSON.parse(localStorage.getItem("user"))?.userDetails
        ?.email;
      result = result.filter((p) => p.emails === email);
    }

    if (id) {
      result = result.filter(
        (p) => p.Category.toLowerCase() === id.toLowerCase()
      );
    }

    if (props.search) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(props.search.toLowerCase()) ||
          p.description.toLowerCase().includes(props.search.toLowerCase())
      );
    }

    setFiltered(result);
  }, [products, props.myprod, id, props.search]);

  /** ---------------------------------------------------------
   * DYNAMIC LIMIT (scroll speed)
   * --------------------------------------------------------- */
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      const speed = Math.abs(current - lastScroll.current);

      if (speed > 150) setLimit(12);
      else if (speed > 60) setLimit(8);
      else setLimit(4);

      lastScroll.current = current;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (window.innerHeight > 1200) setLimit(12);
    else if (window.innerHeight > 900) setLimit(8);
  }, []);

  /** ---------------------------------------------------------
   * INFINITE SCROLL OBSERVER
   * --------------------------------------------------------- */
  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !fetching.current) {
          setPage((prev) => {
            const nextPage = prev + 1;
            fetchData(nextPage, limit);
            return nextPage;
          });
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, limit]
  );

  /** ---------------------------------------------------------
   * DELETE
   * --------------------------------------------------------- */
  const deleteProduct = async (id) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/delete/${id}`,
        { method: "POST" }
      );
      if (!res.ok) throw new Error();

      notify("Deleted!");

      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      notify("Failed!");
    }
  };

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
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            backgroundColor: "red",
            color: "white",
            padding: 12,
            borderRadius: 8,
            zIndex: 9999,
          }}
        >
          {toastMessage}
        </div>
      )}

      <div className="products-area" style={{ paddingBottom: 100 }}>
        {filtered.length === 0 && !loading && (
          <div
            style={{
              textAlign: "center",
              padding: "40px 0",
              color: "#666",
            }}
          >
            🚫 No products found
          </div>
        )}
        {filtered.map((item, i) => {
          const firstImg = item.images?.[0] || null;

          return (
            <a
              href={`/products/${item._id}`}
              key={item._id}
              style={{ position: "relative", background: "white" }}
            >
              {/* ⋮ Menu */}

              {/* Menu Options */}
              {openMenuId === item._id && (
                <div
                  style={{
                    position: "absolute",
                    right: 10,
                    top: 45,
                    background: "white",
                    borderRadius: 8,
                    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                    zIndex: 30,
                  }}
                >
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.location.href = `/edit-product/${item._id}`;
                    }}
                    style={{ padding: 12, cursor: "pointer" }}
                  >
                    Edit
                  </div>
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      deleteProduct(item._id);
                    }}
                    style={{ padding: 12, cursor: "pointer", color: "red" }}
                  >
                    Delete
                  </div>
                </div>
              )}

              {/* Card */}
              <section style={{ margin: "1rem" }}></section>
              <div
                style={styles.productsGrid}
                className="products-grid-responsive"
              >
                <div
                  key={i}
                  style={styles.productCard}
                  className="product-card"
                >
                  <div
                    style={styles.productImage}
                    className="product-image-mobile"
                  >
                    <img
                      src={
                        firstImg
                          ? `${import.meta.env.VITE_SERVER_URL}/uploads/${
                              firstImg.filename
                            }`
                          : "/placeholder.png"
                      }
                      alt={item.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div
                    style={styles.productInfo}
                    className="product-info-mobile"
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: "12px",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <h3
                            style={styles.productTitle}
                            className="product-title-mobile"
                          >
                            {item.title}
                          </h3>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              marginBottom: "12px",
                            }}
                            className="product-rating-mobile"
                          >
                            <span
                              style={{ fontSize: "13px", color: "#6B7280" }}
                            >
                              {item.old} old
                            </span>
                          </div>
                          <div style={styles.productLocation}>
                            <MapPin size={16} />
                            <span>{item.owner.location}</span>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div
                            style={styles.productPrice}
                            className="product-price-mobile"
                          >
                            ₹{item.price.toLocaleString("en-IN")}
                          </div>
                        </div>
                        {props.myprod && (
                          <div
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setOpenMenuId(
                                openMenuId === item._id ? null : item._id
                              );
                            }}
                            style={{
                              top: 10,
                              right: 10,
                              padding: 8,
                              background: "#ffffffff",
                              borderRadius: "50%",
                              zIndex: 20,
                              color: "black",
                            }}
                          >
                            <MoreVertical />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          );
        })}

        {/* Infinite Scroll Sentinel */}
        {hasMore && (
          <div ref={lastElementRef} style={{ height: 40, textAlign: "center" }}>
            <div className="container">
              <Spinner />
            </div>
          </div>
        )}

        {/* {loading && (
          <div className="container">
            <Spinner />
          </div>
        )} */}

        {!hasMore && filtered.length > 0 && (
          <div className="text-center py-8 text-gray-600">
            No more Products to Show!
          </div>
        )}
      </div>
    </>
  );
}