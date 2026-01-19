import { useState, useEffect } from "react";
import "../styles/loader.css";
import "../styles/sell.css";
import { ProductAgeInput } from "./howmuchold";
import { useNavigate } from "react-router-dom";
import TextareaList from "./textarea";
function Sell() {
  const [loading, setloading] = useState(false);
  const [imgCount, setimgCount] = useState(0);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [img, setImg] = useState([]);
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const navigate = useNavigate();

  const notify = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    cat: "Misc",
    name: "",
    mob: "",
    location: "",
    old: "",
    email: JSON.parse(localStorage.getItem("user")).userDetails.email,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/userDetails`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const fetchedData = await response.json();
        const newData = fetchedData.details.filter(
          (datas) =>
            datas.email ==
            JSON.parse(localStorage.getItem("user")).userDetails.email
        );
        updateFields(newData[0]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const updateFields = (x) => {
    const arr = ["name", "mob", "location"];

    arr.map((item, index) => {
      setFormData((prevData) => ({
        ...prevData,
        [item]: x[item],
      }));
    });
  };

  const [productAge, setProductAge] = useState({
    years: 0,
    months: 0,
    days: 0,
    totalDays: 0,
  });

  useEffect(() => {
    console.log(items.toString());
  }, [items]);

  // Validation errors state
  const [errors, setErrors] = useState({
    title: "",
    price: "",
    cat: "",
    name: "",
    mob: "",
    location: "",
    img: "",
  });

  // Touched fields state
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
      ["old"]: finalAge,
    }));
  };

  // Validation functions
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
    // For price field, prevent 'e', '+', '-' characters
    if (name === "price") {
      // Remove any non-numeric characters except decimal point
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

    // Validate on change if field was touched
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
    if (imgCount >= 5) {
      notify("You can Maximum upload 5 images per Product!");
      return;
    }
    const file = e.target.files[0];
    if (file) {
      // Validate file type
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

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        notify("Image size should not exceed 5MB");
        return;
      }

      setImg((prvfile) => [...prvfile, file]);
      setimgCount((prev) => prev + 1);
      setErrors((prevErrors) => ({
        ...prevErrors,
        img: "",
      }));
    }
  };

  const delImg = (itemtodel) => {
    const updatedTasks = img.filter((task) => task !== itemtodel);
    setImg(updatedTasks);
    setimgCount((prev) => prev - 1);
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate all fields
    Object.keys(formData).forEach((key) => {
      if (key !== "email") {
        const error = validateField(key, formData[key]);
        if (error) {
          newErrors[key] = error;
          isValid = false;
        }
      }
    });

    // Validate images
    if (img.length === 0) {
      newErrors.img = "At least one image is required";
      isValid = false;
    }

    setErrors(newErrors);

    // Mark all fields as touched
    const allTouched = {};
    Object.keys(touched).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    return isValid;
  };

  const UploadData = async (event) => {
    try {
      const formImg = new FormData();
      img.forEach((item) => {
        formImg.append("image", item);
      });

      for (let key in formData) {
        formImg.append(key, formData[key]);
      }

      formImg.append("desc", items.join(", "));

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/upload`,
        {
          method: "POST",
          body: formImg,
        }
      );
      console.log(response);
      if (!response.ok) {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.log(error);
      notify("Failed to upload product. Please try again.");
    } finally {
      navigate("/myProducts", { replace: true });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (text.trim()) {
        setItems((prev) => [...prev, text.trim()]);
        setText("");
      }
    }
  };


  /* popup box */

  const [isOpen, setIsOpen] = useState(false);

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

  const handleYes = (event) => {
    setloading(true);
    UploadData(event);
  };

  const handleNo = () => {
    closeModal();
  };

  return (
    <>
      {/* Custom Toast Notification */}
      {showToast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: "#f44336",
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
        <div className="modal-overlay" onClick={closeModal}>
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "200px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                }}
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
              <style>{`
                @keyframes pulse {
                  0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
                  40% { transform: scale(1); opacity: 1; }
                }
              `}</style>
            </div>
          ) : (
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <div className="icon-container">
                  <svg
                    className="question-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>

                <h2 className="modal-title">Post the Product?</h2>

                <div className="button-group">
                  <button className="btn btn-no" onClick={handleNo}>
                    No
                  </button>
                  <button className="btn btn-yes" onClick={handleYes}>
                    Yes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div>
        <h2 style={{ textAlign: "center", fontWeight: "bold", margin: "1rem" }}>
          POST YOUR PRODUCT
        </h2>
        <form
          className="form-control form-control-cont needs-validation"
          noValidate
          onSubmit={openModal}
        >
          <h3 className="mt-3" style={{ fontWeight: "bold" }}>
            PRODUCT DETAILS
          </h3>

          <div>
            <input
              name="title"
              placeholder="Title*"
              type="text"
              className={`form-control ${
                touched.title && errors.title ? "is-invalid" : ""
              } ${
                touched.title && !errors.title && formData.title
                  ? "is-valid"
                  : ""
              }`}
              value={formData.title}
              onChange={handleInputChange}
              onBlur={handleBlur}
              required
            />
            {touched.title && errors.title && (
              <div className="invalid-feedback" style={{ display: "block" }}>
                {errors.title}
              </div>
            )}
          </div>
          <br />

          <div>
            <textarea
              name="desc"
              placeholder="Add a feature and hit enter*"
              type="text"
              className={`form-control ${
                touched.desc && errors.desc ? "is-invalid" : ""
              } ${
                touched.desc && !errors.desc && formData.desc ? "is-valid" : ""
              }`}
              /* value={formData.desc}
              onChange={handleInputChange} 
              onBlur={handleBlur}*/
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              required
            ></textarea>
            <ul>
              {items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            {/* <TextareaList></TextareaList> */}
            {touched.desc && errors.desc && (
              <div className="invalid-feedback" style={{ display: "block" }}>
                {errors.desc}
              </div>
            )}
          </div>
          <br />

          <div style={{ display: "flex", gap: "1rem" }}>
            <div style={{ flex: 1 }}>
              <input
                name="price"
                placeholder="Price*"
                type="number"
                className={`form-control ${
                  touched.price && errors.price ? "is-invalid" : ""
                } ${
                  touched.price && !errors.price && formData.price
                    ? "is-valid"
                    : ""
                }`}
                value={formData.price}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
              />
              {touched.price && errors.price && (
                <div className="invalid-feedback" style={{ display: "block" }}>
                  {errors.price}
                </div>
              )}
            </div>

            <div style={{ flex: 1 }}>
              <select
                name="cat"
                className={`form-control form-select ${
                  touched.cat && errors.cat ? "is-invalid" : ""
                } ${
                  touched.cat && !errors.cat && formData.cat !== "Misc"
                    ? "is-valid"
                    : ""
                }`}
                required
                value={formData.cat}
                onChange={handleInputChange}
                onBlur={handleBlur}
              >
                <option
                  value="Misc"
                  className="form-control"
                  style={{ fontWeight: "200" }}
                >
                  Category*
                </option>
                <option value="Furnitures" className="form-control">
                  Furniture
                </option>
                <option value="Electronics" className="form-control">
                  Electronics
                </option>
                <option value="Households" className="form-control">
                  Households
                </option>
                <option value="Vehicles" className="form-control">
                  Vehicle
                </option>
                <option value="Mobiles" className="form-control">
                  Mobiles & Tablets
                </option>
              </select>
              {touched.cat && errors.cat && (
                <div className="invalid-feedback" style={{ display: "block" }}>
                  {errors.cat}
                </div>
              )}
            </div>
          </div>
          <ProductAgeInput
            value={productAge}
            onChange={handleAgeChange}
          ></ProductAgeInput>
          <div className="form-control">
            <div className="mb-3 mt-3" style={{ display: "flex" }}>
              <h4>UPLOAD UP TO 5 PHOTOS</h4>

              <h4
                id="num"
                className="float-left"
                style={{ marginLeft: "auto", marginRight: "0" }}
              >
                {imgCount}/5
              </h4>

              <input
                type="file"
                accept="image/*"
                id="img1"
                required
                style={{ display: "none" }}
                onChange={handleImage}
              />
            </div>

            <div className="imageHolder" id="imageHolder">
              {img.map((item, index) => (
                <div
                  className="hld form-control"
                  id="hld1"
                  key={index}
                  style={{ position: "relative" }}
                >
                  <img
                    className="hld-img"
                    src={URL.createObjectURL(item)}
                    alt="Some image"
                    width={100}
                    height={100}
                    key={index}
                  />
                  <span onClick={() => delImg(item)} className="delbtn">
                    X
                  </span>
                </div>
              ))}
              <div className="hld" id="hld1">
                <label htmlFor="img1" className="labels form-control">
                  <i className="fa-solid fa-upload"></i> Add
                </label>
              </div>
            </div>
            {touched.img && errors.img && (
              <div
                className="invalid-feedback"
                style={{ display: "block", marginTop: "0.5rem" }}
              >
                {errors.img}
              </div>
            )}
          </div>

          <hr />

          <h3 className="mt-3" style={{ fontWeight: "bold" }}>
            OWNER'S DETAILS
          </h3>

          <div>
            <input
              name="name"
              placeholder="Enter your Name*"
              type="text"
              className={`form-control ${
                touched.name && errors.name ? "is-invalid" : ""
              } ${
                touched.name && !errors.name && formData.name ? "is-valid" : ""
              }`}
              value={formData.name}
              onChange={handleInputChange}
              onBlur={handleBlur}
              required
            />
            {touched.name && errors.name && (
              <div className="invalid-feedback" style={{ display: "block" }}>
                {errors.name}
              </div>
            )}
          </div>
          <br />

          <div style={{ display: "flex", gap: "1rem" }}>
            <div style={{ flex: 1 }}>
              <input
                name="mob"
                placeholder="Mobile Number*"
                type="number"
                className={`form-control ${
                  touched.mob && errors.mob ? "is-invalid" : ""
                } ${
                  touched.mob && !errors.mob && formData.mob ? "is-valid" : ""
                }`}
                value={formData.mob}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
                disabled
              />
              {touched.mob && errors.mob && (
                <div className="invalid-feedback" style={{ display: "block" }}>
                  {errors.mob}
                </div>
              )}
            </div>

            <div style={{ flex: 1 }}>
              <input
                name="location"
                placeholder="Location*"
                type="text"
                className={`form-control ${
                  touched.location && errors.location ? "is-invalid" : ""
                } ${
                  touched.location && !errors.location && formData.location
                    ? "is-valid"
                    : ""
                }`}
                value={formData.location}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
              />
              {touched.location && errors.location && (
                <div className="invalid-feedback" style={{ display: "block" }}>
                  {errors.location}
                </div>
              )}
            </div>
          </div>
          <br />

          <button type="submit" className="btn btn-success add-btn">
            Add Product
          </button>
        </form>
      </div>
    </>
  );
}

export default Sell;
