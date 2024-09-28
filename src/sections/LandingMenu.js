import '../css/sections/LandingMenu.css';
import Admin from '../class/admin/Admin';
import React, { useState, useEffect } from 'react';

const LandingMenu = () => {
    const [dishes, setDishes] = useState([]);
    const [openCategory, setOpenCategory] = useState('Food Package'); // Set default category to "Food Package"

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
        <section id='landingMenu'>
            <h1>Dine In</h1>

            {/* Category Buttons */}
            <div className="category-headers">
                {Object.keys(categorizedDishes).map((category) => (
                    <button
                        key={category}
                        className={`category-btn ${openCategory === category ? 'active' : ''}`}
                        onClick={() => handleCategoryToggle(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Display dishes for the selected/open category */}
            {Object.keys(categorizedDishes).map((category) => (
                openCategory === category && (
                    <div key={category} className="landingMenuBox">
                        {categorizedDishes[category].map((dish) => (
                            <div key={dish.id} className="landingMenuItem">
                                <img src={dish.photoURL} alt={dish.name} className="menuItemImage" />
                                <h2>{dish.price}</h2>
                                <span className="horizontalMenuLine" />
                                <h3>{dish.name}</h3>
                            </div>
                        ))}
                    </div>
                )
            ))}
        </section>
    );
}

export default LandingMenu;
