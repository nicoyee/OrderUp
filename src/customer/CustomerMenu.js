import './css/CustomerMenu.css';

import React, { useState, useContext, useEffect } from 'react';
import Customer from '../class/Customer.ts';

import test from '../assets/foodplaceholder.png';

const CustomerMenu = () => {

  const [dishes, setDishes] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loadingBestSellers, setLoadingBestSellers] = useState(true);
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

    fetchDishes();
    fetchBestSellers();

  }, []);

  const filteredDishes = selectedMenuType 
  ? dishes.filter(dish => dish.menuType === selectedMenuType)
  : dishes;

  const menuTypes = [...new Set(dishes.map((dish) => dish.menuType))];

  const handleMenuTypeClick = (menuType) => {
    setSelectedMenuType(menuType);
  };

  return (
    <div id='customerMenu'>

      <h1 className='sectionHeader'>Our Menu</h1>

      <div className='customerMenu-categories'>
        <button
          onClick={() => handleMenuTypeClick('')}
          className={` ${selectedMenuType === '' ? 'active' : ''}`}
        >
          <span>All</span>
        </button>

        {menuTypes.map((menuType) => (
          <button
          key={menuType}
          onClick={() => handleMenuTypeClick(menuType)}
          className={` ${selectedMenuType === menuType ? 'active' : ''}`}
          >
            {menuType}
          </button>
        ))}

      </div>

      <div className='customerMenu-content'>

        {loading ? (
          <p>Loading dishes...</p>
        ) : (
          filteredDishes.map((dish) => (
            <div key={dish.id} className='customerMenu-item'>
              <div className='customerMenu-itemMain'>
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
  );
};

export default CustomerMenu;
