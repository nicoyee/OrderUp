import './css/CustomerMenu.css';
import 'react-toastify/dist/ReactToastify.css';

import Customer from '../class/Customer.ts';

import React, { useState, useContext, useEffect } from 'react';
import { toast, Flip } from 'react-toastify';

import { PiPlant } from "react-icons/pi";
import { TbMeat } from "react-icons/tb";
import { RiDrinks2Line } from "react-icons/ri";
import { LuCakeSlice } from "react-icons/lu";
import { IoFastFoodOutline } from "react-icons/io5";
import { BiGridAlt } from "react-icons/bi";

const CustomerMenu = () => {

  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMenuType, setSelectedMenuType] = useState('');

  useEffect(() => {
    const fetchDishes = () => {
      Customer.getDishes()
        .then((querySnapshot) => {
          const dishesData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            menuType: doc.data().menuType,
          }));
          setDishes(dishesData);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching dishes:', error);
          setLoading(false);
        });   
    };
    fetchDishes();
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

  const filteredDishes = selectedMenuType 
  ? dishes.filter(dish => dish.menuType === selectedMenuType)
  : dishes;

  const menuTypes = [...new Set(dishes.map((dish) => dish.menuType))];

  const handleMenuTypeClick = (menuType) => {
    setSelectedMenuType(menuType);
  };

  const categoryIcons = {
    Vegetarian: <PiPlant />,
    Meat: <TbMeat />,
    Beverages: <RiDrinks2Line />,
    Dessert: <LuCakeSlice />,
    'Food Package': <IoFastFoodOutline />,
  };

  return (
    <div id='customerMenu'>

      <h1 className='sectionHeader'>Our Menu</h1>

      <div className='customerMenu-categories'>
        <div className='customerMenu-categories-container'>

          <button
            onClick={() => handleMenuTypeClick('')}
            className={` ${selectedMenuType === '' ? 'active' : ''}`}
          >
            <span><BiGridAlt /></span>
            <h1>All</h1>
          </button>

          {menuTypes.map((menuType) => (
            <button
            key={menuType}
            onClick={() => handleMenuTypeClick(menuType)}
            className={` ${selectedMenuType === menuType ? 'active' : ''}`}
            >
              <span>{categoryIcons[menuType] || null}</span>
              <h1>{menuType}</h1>
            </button>
          ))}

        </div>
      </div>

      <div className='customerMenu-container'>

        <div className='customerMenu-content'>

          {loading ? (
            <p>Loading dishes...</p>
          ) : (
            filteredDishes.map((dish) => (
              <div 
                key={dish.id} 
                className='customerMenu-item'
              >
                <div className='customerMenu-itemMain'>
                    <span>
                      <button
                        onClick={() => handleAddToCart(dish.id, dish.name)}
                      >
                        <svg viewBox="0 0 16 16" class="bi bi-cart2" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l1.25 5h8.22l1.25-5H3.14zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"></path>
                        </svg>
                      </button>
                    </span>
                    <img src={dish.photoURL || test} alt={dish.name} />
                  </div>
                  <div className='customerMenu-itemSub'>
                    <div className='customerMenu-itemSub-description'>
                      <h2>{dish.name}</h2>
                      <p>{dish.description}</p>
                    </div>
                    <div className='customerMenu-itemSub-price'>
                      <h3>${dish.price}</h3>
                    </div>
                  </div>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
};

export default CustomerMenu;
