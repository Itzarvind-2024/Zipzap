import React from 'react';
import './Home.css';
import { useNavigate } from "react-router-dom";
import deliveryManImage from './Scooty.png'; 
import fastFoodIcon from './fastfood.png'; 
import medicineIcon from './medicine.png'; 
import groceryIcon from './grocery.png'; // Update the path to your image file

function Home() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/login');
  };
    
  return (
    <div className="home-container">
      <header className="home-header">
        <div className="brand">ZipZap Delivery</div>
        <nav className="navigation">
          <a href="#home" className="nav-link">Home</a>
          <button className="sign-up-button" onClick={handleClick}>Sign In</button>
        </nav>
      </header>
      <main className="main-content">
        <div className="content-left">
          <h1 class="title">Quick Delivery at Your Doorstep</h1>
          <p class="subtitle">Experience the convenience of home delivery of medicine, food, groceries etc.</p>
          <div className="service-options">
            <div className="service-option">
              <img src={fastFoodIcon} alt="Fast Food" className="service-icon" />
              <span className="service-label">Fast Food</span>
            </div>
            <div className="service-option">
              <img src={medicineIcon} alt="Medicine" className="service-icon" />
              <span className="service-label">Medicine</span>
            </div>
            <div class="service-option">
              <img src={groceryIcon} alt="Groceries" class="service-icon" />
              <span class="service-label">Groceries</span>
            </div>
          </div>
        </div>
        <div className="content-right">
          <img src={deliveryManImage} alt="Delivery Man" className="delivery-man-image" />
        </div>
      </main>
    </div>
  );
}

export default Home;