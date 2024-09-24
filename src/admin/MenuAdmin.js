import '../css/common/modals.css';
import "../css/MenuTable.css"
import React, { useState, useEffect } from 'react';
import Admin from '../class/admin/Admin.js';

const MenuAdmin = ({ dishes, setDishes }) => {
  const [editRowIndex, setEditRowIndex] = useState({}); // Track index of row being edited by category
  const [editedDishDetails, setEditedDishDetails] = useState({});
  const [openCategory, setOpenCategory] = useState(null); // Track the open category
  const [currentPagePerCategory, setCurrentPagePerCategory] = useState({}); // Track current page for each category
  const dishesPerPage = 10;

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

  // Group dishes by category (menuType)
  const categorizedDishes = dishes?.reduce((categories, dish) => {
    const category = dish.menuType || 'Uncategorized';
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(dish);
    return categories;
  }, {});

  const handleEdit = (category, index) => {
    setEditRowIndex({ [category]: index }); // Track editing per category and row
    const dishToEdit = categorizedDishes[category][index];
    setEditedDishDetails({ ...dishToEdit }); // Set initial edit values
  };

  const handleConfirmEdit = async (category, index) => {
    try {
      const dishToUpdate = categorizedDishes[category][index];

      // Send updates to Firebase
      await Admin.editDish(dishToUpdate.id, editedDishDetails);

      // Update the state in real-time
      setDishes((prevDishes) => {
        // Find the dish in the entire dishes list and update
        const updatedDishes = prevDishes.map((dish) => {
          if (dish.id === dishToUpdate.id) {
            return { ...dish, ...editedDishDetails };
          }
          return dish;
        });

        return updatedDishes;
      });

      setEditedDishDetails({});
      setEditRowIndex({}); // Exit edit mode
    } catch (error) {
      console.error('Error updating dish:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditRowIndex({}); // Exit edit mode
    setEditedDishDetails({}); // Reset edited details
  };

  const handleDelete = async (id) => {
    try {
      await Admin.deleteDish(id);
      const newDishes = dishes?.filter((dish) => dish.id !== id);
      setDishes(newDishes);
    } catch (error) {
      console.error('Error deleting dish:', error);
    }
  };

  const toggleCategory = (category) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  const paginate = (category, pageNumber) => {
    setCurrentPagePerCategory((prevState) => ({
      ...prevState,
      [category]: pageNumber,
    }));
  };

  return (
    <div className="menuTable">
      <h1>Menu</h1>

      {/* Category Headers */}
      <div className="category-headers">
        {Object.keys(categorizedDishes)?.map((category) => (
          <button
            key={category}
            className="category-btn"
            type="button"
            onClick={() => toggleCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Render each category's dishes */}
      {Object.keys(categorizedDishes)?.map((category) => {
        const currentPage = currentPagePerCategory[category] || 1;
        const indexOfLastDish = currentPage * dishesPerPage;
        const indexOfFirstDish = indexOfLastDish - dishesPerPage;
        const currentDishes = categorizedDishes[category]?.slice(indexOfFirstDish, indexOfLastDish);

        return (
          openCategory === category && (
            <div key={category} className="category-section">
              <table className="dataTable">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDishes.map((dish, index) => (
                    <tr key={dish.id}>
                      <td id='dataTableImage'><img src={dish.photoURL} alt={dish.name} /></td>
                      <td>
                        {editRowIndex[category] === index
                          ? <input
                              type="text"
                              value={editedDishDetails.name || ""}
                              onChange={(event) =>
                                setEditedDishDetails({
                                  ...editedDishDetails,
                                  name: event.target.value,
                                })
                              }
                            />
                          : dish.name}
                      </td>
                      <td>{dish.menuType}</td>
                      <td>
                        {editRowIndex[category] === index
                          ? <input
                              type="text"
                              value={editedDishDetails.description || ""}
                              onChange={(event) =>
                                setEditedDishDetails({
                                  ...editedDishDetails,
                                  description: event.target.value,
                                })
                              }
                            />
                          : dish.description}
                      </td>
                      <td>
                        {editRowIndex[category] === index
                          ? <input
                              type="number"
                              value={editedDishDetails.price || ""}
                              onChange={(event) =>
                                setEditedDishDetails({
                                  ...editedDishDetails,
                                  price: event.target.value,
                                })
                              }
                            />
                          : dish.price}
                      </td>
                      <td className='actionBtns'>
                        {editRowIndex[category] === index ? (
                          <div>
                            <button className='confirmBtn' onClick={() => handleConfirmEdit(category, index)}>Confirm</button>
                            <button className='cancelBtn' onClick={handleCancelEdit}>Cancel</button>
                          </div>
                        ) : (
                          <div>
                            <button className = 'editBtn' onClick={() => handleEdit(category, index)}>Edit</button>
                            <button className = 'deleteBtn' onClick={() => handleDelete(dish.id)}>Delete</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {categorizedDishes[category]?.length > dishesPerPage && (
                <div className="pagination">
                  <button
                    onClick={() => paginate(category, currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  {Array.from(
                    { length: Math.ceil(categorizedDishes[category]?.length / dishesPerPage) },
                    (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => paginate(category, i + 1)}
                        className={currentPage === i + 1 ? 'active' : ''}
                      >
                        {i + 1}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => paginate(category, currentPage + 1)}
                    disabled={currentPage === Math.ceil(categorizedDishes[category]?.length / dishesPerPage)}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )
        );
      })}
    </div>
  );
};

export default MenuAdmin;
