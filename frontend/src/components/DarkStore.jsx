import React, { useState } from "react";
import axios from "axios";
import "./Darkstore.css";

const DarkStore = () => {
  const [message, setMessage] = useState("");

  const generateStores = async () => {
    try {
      const response = await axios.post("http://localhost:8800/api/generate-stores");
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div className="dark-store-container">
      <h1>Generate Dark Stores</h1>
      <div className="para">This will Generate the Store in given area</div>
      <div className="para">Distance between each store will be 7km</div>
      <button onClick={generateStores}>Generate</button>
      <p>{message}</p>
    </div>
  );
};

export default DarkStore;
