const express = require("express");
const router = express.Router();

const DarkStore = require("../models/DarkStore"); // Add this line to import the DarkStore model

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
router.post("/generate-stores", (req, res) => {
  const centerLat = dmsToDecimal(25, 26, 9); // Convert DMS to decimal
  const centerLon = dmsToDecimal(81, 50, 47); // Convert DMS to decimal
  const radius = 50; // Radius in km

  const stores = generateStores(centerLat, centerLon, radius);
  DarkStore.insertMany(
    stores.map((location, index) => ({ name: `Store ${index + 1}`, location })),
    (err, docs) => {
      if (err) {
        res
          .status(500)
          .json({ message: "Error generating stores", error: err });
      } else {
        res
          .status(200)
          .json({ message: "Stores generated successfully", stores: docs });
      }
    }
  );
});
