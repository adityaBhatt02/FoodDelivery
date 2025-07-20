// src/pages/FoodDetails/FoodDetails.jsx

import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { fetchFoodDetails } from "../../service/foodService";
import { toast } from "react-toastify";
import "./FoodDetails.css";
import { StoreContext } from "../../components/context/StoreContext";

const FoodDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const { increaseQty, quantities } = useContext(StoreContext);

  useEffect(() => {
    const loadFoodDetails = async () => {
      try {
        const foodData = await fetchFoodDetails(id);
        setData(foodData);
      } catch (error) {
        toast.error("Error fetching food details");
      }
    };
    loadFoodDetails();
  }, [id]);

  const handleAddToCart = async () => {
    const added = await increaseQty(data.id);
    if (added) {
      toast.success(`${data.name} added to cart!`);
    }
  };

  return (
    <div className="food-details-container">
      <div className="food-details-card">
        <div className="image-section">
          <img src={data.imageUrl} alt={data.name} />
        </div>
        <div className="info-section">
          <div className="category">
            <span className="badge">Category: {data.category || "General"}</span>
          </div>
          <h1>{data.name}</h1>
          <p className="description">{data.description}</p>
          <p className="price">₹{data.price}</p>

          <div className="button-row">
            <button className="add-to-cart" onClick={handleAddToCart}>
              <i className="bi bi-cart-fill me-2"></i>
              {quantities[data.id] > 0 ? "Add More" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetails;
