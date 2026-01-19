import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// ProductAgeInput Component
function ProductAgeInput({ value, onChange }) {
  const handleChange = (field, val) => {
    const numValue = parseInt(val) || 0;
    const newAge = { ...value, [field]: numValue };

    // Calculate total days
    const totalDays = newAge.years * 365 + newAge.months * 30 + newAge.days;
    newAge.totalDays = totalDays;

    onChange(newAge);
  };

  return (
    <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
      <label
        style={{ fontWeight: "bold", marginBottom: "0.5rem", display: "block" }}
      >
        Product Age
      </label>
      <div style={{ display: "flex", gap: "1rem" }}>
        <div style={{ flex: 1 }}>
          <input
            type="number"
            min="0"
            placeholder="Years"
            className="form-control"
            value={value.years}
            onChange={(e) => handleChange("years", e.target.value)}
          />
        </div>
        <div style={{ flex: 1 }}>
          <input
            type="number"
            min="0"
            max="11"
            placeholder="Months"
            className="form-control"
            value={value.months}
            onChange={(e) => handleChange("months", e.target.value)}
          />
        </div>
        <div style={{ flex: 1 }}>
          <input
            type="number"
            min="0"
            max="30"
            placeholder="Days"
            className="form-control"
            value={value.days}
            onChange={(e) => handleChange("days", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

function Edit() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [imgCount, setImgCount] = useState(0);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [img, setImg] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [existingImageIds, setExistingImageIds] = useState([]);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const notify = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    price: "",
    cat: "Misc",
    name: "",
    mob: "",
    location: "",
    old: "",
    email: "",
  });

  const [productAge, setProductAge] = useState({
    years: 0,
    months: 0,
    days: 0,
    totalDays: 0,
  });

  const [errors, setErrors] = useState({
    title: "",
    desc: "",
    price: "",
    cat: "",
    name: "",
    mob: "",
    location: "",
    img: "",
  });

  const [touched, setTouched] = useState({
    title: false,
    desc: false,
    price: false,
    cat: false,
    name: false,
    mob: false,
    location: false,
    img: false,
  });

  // Parse age string from database
  const parseAgeString = (ageString) => {
    if (!ageString || ageString === "Brand new") {
      return { years: 0, months: 0, days: 0, totalDays: 0 };
    }

    const years = ageString.match(/(\d+)\s*year/);
    const months = ageString.match(/(\d+)\s*month/);
    const days = ageString.match(/(\d+)\s*day/);

    const parsedYears = years ? parseInt(years[1]) : 0;
    const parsedMonths = months ? parseInt(months[1]) : 0;
    const parsedDays = days ? parseInt(days[1]) : 0;

    return {
      years: parsedYears,
      months: parsedMonths,
      days: parsedDays,
      totalDays: parsedYears * 365 + parsedMonths * 30 + parsedDays,
    };
  };

  // Fetch product data on component mount
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/products/${id}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const product = data.product[0];

        if (localStorage.getItem("user") === null) {
          setError(`Bad request! login first to edit a product.`);
          return;
        } else if (
          product.emails !=
          JSON.parse(localStorage.getItem("user")).userDetails.email
        ) {
          setError(
            `Bad request! Product doesn't belongs to user "${
              JSON.parse(localStorage.getItem("user")).userDetails.email
            }"`
          );
          return;
        }

        // Set form data from fetched product
        setFormData({
          title: product.title || "",
          desc: product.description || "",
          price: product.price?.toString() || "",
          cat: product.Category || "Misc",
          name: product.owner?.Username || "",
          mob: product.owner?.mob?.toString() || "",
          location: product.owner?.location || "",
          old: product.old || "",
          email: product.owner?.emails || "",
        });

        // Parse and set product age
        const parsedAge = parseAgeString(product.old);
        setProductAge(parsedAge);

        // Set existing images
        if (data.images && data.images.length > 0) {
          const imageUrls = data.images;
          const imageIds = data.images.map((img) => img.id);
          setExistingImages(imageUrls);
          setExistingImageIds(imageIds);
          setImgCount(data.images.length);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message);
        notify("Failed to load product data");
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  const handleAgeChange = (ageData) => {
    const parts = [];
    if (ageData.years > 0)
      parts.push(`${ageData.years} year${ageData.years > 1 ? "s" : ""}`);
    if (ageData.months > 0)
      parts.push(`${ageData.months} month${ageData.months > 1 ? "s" : ""}`);
    if (ageData.days > 0)
      parts.push(`${ageData.days} day${ageData.days > 1 ? "s" : ""}`);
    const finalAge = parts.join(", ") || "Brand new";

    setProductAge(ageData);
    setFormData((prevData) => ({
      ...prevData,
      old: finalAge,
    }));
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "title":
        if (!value.trim()) {
          error = "Title is required";
        } else if (value.length < 3) {
          error = "Title must be at least 3 characters";
        } else if (value.length > 100) {
          error = "Title must not exceed 100 characters";
        }
        break;

      case "desc":
        if (!value.trim()) {
          error = "Description is required";
        } else if (value.length < 10) {
          error = "Description must be at least 10 characters";
        } else if (value.length > 1000) {
          error = "Description must not exceed 1000 characters";
        }
        break;

      case "price":
        if (!value) {
          error = "Price is required";
        } else if (isNaN(value) || Number(value) <= 0) {
          error = "Price must be a positive number";
        } else if (Number(value) > 10000000) {
          error = "Price seems unreasonably high";
        }
        break;

      case "cat":
        if (!value || value === "Misc") {
          error = "Please select a category";
        }
        break;

      case "name":
        if (!value.trim()) {
          error = "Name is required";
        } else if (value.length < 2) {
          error = "Name must be at least 2 characters";
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = "Name should only contain letters";
        }
        break;

      case "mob":
        if (!value) {
          error = "Mobile number is required";
        } else if (!/^\d{10}$/.test(value)) {
          error = "Mobile number must be 10 digits";
        }
        break;

      case "location":
        if (!value.trim()) {
          error = "Location is required";
        } else if (value.length < 2) {
          error = "Location must be at least 2 characters";
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "price" || name === "mob") {
      const sanitizedValue = value.replace(/[eE+\-]/g, "");
      setFormData((prevData) => ({
        ...prevData,
        [name]: sanitizedValue,
      }));

      if (touched[name]) {
        const error = validateField(name, sanitizedValue);
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: error,
        }));
      }
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error,
      }));
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true,
    }));

    const error = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleImage = (e) => {
    const totalImages = existingImages.length + img.length;

    if (totalImages >= 5) {
      notify("You can upload a maximum of 5 images per Product!");
      return;
    }

    const file = e.target.files[0];
    if (file) {
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];

      if (!validTypes.includes(file.type)) {
        notify("Please upload a valid image file (JPEG, PNG, GIF, or WebP)");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        notify("Image size should not exceed 5MB");
        return;
      }

      setImg((prevFile) => [...prevFile, file]);
      setImgCount((prev) => prev + 1);
      setErrors((prevErrors) => ({
        ...prevErrors,
        img: "",
      }));
    }
  };

  const delImg = (itemToDel) => {
    const updatedImages = img.filter((task) => task !== itemToDel);
    setImg(updatedImages);
    setImgCount((prev) => prev - 1);
  };

  const delExistingImg = (index) => {
    const updatedImages = existingImages.filter((_, i) => i !== index);
    const updatedIds = existingImageIds.filter((_, i) => i !== index);
    setExistingImages(updatedImages);
    setExistingImageIds(updatedIds);
    setImgCount((prev) => prev - 1);
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      if (key !== "email" && key !== "old") {
        const error = validateField(key, formData[key]);
        if (error) {
          newErrors[key] = error;
          isValid = false;
        }
      }
    });

    const totalImages = existingImages.length + img.length;
    if (totalImages === 0) {
      newErrors.img = "At least one image is required";
      isValid = false;
    }

    setErrors(newErrors);

    const allTouched = {};
    Object.keys(touched).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    return isValid;
  };

  const updateProduct = async () => {
    try {
      const formDataToSend = new FormData();

      // Append new images
      img.forEach((item) => {
        formDataToSend.append("image", item);
      });

      // Append existing image IDs (not URLs)
      formDataToSend.append("existingImages", JSON.stringify(existingImageIds));

      // Append form data with proper field names matching database
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.desc);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("Category", formData.cat);
      formDataToSend.append("old", formData.old);
      formDataToSend.append("email", formData.email);

      // Owner details as individual fields (backend will handle)
      formDataToSend.append("name", formData.name);
      formDataToSend.append("mob", formData.mob);
      formDataToSend.append("location", formData.location);

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/edit/${id}`,
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Update failed");
      }

      notify("Product updated successfully!");
      navigate("/myProducts", { replace: true });
    } catch (error) {
      console.error("Update error:", error);
      notify("Failed to update product. Please try again.");
      setSubmitting(false);
      setIsOpen(false);
    }
  };

  const openModal = (event) => {
    event.preventDefault();

    if (validateForm()) {
      setIsOpen(true);
    } else {
      notify("Please fix all validation errors before submitting");
    }
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleYes = () => {
    setSubmitting(true);
    updateProduct();
  };

  const handleNo = () => {
    closeModal();
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: "#007bff",
                animation: `pulse 1.4s ease-in-out ${i * 0.16}s infinite`,
              }}
            />
          ))}
        </div>
        <style>{`
          @keyframes pulse {
            0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
            40% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          maxWidth: "600px",
          margin: "2rem auto",
          padding: "1rem",
          backgroundColor: "#f8d7da",
          color: "#721c24",
          borderRadius: "4px",
          textAlign: "center",
        }}
      >
        <h3>Error Loading Product Details</h3>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#721c24",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {showToast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: "#21ce32ff",
            color: "white",
            padding: "16px",
            borderRadius: "4px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            zIndex: 9999,
            maxWidth: "300px",
          }}
        >
          {toastMessage}
        </div>
      )}

      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={closeModal}
        >
          {submitting ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "200px",
              }}
            >
              <div
                style={{ display: "flex", gap: "8px", alignItems: "center" }}
              >
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#007bff",
                      animation: `pulse 1.4s ease-in-out ${i * 0.16}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: "white",
                padding: "2rem",
                borderRadius: "8px",
                maxWidth: "500px",
                textAlign: "center",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  backgroundColor: "#e3f2fd",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                }}
              >
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1976d2"
                  strokeWidth="2"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>

              <h2 style={{ marginBottom: "1rem", fontSize: "1.5rem" }}>
                Update Product?
              </h2>

              <div
                style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}
              >
                <button
                  onClick={handleNo}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  No
                </button>
                <button
                  onClick={handleYes}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  Yes
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "1rem" }}>
        <h2 style={{ textAlign: "center", fontWeight: "bold", margin: "1rem" }}>
          EDIT YOUR PRODUCT
        </h2>
        <form onSubmit={openModal}>
          <h3 style={{ fontWeight: "bold", marginTop: "1.5rem" }}>
            PRODUCT DETAILS
          </h3>

          <div style={{ marginTop: "1rem" }}>
            <input
              name="title"
              placeholder="Title*"
              type="text"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: `1px solid ${
                  touched.title && errors.title ? "#dc3545" : "#ddd"
                }`,
                borderRadius: "4px",
                fontSize: "1rem",
              }}
              value={formData.title}
              onChange={handleInputChange}
              onBlur={handleBlur}
              required
            />
            {touched.title && errors.title && (
              <div
                style={{
                  color: "#dc3545",
                  fontSize: "0.875rem",
                  marginTop: "0.25rem",
                }}
              >
                {errors.title}
              </div>
            )}
          </div>

          <div style={{ marginTop: "1rem" }}>
            <textarea
              name="desc"
              placeholder="Description*"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: `1px solid ${
                  touched.desc && errors.desc ? "#dc3545" : "#ddd"
                }`,
                borderRadius: "4px",
                fontSize: "1rem",
                minHeight: "100px",
              }}
              value={formData.desc}
              onChange={handleInputChange}
              onBlur={handleBlur}
              required
            />
            {touched.desc && errors.desc && (
              <div
                style={{
                  color: "#dc3545",
                  fontSize: "0.875rem",
                  marginTop: "0.25rem",
                }}
              >
                {errors.desc}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <div style={{ flex: 1 }}>
              <input
                name="price"
                placeholder="Price*"
                type="number"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: `1px solid ${
                    touched.price && errors.price ? "#dc3545" : "#ddd"
                  }`,
                  borderRadius: "4px",
                  fontSize: "1rem",
                }}
                value={formData.price}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
              />
              {touched.price && errors.price && (
                <div
                  style={{
                    color: "#dc3545",
                    fontSize: "0.875rem",
                    marginTop: "0.25rem",
                  }}
                >
                  {errors.price}
                </div>
              )}
            </div>

            <div style={{ flex: 1 }}>
              <select
                name="cat"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: `1px solid ${
                    touched.cat && errors.cat ? "#dc3545" : "#ddd"
                  }`,
                  borderRadius: "4px",
                  fontSize: "1rem",
                }}
                value={formData.cat}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
              >
                <option value="Misc">Category*</option>
                <option value="Furnitures">Furniture</option>
                <option value="Electronics">Electronics</option>
                <option value="Households">Households</option>
                <option value="Vehicles">Vehicle</option>
                <option value="Mobiles">Mobiles & Tablets</option>
              </select>
              {touched.cat && errors.cat && (
                <div
                  style={{
                    color: "#dc3545",
                    fontSize: "0.875rem",
                    marginTop: "0.25rem",
                  }}
                >
                  {errors.cat}
                </div>
              )}
            </div>
          </div>

          <ProductAgeInput value={productAge} onChange={handleAgeChange} />

          <div style={{ marginTop: "1.5rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <h4>UPLOAD UP TO 5 PHOTOS</h4>
              <h4>{imgCount}/5</h4>
              <input
                type="file"
                accept="image/*"
                id="img1"
                style={{ display: "none" }}
                onChange={handleImage}
              />
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
              {existingImages.map((imgUrl, index) => (
                <div
                  key={`existing-${index}`}
                  style={{
                    position: "relative",
                    width: "100px",
                    height: "100px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={`data:${imgUrl.type};base64,${imgUrl.data}`}
                    alt="Product"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <span
                    onClick={() => delExistingImg(index)}
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      backgroundColor: "red",
                      color: "white",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      fontSize: "12px",
                    }}
                  >
                    X
                  </span>
                </div>
              ))}

              {img.map((item, index) => (
                <div
                  key={`new-${index}`}
                  style={{
                    position: "relative",
                    width: "100px",
                    height: "100px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={URL.createObjectURL(item)}
                    alt="Product"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <span
                    onClick={() => delImg(item)}
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      backgroundColor: "red",
                      color: "white",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      fontSize: "12px",
                    }}
                  >
                    X
                  </span>
                </div>
              ))}

              {imgCount < 5 && (
                <label
                  htmlFor="img1"
                  style={{
                    width: "100px",
                    height: "100px",
                    border: "2px dashed #ddd",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "2rem",
                    color: "#999",
                  }}
                >
                  +
                </label>
              )}
            </div>
            {touched.img && errors.img && (
              <div
                style={{
                  color: "#dc3545",
                  fontSize: "0.875rem",
                  marginTop: "0.5rem",
                }}
              >
                {errors.img}
              </div>
            )}
          </div>

          <hr style={{ margin: "2rem 0" }} />

          <h3 style={{ fontWeight: "bold" }}>OWNER'S DETAILS</h3>

          <div style={{ marginTop: "1rem" }}>
            <input
              name="name"
              placeholder="Enter your Name*"
              type="text"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: `1px solid ${
                  touched.name && errors.name ? "#dc3545" : "#ddd"
                }`,
                borderRadius: "4px",
                fontSize: "1rem",
              }}
              value={formData.name}
              onChange={handleInputChange}
              onBlur={handleBlur}
              required
            />
            {touched.name && errors.name && (
              <div
                style={{
                  color: "#dc3545",
                  fontSize: "0.875rem",
                  marginTop: "0.25rem",
                }}
              >
                {errors.name}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <div style={{ flex: 1 }}>
              <input
                name="mob"
                placeholder="Mobile Number*"
                type="number"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: `1px solid ${
                    touched.mob && errors.mob ? "#dc3545" : "#ddd"
                  }`,
                  borderRadius: "4px",
                  fontSize: "1rem",
                }}
                value={formData.mob}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
              />
              {touched.mob && errors.mob && (
                <div
                  style={{
                    color: "#dc3545",
                    fontSize: "0.875rem",
                    marginTop: "0.25rem",
                  }}
                >
                  {errors.mob}
                </div>
              )}
            </div>

            <div style={{ flex: 1 }}>
              <input
                name="location"
                placeholder="Location*"
                type="text"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: `1px solid ${
                    touched.location && errors.location ? "#dc3545" : "#ddd"
                  }`,
                  borderRadius: "4px",
                  fontSize: "1rem",
                }}
                value={formData.location}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
              />
              {touched.location && errors.location && (
                <div
                  style={{
                    color: "#dc3545",
                    fontSize: "0.875rem",
                    marginTop: "0.25rem",
                  }}
                >
                  {errors.location}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "1rem",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              cursor: "pointer",
              marginTop: "2rem",
            }}
          >
            Update Product
          </button>
        </form>
      </div>
    </>
  );
}

export default Edit;
