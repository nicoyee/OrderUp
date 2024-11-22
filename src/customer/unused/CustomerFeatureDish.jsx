import React, { useState, useEffect } from "react";
import Customer from '../../class/Customer.ts';
import '../css/CustomerFeatureDish.css';

const CustomerFeatureDish = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [loadingBestSellers, setLoadingBestSellers] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchBestSellers = () => {
      Customer.getBestSellers()
        .then((bestSellersData) => {
          setBestSellers(bestSellersData);
          setLoadingBestSellers(false);
        })
        .catch((error) => {
          console.error('Error fetching best sellers:', error);
          setLoadingBestSellers(false);
        });
    };

    fetchBestSellers();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % bestSellers.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [bestSellers.length]);

  return (
    <>
      <div className="dish-ads upper-right">
        {loadingBestSellers ? (
          <p>Loading...</p>
        ) : bestSellers.length > 0 ? (
          <div className="slideshow">
            <img
              src={bestSellers[currentSlide].photoURL}
              alt={bestSellers[currentSlide].name}
              className="slideshow-image"
            />
          </div>
        ) : (
          <p>No best sellers available</p>
        )}
      </div>
    </>
  );
};

export default CustomerFeatureDish;
