// src/components/context/StoreContext.jsx

import { createContext, useEffect, useState } from "react";
import { fetchFoodList } from "../../service/foodService";
import axios from "axios";
import { addToCart, getCartData, removeQtyFromCart } from "../../service/cartService";
import { toast } from "react-toastify"; // ✅ Added for toast

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {
  const [foodList, setFoodList] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [token, setToken] = useState("");

  const increaseQty = async (foodId) => {
    if (!token) {
      toast.error("Please log in to add items to your cart."); // ✅ Show toast if not logged in
      return;
    }

    setQuantities((prev) => ({
      ...prev,
      [foodId]: (prev[foodId] || 0) + 1,
    }));

    await addToCart(foodId, token);
  };

  const decreaseQty = async (foodId) => {
    setQuantities((prev) => ({
      ...prev,
      [foodId]: prev[foodId] > 1 ? prev[foodId] - 1 : 0,
    }));

    await removeQtyFromCart(foodId, token);
  };

  const removeItem = (foodId) => {
    setQuantities((prev) => {
      const newQty = { ...prev };
      delete newQty[foodId];
      return newQty;
    });
  };

  const getTotalItems = () =>
    Object.values(quantities).reduce((sum, q) => sum + q, 0);

  useEffect(() => {
    async function loadData() {
      const data = await fetchFoodList();
      setFoodList(data);

      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        await loadCartData(savedToken);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (token) {
      loadCartData(token);
    }
  }, [token]);

  const loadCartData = async (token) => {
    const response = await getCartData(token);
    if (response && response.data) {
      setQuantities(response.data.items || {});
    }
  };

  const contextValue = {
    foodList,
    quantities,
    increaseQty,
    decreaseQty,
    removeItem,
    getTotalItems,
    token,
    setToken,
    setQuantities,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
