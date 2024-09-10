import '../css/common/modals.css';
import '../css/DashboardComponents.css';
import '../css/MenuTable.css';
import React, { useState, useEffect } from 'react';
import Admin from '../class/admin/Admin.js';

const MenuAdmin = ({ dishes, setDishes }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [editRowIndex, setEditRowIndex] = useState(-1); // Track index of row being edited
  const [editedDishDetails, setEditedDishDetails] = useState({});
  const [openCategory, setOpenCategory] = useState(null); // Track currently open category
  const dishesPerPage = 10;

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const dishesData = await Admin.getDishes().then((res) => {
          return res?.docs?.map((doc) => {
            return {
              id: doc.id,
              ...doc.data(),
            };
          });
        });

        setDishes(dishesData);
      } catch (error) {
        console.error('Error fetching dishes:', error);
      }
    };

    fetchDishes();
  }, []);

  const indexOfLastDish = currentPage * dishesPerPage;
  const indexOfFirstDish = indexOfLastDish - dishesPerPage;

  // Group dishes by category (menuType)
  const categorizedDishes = dishes?.reduce((categories, dish) => {
    const category = dish.menuType || 'Uncategorized';
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(dish);
    return categories;
  }, {});

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEdit = (index) => {
    setEditRowIndex(index === editRowIndex ? -1 : index);
  };

  const handleConfirmEdit = async (index, category, dishIndex) => {
    try {
      const dishToUpdate = categorizedDishes[category][dishIndex];

      await Admin.editDish(dishToUpdate.id, editedDishDetails);

      // Update dish details if successful
      setDishes((state) => {
        const newState = JSON.parse(JSON.stringify(state));
        newState.find((dish) => dish.id === dishToUpdate.id).name =
          editedDishDetails.name || dishToUpdate.name;
        return newState;
      });
    } catch (error) {
      console.error('Error updating dish:', error);
    }
    setEditedDishDetails({});
    setEditRowIndex(-1); // Exit edit mode
  };

  const handleCancelEdit = () => {
    setEditRowIndex(-1); // Exit edit mode
  };

  const handleDelete = async (id) => {
    console.log('Deleting dish with ID:', id);
    try {
      await Admin.deleteDish(id); // Use Admin.deleteDish
      const newDishes = dishes?.filter((dish) => dish.id !== id);
      setDishes(newDishes);
    } catch (error) {
      console.error('Error deleting dish:', error);
    }
  };

  // Toggle the open/close state of a category
  const toggleCategory = (category) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  return (
    <div className="menuTable">
      <h1>Menu</h1>

      {Object.keys(categorizedDishes)?.map((category) => (
        <div key={category}>
          <h2 onClick={() => toggleCategory(category)} className="category-header">
            {category}
          </h2>

          {/* Only render the dishes if the category is open */}
          {openCategory === category && (
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
                {categorizedDishes[category]
                  ?.slice(indexOfFirstDish, indexOfLastDish)
                  .map((dish, index) => (
                    <tr key={dish.id}>
                      <td id="dataTableImage">
                        <img src={dish.photoURL} alt={dish.name} />
                      </td>
                      <td>
                        {editRowIndex === index ? (
                          <input
                            type="text"
                            id={`name_${index}`}
                            defaultValue={dish.name}
                            onChange={(event) => {
                              setEditedDishDetails({
                                ...editedDishDetails,
                                name: event?.target?.value,
                              });
                            }}
                          />
                        ) : (
                          dish.name
                        )}
                      </td>
                      <td>{dish.menuType}</td>
                      <td>
                        {editRowIndex === index ? (
                          <input
                            type="text"
                            id={`description_${index}`}
                            defaultValue={dish.description}
                            onChange={(event) => {
                              setEditedDishDetails({
                                ...editedDishDetails,
                                description: event?.target?.value,
                              });
                            }}
                          />
                        ) : (
                          dish.description
                        )}
                      </td>
                      <td>
                        {editRowIndex === index ? (
                          <input
                            type="text"
                            id={`price_${index}`}
                            defaultValue={dish.price}
                            onChange={(event) => {
                              setEditedDishDetails({
                                ...editedDishDetails,
                                price: event?.target?.value,
                              });
                            }}
                          />
                        ) : (
                          dish.price
                        )}
                      </td>
                      <td className="actionBtns">
                        {editRowIndex === index ? (
                          <div>
                            <button className="editBtn" onClick={() => handleConfirmEdit(index, category, index)}>
                              Confirm
                            </button>
                            <button className="deleteBtn" onClick={handleCancelEdit}>
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div>
                            <button className="editBtn" onClick={() => handleEdit(index)}>
                              Edit
                            </button>
                            <button className="deleteBtn" onClick={() => handleDelete(dish.id)}>
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      ))}

      <div className="pagination">
        {dishes?.length > dishesPerPage && (
          <div>
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
            {Array.from({ length: Math.ceil(dishes?.length / dishesPerPage) }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={currentPage === i + 1 ? 'active' : ''}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === Math.ceil(dishes?.length / dishesPerPage)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuAdmin;
