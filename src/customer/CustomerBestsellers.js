import './css/CustomerBestsellers.css';
import 'react-toastify/dist/ReactToastify.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Customer from '../class/Customer.ts';

import React, { useState, useContext, useEffect } from 'react';
import { ToastContainer, toast, Flip } from 'react-toastify';
import Slider from "react-slick";

const CustomerBestsellers = () => {

    const [bestSellers, setBestSellers] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
        const fetchBestSellers = () => {
          Customer.getBestSellers()
            .then((bestSellersData) => {
              setBestSellers(bestSellersData);
              setLoading(false);
            })
            .catch((error) => {
              console.error('Error fetching best sellers:', error);
              setLoading(false);
            });
        };
        fetchBestSellers();
    }, []);

    const handleAddToCart = async (dishId, name) => {
        try {
          await Customer.addToCart(dishId);
          toast.success(`${name} added to cart!`, {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Flip,
            });
        } catch (error) {
          toast.error(`Failed to add item to cart.`, {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Flip,
            });
        }
    };

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: false,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
            }
          }
        ],
      };

    return (
        <div id='customerBestsellers'>

            <h1 className='sectionHeader'>Our Bestsellers</h1>

            {loading ? (
                <p>Loading best sellers...</p>
            ) : bestSellers.length === 0 ? (
                <p>No best sellers available</p>
            ) : (

                <Slider {...sliderSettings}>
                    {bestSellers.map((dish) => ( 
                
                    <div className='customerBestsellers-container'>
                        <div key={dish.id} className='customerBestsellers-item'>

                            <img src={dish.photoURL} />

                            <div className='customerBestsellers-item-info'>
                                <h2>{dish.name}</h2>
                            </div>

                            <div className='customerBestsellers-item-add'>
                                
                            </div>
                        </div>
                    </div>   
                    ))}
                </Slider>
            )}
        </div>
    );
};

export default CustomerBestsellers;
