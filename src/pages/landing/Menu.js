import './css/Menu.css';

import React, { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';

import Admin from '../../class/admin/Admin';

const MenuPage = ({ setLandingContent }) => {
 
  const [dishes, setDishes] = useState([]);
  const [openCategory, setOpenCategory] = useState('Food Package'); // Set default category to "Food Package"

  const handleClick = () => {
    setLandingContent('navigation');
  };

  useEffect(() => {
    const fetchDishes = async () => {
        try {
            const dishesData = await Admin.getDishes().then((res) => {
                return res?.docs?.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
            });
            setDishes(dishesData);
        } catch (error) {
            console.error('Error fetching dishes:', error);
        }
    };
    fetchDishes();
  }, []);

  // Group dishes by category
  const categorizedDishes = dishes.reduce((categories, dish) => {
    const category = dish.menuType || 'Uncategorized';
    if (!categories[category]) {
        categories[category] = [];
    }
    categories[category].push(dish);
    return categories;
  }, {});

  // Toggle the selected category while closing others
  const handleCategoryToggle = (category) => {
    if (openCategory === category) {
        setOpenCategory(null); // Close if clicked again
    } else {
        setOpenCategory(category); // Open the clicked category
    }
  };

  return (
      <div id='menuContainer'>
  
          <div className='menu-left'>
            
            <div className='menu-header'>
              <h1>Menu</h1>
              <h2 className='menu-back-button' onClick={handleClick}>Back</h2>
            </div>

            <div className='menu-nav'>
              {Object.keys(categorizedDishes).map((category) => (
                <h3
                    key={category}
                    className={`menu-nav-btn ${openCategory === category ? 'active' : ''}`}
                    onClick={() => handleCategoryToggle(category)}
                >
                  {category}
                </h3>
                ))}
            </div>

          </div>

          <div className='menu-right'>
            {Object.keys(categorizedDishes).map((category) => (
              openCategory === category && (
                <div key={category} className="menu-items-container">
                  {categorizedDishes[category].map((dish) => (
                    <div key={dish.id} className="menu-item">
                      <h1>{dish.price}</h1>
                      <h2>{dish.name}</h2>
                      <p>{dish.description}</p>
                    </div>
                  ))}
                </div>
              )
            ))}
          </div>
  
      </div>
    );
 
};

export default MenuPage;