// src/components/StoreDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom

import './StoreDashboard.css'; // Import the CSS file


const StoreDashboard = ({ google }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch orders from the server
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8800/api/store-orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching store orders:', error);
      }
    };

    fetchOrders();
  }, []); // Run once on component mount

  return (
    <div className='container'>
      <h1 className='center'>Store Dashboard</h1>
      <Link to="/storeoperations">
        <button>Change Status of Orders</button>
      </Link>
      <h3>Orders:</h3>
      {orders.map((order) => (
        <div key={order._id}>
          <div className='inside-container'>
            <p>Order ID: {order._id}</p>
            <p>Customer Name: {order.customerName}</p>
            Status: {order.status}
          </div>
        </div>
        
      ))}
    </div>
  );
};

export default StoreDashboard;

// export default GoogleApiWrapper({
//   apiKey: 'AIzaSyDVi8OAJeNDOu1HJLBIiCIeabRGfvj6mHo',
// })(StoreDashboard);
