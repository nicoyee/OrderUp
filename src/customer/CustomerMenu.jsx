import React, { useState, useEffect } from 'react';
import Customer from '../class/Customer.ts';
import '../css/CustomerMenu.css';

const ITEMS_PER_PAGE = 6;

const CustomerMenu = () => {
  const [dishes, setDishes] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBestSellers, setLoadingBestSellers] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMenuType, setSelectedMenuType] = useState('');

  // Modal state management
  const [modalMessage, setModalMessage] = useState(''); // Define modal message state
  const [isModalOpen, setIsModalOpen] = useState(false); // Define modal visibility state

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

  // Trigger modal with a custom message
  const triggerModal = (message) => {
    setModalMessage(message);
    setIsModalOpen(true);
    setTimeout(() => setIsModalOpen(false), 2000); // Close after 2 seconds
  };

  // Handle adding to cart and triggering modal
  const handleAddToCart = async (dishId, name) => {
    try {
      await Customer.addToCart(dishId);
      triggerModal(name +' added to cart!');
    } catch (error) {
      triggerModal('Failed to add item to cart.');
    }
  };
  

  // Modal component for displaying messages
  const Modal = ({ message }) => (
    isModalOpen ? (
      <div className="modal">
        <div className="modal-content">
          <p>{message}</p>
        </div>
      </div>
    ) : null
  );

  // Pagination logic
  const filteredDishes = dishes
    .filter((dish) => dish.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((dish) => selectedMenuType === '' || dish.menuType === selectedMenuType);

  const indexOfLastDish = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstDish = indexOfLastDish - ITEMS_PER_PAGE;
  const currentDishes = filteredDishes.slice(indexOfFirstDish, indexOfLastDish);

  const totalPages = Math.ceil(filteredDishes.length / ITEMS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Menu type filter logic
  const menuTypes = [...new Set(dishes.map((dish) => dish.menuType))];

  const handleMenuTypeClick = (menuType) => {
    setSelectedMenuType(menuType);
    setCurrentPage(1); // Reset to the first page when a new menu type is selected
  };

  const renderPaginationButtons = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers.map((number) => (
      <button
        key={number}
        onClick={() => handlePageClick(number)}
        className={`pagination-btn ${currentPage === number ? 'active' : ''}`}
      >
        {number}
      </button>
    ));
  };

  return (
    <div className="customer-menu">
      <h1 className="menu-title">Our Menu</h1>

      {/* Search Filter */}
      <input
        type="text"
        placeholder="Search dishes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />

      {/* Menu Type Filter Buttons */}
      <div className="menu-type-buttons">
        <button
          onClick={() => handleMenuTypeClick('')}
          className={`menu-type-btn ${selectedMenuType === '' ? 'active' : ''}`}
        >
          All
        </button>
        {menuTypes.map((menuType) => (
          <button
            key={menuType}
            onClick={() => handleMenuTypeClick(menuType)}
            className={`menu-type-btn ${selectedMenuType === menuType ? 'active' : ''}`}
          >
            {menuType}
          </button>
        ))}
      </div>

      {/* Best Sellers Section */}
      <div className="best-sellers-section">
        {loadingBestSellers ? (
          <p>Loading best sellers...</p>
        ) : bestSellers.length === 0 ? (
          <p>No best sellers available</p>
        ) : (
          <div className="best-sellers-slider">
            {bestSellers.map((dish) => (
              <div key={dish.id} className="best-seller-item">
                <div className="best-seller-item-image-container">
                  <img
                    src={dish.photoURL}
                    alt={dish.name}
                    className="best-seller-item-image"
                  />
                  <div className="best-seller-item-description-overlay">
                    {dish.description}
                  </div>
                </div>
                <div className="best-seller-item-details">
                  <h3 className="best-seller-item-name">{dish.name}</h3>
                  <p className="best-seller-item-price">Price: ${dish.price}</p>
                  <Modal message={modalMessage} />
                  <button
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(dish.id, dish.name)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Menu Items Section */}
      <div className="menu-items">
        {loading ? (
          <p>Loading...</p>
        ) : (
          currentDishes.map((dish) => (
            <div key={dish.id} className="menu-item">
              <div className="menu-item-image-container">
              <Modal message={modalMessage} />
                <img
                  src={dish.photoURL}
                  alt={dish.name}
                  className="menu-item-image"
                />
                <div className="menu-item-description-overlay">
                  {dish.description}
                </div>
              </div>
              <div className="menu-item-details">
                <h3 className="menu-item-name">{dish.name}</h3>
                <p className="menu-item-price">Price: ${dish.price}</p>
                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(dish.id, dish.name)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button
          onClick={handlePreviousPage}
          className="pagination-btn"
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {renderPaginationButtons()}

        <button
          onClick={handleNextPage}
          className="pagination-btn"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CustomerMenu;
