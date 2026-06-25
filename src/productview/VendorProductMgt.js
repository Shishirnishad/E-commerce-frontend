import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import "./VendorProductMgt.css";

function useScrollReveal() {
  const observerRef = useRef(null);
  const [visibleMap, setVisibleMap] = useState({});

  const observe = useCallback((el, id) => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const idx = entry.target.dataset.index;
              setVisibleMap((prev) => ({ ...prev, [idx]: true }));
              observerRef.current.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
      );
    }
    if (el) {
      el.dataset.index = id;
      observerRef.current.observe(el);
    }
  }, []);

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  return { observe, visibleMap };
}

function VendorProductMgt({ vendor, onBack }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPid, setEditingPid] = useState(null);

  const [formData, setFormData] = useState({
    pid: "",
    pname: "",
    ppprice: "",
    opprice: "",
    pcatgid: "",
    pdesc: "",
    ppicname: null,
  });

  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});
  const { observe, visibleMap } = useScrollReveal();

  const API = process.env.REACT_APP_BASE_API_URL || "http://localhost:9191";
  const VId = vendor?.VId;

  useEffect(() => {
    getCategories();
    getVendorProducts();
  }, []);

  const getVendorProducts = async () => {
    try {
      const res = await axios.get(`${API}/product/showproductbyvendor/${VId}`);
      setProducts(res.data || []);
    } catch (err) {
      console.log(err);
      alert("Failed to fetch products");
    }
  };

  const getCategories = async () => {
    try {
      const res = await axios.get(`${API}/productcatg/showproductcatg`);
      setCategories(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const getNextPid = async () => {
    try {
      const res = await axios.get(`${API}/product/getmaxpid`);
      return res.data.nextPid || 1;
    } catch (err) {
      console.log(err);
      return products.length + 1;
    }
  };

  const handleNewProduct = async () => {
    const nextPid = await getNextPid();
    setFormData({
      pid: nextPid,
      pname: "",
      ppprice: "",
      opprice: "",
      pcatgid: "",
      pdesc: "",
      ppicname: null,
    });
    setImagePreview("");
    setEditingPid(null);
    setErrors({});
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setFormData({
      pid: product.pid,
      pname: product.pname,
      ppprice: product.ppprice,
      opprice: product.opprice,
      pcatgid: product.pcatgid || "",
      pdesc: product.pdesc,
      ppicname: product.ppicname,
    });
    setImagePreview(product.ppicname || "");
    setEditingPid(product.pid);
    setErrors({});
    setShowForm(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, ppicname: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    let temp = {};
    let valid = true;

    if (!formData.pname.trim()) {
      temp.pname = "Product name required";
      valid = false;
    }

    if (!formData.ppprice || Number(formData.ppprice) <= 0) {
      temp.ppprice = "Valid wholesale price required";
      valid = false;
    }

    if (!formData.opprice || Number(formData.opprice) <= 0) {
      temp.opprice = "Valid retail price required";
      valid = false;
    }

    if (Number(formData.opprice) < Number(formData.ppprice)) {
      temp.opprice = "Retail price must be greater than wholesale price";
      valid = false;
    }

    if (!editingPid && !formData.ppicname) {
      temp.ppicname = "Please upload product image";
      valid = false;
    }

    setErrors(temp);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("pid", formData.pid);
      formDataToSend.append("pname", formData.pname);
      formDataToSend.append("ppprice", Number(formData.ppprice));
      formDataToSend.append("opprice", Number(formData.opprice));
      formDataToSend.append("pcatgid", formData.pcatgid || "");
      formDataToSend.append("pdesc", formData.pdesc);
      formDataToSend.append("vid", VId);
      formDataToSend.append("status", "Inactive");

      if (formData.ppicname && formData.ppicname instanceof File) {
        formDataToSend.append("file", formData.ppicname);
      }

      if (editingPid) {
        await axios.put(
          `${API}/product/updateproduct/${editingPid}`,
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        alert("Product updated successfully");
      } else {
        await axios.post(`${API}/product/saveproduct`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Product added successfully");
      }

      setShowForm(false);
      getVendorProducts();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.error || "Failed to save product");
    }
  };

  const handleDeleteProduct = async (pid) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${API}/product/deleteproduct/${pid}`);
        alert("Product deleted successfully");
        getVendorProducts();
      } catch (err) {
        console.log(err);
        alert("Failed to delete product");
      }
    }
  };

  return (
    <div className="vendor-product-wrapper">
      <video className="product-bg-video" autoPlay loop muted playsInline>
        <source src="/videos/bg-product.mp4" type="video/mp4" />
      </video>
      <div className="vendor-product-container">
      <div className="product-header">
        <h2>Manage Products</h2>
        <button className="back-btn" onClick={onBack}>
          ← Back to Home
        </button>
      </div>

      {!showForm ? (
        <div>
          <button className="add-product-btn" onClick={handleNewProduct}>
            + Add New Product
          </button>

          <div className="products-list">
            {products.length > 0 ? (
              products.map((product, index) => (
                <div
                  key={product.pid}
                  ref={(el) => { if (el) { el.dataset.index = index; observe(el, index); } }}
                  className={`product-card ${visibleMap[index] ? "revealed" : ""}`}
                  style={{ transitionDelay: `${index * 0.08}s` }}
                >
                  {product.ppicname && (
                    <img
                      src={product.ppicname}
                      alt={product.pname}
                      className="product-image"
                    />
                  )}

                  <div className="product-details">
                    <h4>{product.pname}</h4>
                    <p>
                      <strong>Wholesale Price:</strong> ₹{product.ppprice}
                    </p>
                    <p>
                      <strong>Retail Price:</strong> ₹{product.opprice}
                    </p>
                    <p>
                      <strong>Category:</strong>{" "}
                      {categories.find((c) => c.pcatgid === product.pcatgid)
                        ?.pcatgname || "N/A"}
                    </p>
                    <p>
                      <strong>Description:</strong> {product.pdesc}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={`status-badge ${product.status.toLowerCase()}`}
                      >
                        {product.status}
                      </span>
                    </p>
                  </div>

                  <div className="product-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEditProduct(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteProduct(product.pid)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-products">No products yet. Click "Add New Product" to get started!</p>
            )}
          </div>
        </div>
      ) : (
        <div className="product-form-container">
          <h3>{editingPid ? "Edit Product" : "Add New Product"}</h3>

          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-group">
              <label>Product ID</label>
              <input
                type="number"
                value={formData.pid}
                disabled
                className="disabled-input"
              />
            </div>

            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                value={formData.pname}
                onChange={(e) =>
                  setFormData({ ...formData, pname: e.target.value })
                }
                placeholder="Enter product name"
              />
              {errors.pname && <span className="error">{errors.pname}</span>}
            </div>

            <div className="form-group">
              <label>Wholesale Price (₹) *</label>
              <input
                type="number"
                value={formData.ppprice}
                onChange={(e) =>
                  setFormData({ ...formData, ppprice: e.target.value })
                }
                placeholder="0.00"
                step="0.01"
              />
              {errors.ppprice && <span className="error">{errors.ppprice}</span>}
            </div>

            <div className="form-group">
              <label>Retail Price (₹) *</label>
              <input
                type="number"
                value={formData.opprice}
                onChange={(e) =>
                  setFormData({ ...formData, opprice: e.target.value })
                }
                placeholder="0.00"
                step="0.01"
              />
              {errors.opprice && <span className="error">{errors.opprice}</span>}
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.pcatgid}
                onChange={(e) =>
                  setFormData({ ...formData, pcatgid: e.target.value })
                }
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.pcatgid} value={cat.pcatgid}>
                    {cat.pcatgname}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.pdesc}
                onChange={(e) =>
                  setFormData({ ...formData, pdesc: e.target.value })
                }
                placeholder="Enter product description"
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Product Image {!editingPid && "*"}</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {errors.ppicname && (
                <span className="error">{errors.ppicname}</span>
              )}
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="image-preview" />
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {editingPid ? "Update Product" : "Add Product"}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
    </div>
  );
}

export default VendorProductMgt;