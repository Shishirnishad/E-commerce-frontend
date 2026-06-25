import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CustomerProducts.css";

const API = process.env.REACT_APP_BASE_API_URL || "http://localhost:9191";

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

function CustomerProducts({ customer }) {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { observe, visibleMap } = useScrollReveal();
  const itemRefs = useRef({});

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const res = await axios.get(`${API}/product/showproduct`);
      setProducts(res.data || []);
    } catch (err) {
      console.log(err);
      alert("Failed to fetch products");
    }
  };

  const handleBuy = (product) => {
    if (!customer) {
      alert("Please login as a customer first");
      navigate("/customer/login");
      return;
    }
    navigate("/customer/invoice", { state: { product, customer } });
  };

  return (
    <div className="products-page">
      <h2>All Products</h2>

      {products.length === 0 ? (
        <p className="products-empty">No products available</p>
      ) : (
        <div className="products-grid">
          {products.map((product, index) => (
            <div
              key={product.pid}
              ref={(el) => { itemRefs.current[index] = el; observe(el, index); }}
              className={`product-item ${visibleMap[index] ? "revealed" : ""}`}
              style={{ transitionDelay: `${index * 0.08}s` }}
            >
              {product.ppicname && (
                <img
                  src={product.ppicname}
                  alt={product.pname}
                  className="product-item-img"
                />
              )}
              <div className="product-item-body">
                <h4>{product.pname}</h4>
                <p><strong>Price:</strong> ₹{product.opprice}</p>
                <p><strong>Description:</strong> {product.pdesc || "N/A"}</p>
              </div>
              <div className="product-item-footer">
                <button
                  onClick={() => handleBuy(product)}
                  className="product-buy-btn"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomerProducts;
