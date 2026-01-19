import { useState, useEffect, useRef } from "react";
import "../styles/show.css";
import { SkeletonCard } from "./loader";
import "../styles/loader.css";
import { useParams } from "react-router-dom";
import Overview from "./overview";

function Show() {
  const { id } = useParams();

  const [data, setData] = useState([]);
  const [images, setImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔍 Zoom states
  const imageRef = useRef(null);
  const lensRef = useRef(null);
  const [bgPos, setBgPos] = useState("50% 50%");
  const [showModal, setShowModal] = useState(false);

  // -------------------------
  // Fetch Product
  // -------------------------
  useEffect(() => {
    const categories = [
      "vehicles",
      "electronics",
      "households",
      "furnitures",
      "mobiles",
    ];

    if (categories.includes(id?.toLowerCase())) {
      window.location.href = "/";
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/products/${id}`
        );

        if (!res.ok) throw new Error(`HTTP error ${res.status}`);

        const result = await res.json();

        setData(result.product || []);
        setImages(result.images || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // -------------------------
  // Lock scroll on modal
  // -------------------------
  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
  }, [showModal]);

  // -------------------------
  // Desktop lens zoom handlers
  // -------------------------
  const handleMouseMove = (e) => {
    const img = imageRef.current;
    if (!img) return;

    const rect = img.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setBgPos(`${x}% ${y}%`);
  };

  const handleMouseEnter = () => {
    if (lensRef.current) lensRef.current.style.opacity = 1;
  };

  const handleMouseLeave = () => {
    if (lensRef.current) lensRef.current.style.opacity = 0;
  };

  // -------------------------
  // Loading / Error
  // -------------------------
  if (loading) {
    return (
      <div className="app-container">
        <SkeletonCard />
      </div>
    );
  }

  if (error) return <p>Error: {error.message}</p>;
  if (!data.length) return <p>Product not found</p>;

  const activeImg = images[activeIndex];

  return (
    <>
      <div className="container">
        <div className="product-container">
          {/* -------------------------
              Image Gallery
          -------------------------- */}
          <div className="image-gallery">
            {/* Main Image */}
            <div
              className="main-image zoom-wrapper"
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => setShowModal(true)}
            >
              <img
                ref={imageRef}
                src={
                  activeImg
                    ? `${import.meta.env.VITE_SERVER_URL}/uploads/${
                        activeImg.filename
                      }`
                    : "/placeholder.png"
                }
                alt={data[0].title}
                className="zoom-base-image"
              />

              {/* Lens Zoom */}
              <div
                ref={lensRef}
                className="zoom-lens"
                style={{
                  backgroundImage: `url(${
                    activeImg
                      ? `${import.meta.env.VITE_SERVER_URL}/uploads/${
                          activeImg.filename
                        }`
                      : "/placeholder.png"
                  })`,
                  backgroundPosition: bgPos,
                }}
              />
            </div>

            {/* Thumbnails */}
            <div className="thumbnail-list" style={{ textAlign: "center",width:"100%" }}>
              {images.map((img, i) => (
                <div
                  key={i}
                  className={`thumbnail ${i === activeIndex ? "active" : ""}`}
                  onClick={() => setActiveIndex(i)}
                  style={{ margin: "0 auto" }}
                >
                  <img
                    src={`${import.meta.env.VITE_SERVER_URL}/uploads/${
                      img.filename
                    }`}
                    alt={`${data[0].title}-${i}`}
                    loading="lazy"
                    className="thumb-img"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* -------------------------
              Product Info
          -------------------------- */}
          <div className="product-info">
            <h1 className="product-title">{data[0].title}</h1>

            <div className="price-section">
              <span className="price">
                ₹{data[0].price.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="bought-info">
              <ul>
                {data[0].description?.split(",").map((item, index) => (
                  <li key={index}>{item.trim()}</li>
                ))}
                <li>{data[0].old} old</li>
              </ul>
            </div>

            <Overview data={data} />
          </div>
        </div>
      </div>

      {/* -------------------------
          Mobile Fullscreen Modal
      -------------------------- */}
      {showModal && (
        <div className="image-modal" onClick={() => setShowModal(false)}>
          <img
            src={
              activeImg
                ? `${import.meta.env.VITE_SERVER_URL}/uploads/${
                    activeImg.filename
                  }`
                : "/placeholder.png"
            }
            alt="fullscreen"
            className="modal-image"
          />
        </div>
      )}
    </>
  );
}

export default Show;
