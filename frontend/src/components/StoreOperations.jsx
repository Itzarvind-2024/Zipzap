// src/components/StoreOperations.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StoreOperations.css'; 


const StoreOperations = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch orders from the server
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8800/api/store-orders');
        console.log(response)
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching store orders:', error);
      }
    };

    fetchOrders();
  }, []); // Run once on component mount

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      const inProgressOrdersCount = orders.filter(order => order.status === "In Progress").length;

    // If the new status is "In Progress" and the count is already 5, prevent the update
      if (newStatus === "In Progress" && inProgressOrdersCount >= 5) {
        console.warn("Maximum number of orders in progress reached. Cannot update status.");
        return;
      }
      // Update the order status on the server
      await axios.patch(`http://localhost:8800/api/update-order-status/${orderId}`, { status: newStatus });

      // Update the local state to reflect the change
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order._id === orderId ? { ...order, status: newStatus } : order))
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div className='store-operation'>
      <h1>Store Operations</h1>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.customerName}</td>
              <td>{order.status}</td>
              <td>
                {/* Dropdown or buttons for changing order status */}
                <select
                  value={order.status}
                  onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StoreOperations;
