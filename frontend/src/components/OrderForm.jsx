import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OrderForm.css";

const OrderForm = () => {
  const [order, setOrder] = useState({
    customerName: "",
    customerLocation: { lat: 0, lng: 0 }, // Initial location
    items: [],
  });

  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    // Get user's current location when the component mounts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        successCallback,
        errorCallback
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []); // Empty dependency array to run the effect only once on mount

  const successCallback = (position) => {
    const { latitude, longitude } = position.coords;
    console.log("User location:", latitude, longitude);

    // Update the customerLocation in the order state
    setOrder({
      ...order,
      customerLocation: { lat: latitude, lng: longitude },
    });
  };

  const errorCallback = (error) => {
    console.error("Error getting user location:", error.message);
  };

  const handleInputChange = (e) => {
    setOrder({
      ...order,
      [e.target.name]: e.target.value,
    });
  };

  const handleItemChange = (index, value) => {
    const updatedItems = [...order.items];
    updatedItems[index] = value;

    setOrder({
      ...order,
      items: updatedItems,
    });
  };

  const handleAddItem = () => {
    if (newItem.trim() !== "") {
      setOrder({
        ...order,
        items: [...order.items, newItem],
      });
      setNewItem("");
    }
  };

  const placeOrder = async () => {
    try {
      // Make an API request to place the order
      const response = await axios.post(
        "http://localhost:8800/api/place-order",
        order
      );
      console.log("Order placed successfully:", response.data);
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <div className="orderform">
      <h1>Order Form</h1>
      <label>
        Customer Name:
        <input
          type="text"
          name="customerName"
          value={order.customerName}
          onChange={handleInputChange}
        />
      </label>

      <div>
        <label>
          New Item:
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
        </label>
        <button type="button" onClick={handleAddItem}>
          Add Item
        </button>
      </div>

      <h3>Items:</h3>
      {order.items.map((item, index) => (
        <div key={index}>
          <input
            type="text"
            value={item}
            onChange={(e) => handleItemChange(index, e.target.value)}
          />
        </div>
      ))}
      <button onClick={placeOrder}>Place Order</button>
    </div>
  );
};

export default OrderForm;
