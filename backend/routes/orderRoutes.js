// /backend/src/routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const DarkStore = require("../models/DarkStore"); // Add this line to import the DarkStore model

// Helper function to calculate Euclidean distance between two points
function calculateDistance(point1, point2) {
  const dx = point1.lat - point2.lat;
  const dy = point1.lng - point2.lng;
  return Math.sqrt(dx * dx + dy * dy);
}

// Place a new order
router.post('/place-order', async (req, res) => {
  console.log("Placing order");
  try {
      const { customerName, customerLocation, items } = req.body;

    if (!customerName || !customerLocation || !items || items.length === 0) {
      return res.status(400).json({ error: 'Invalid order data' });
    }

      // Fetch all dark stores from the database
    const allDarkStores = await DarkStore.find({});
    // console.log("All Dark Stores:", allDarkStores);


    if (!allDarkStores || allDarkStores.length === 0) {
      return res.status(500).json({ error: 'No dark stores available' });
    }

    console.log("Customer Location:", customerLocation);

      // Find the nearest dark store based on the customer's location
    let nearestDarkStore = allDarkStores[0];
    let minDistance = calculateDistance(customerLocation, nearestDarkStore.location);

    for (const store of allDarkStores) {
        const distance = calculateDistance(customerLocation, store.location);
        if (distance < minDistance) {
          minDistance = distance;
          nearestDarkStore = store;
        }
    }
   
    // console.log("Nearest Dark Store:", nearestDarkStore);
    
    const newOrder = await Order.create({
        customerName,
        customerLocation,
        items,
        status: 'Pending',
        assignedStore: nearestDarkStore,
    });

      // Emit a real-time notification to alert store operators about the new order
      // (WebSocket or Push Notification logic to be added)
      // Example: socket.emit('newOrder', newOrder);

    const saveOrder = await newOrder.save();

    nearestDarkStore.orders.push(saveOrder._id);
    console.log(saveOrder._id);
    // Save the updated Dark Store
    await nearestDarkStore.save();

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Get store orders
router.get("/store-orders", async (req, res) => {
  try {
    const storeOrders = await Order.find({ status: { $ne: "Completed" } });
    res.json(storeOrders);
  } catch (error) {
    console.error("Error fetching store orders:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Update order status
router.patch("/update-order-status/:orderId", async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.orderId,
      { $set: { status: req.body.status } },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Assign order to store (dummy logic for illustration)
router.post("/assign-order-to-store/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const storeId = req.body.storeId;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: { assignedStore: { lat: 0, lng: 0 }, status: "In Progress" } },
      { new: true }
    );

    // Emit a real-time notification to alert store operators about the assigned order
    // Example: socket.emit('orderAssignedToStore', updatedOrder);

    res.json(updatedOrder);
  } catch (error) {
    console.error("Error assigning order to store:", error);
    res.status(500).send("Internal Server Error");
  }
});


router.get("/delivery-executive-orders", async (req, res) => {
  try {
    // Fetch orders with status 'Assigned' (assuming 'Assigned' is the status for delivery executive orders)
    const assignedOrders = await Order.find({ status: "Assigned" });

    res.status(200).json(assignedOrders);
  } catch (error) {
    console.error(
      "Error fetching assigned orders for delivery executive:",
      error
    );
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to fetch all orders
router.get("/api/all-orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Function to convert degrees, minutes, seconds to decimal
function dmsToDecimal(degrees, minutes, seconds) {
  return degrees + minutes / 60 + seconds / 3600;
}

// Function to calculate new store locations
function generateStores(centerLat, centerLon, radius) {
  const kmPerDegree = 111; // approximate conversion for latitude
  const distance = 7; // 7 km apart
  const maxDistanceInDegrees = radius / kmPerDegree;
  const storeLocations = [];

  for (
    let lat = -maxDistanceInDegrees;
    lat <= maxDistanceInDegrees;
    lat += distance / kmPerDegree
  ) {
    for (
      let lon = -maxDistanceInDegrees / Math.cos((Math.PI * centerLat) / 180);
      lon <= maxDistanceInDegrees / Math.cos((Math.PI * centerLat) / 180);
      lon += distance / (kmPerDegree * Math.cos((Math.PI * centerLat) / 180))
    ) {
      storeLocations.push({ lat: centerLat + lat, lng: centerLon + lon });
    }
  }
  return storeLocations;
}


// Endpoint to generate stores
router.post("/generate-stores", async (req, res) => {
  const centerLat = dmsToDecimal(25, 26, 9); // Convert DMS to decimal
  const centerLon = dmsToDecimal(81, 50, 47); // Convert DMS to decimal
  const radius = 50; // Radius in km

  try {
    const stores = generateStores(centerLat, centerLon, radius);

    const docs = await DarkStore.insertMany(
      stores.map((location, index) => ({ name: `Store ${index + 1}`, location }))
    );

    res.status(200).json({ message: "Stores generated successfully", stores: docs });
  } catch (err) {
    res.status(500).json({ message: "Error generating stores", error: err });
  }
});


// router.post("/generate-stores", async (req, res) => {
//   try {
//     console.log("Hi store is generated");
//   } catch (error) {
//     console.error('Error fetching assigned orders for delivery executive:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }

// });

module.exports = router;
