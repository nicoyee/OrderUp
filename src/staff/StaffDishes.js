import "./css/StaffDishes.css";

import { RiApps2AddLine } from "react-icons/ri";
import { FaTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { FaBan } from "react-icons/fa";

import React, { useEffect, useState, useContext } from 'react';
import Modal from 'react-modal';
import { toast, Flip } from 'react-toastify';

import Staff from '../class/admin/Staff';

import CreateDish from "./StaffDishesCreateDish.js";

const StaffDishes = () => {

    const [ dishes, setDishes ] = useState([]);
    const [ dishCategory, setDishCategory ] = useState('All');
    const [ createDishModal, showCreateDishModal ] = useState(false);
    const [ editingDishId, setEditingDishId ] = useState(null); // Track which dish is being edited
    const [ editedDish, setEditedDish ] = useState(null);

    const [ currentPage, setCurrentPage ] = useState(1);
    const ITEMS_PER_PAGE = 5;

    useEffect(() => {
        const fetchDishes = async () => {
            try {
                const dishesData = await Staff.getDishes().then((res) => {
                    return res?.docs
                        ?.map((doc) => ({
                            id: doc.id,
                            ...doc.data(),
                        }))
                        .filter(dish => !dish.deleted);
                });
                setDishes(dishesData);
            } catch (error) {
                console.error('Error fetching dishes:', error);
            }
        };
    
        fetchDishes();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [dishCategory]);

    const categorizedDishes = dishes?.reduce((categories, dish) => {
        const category = dish.menuType || 'Uncategorized';
        if (!categories['All']) {
            categories['All'] = [];
        }
        categories['All'].push(dish);
        if (!categories[category]) {
            categories[category] = [];
        }
        categories[category].push(dish);
        return categories;
    }, {});

    const getPaginatedDishes = (dishes) => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return dishes?.slice(startIndex, endIndex);
    };

    const getTotalPages = (dishes) => {
        return Math.ceil((dishes?.length || 0) / ITEMS_PER_PAGE);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const currentDishes = categorizedDishes[dishCategory] || [];
    const paginatedDishes = getPaginatedDishes(currentDishes);
    const totalPages = getTotalPages(currentDishes);

    const handleEdit = (dish) => {
        setEditingDishId(dish.id);
        setEditedDish({ ...dish });
    };

    const handleEditCancel = () => {
        setEditingDishId(null);
        setEditedDish(null);
    };

    const handleEditChange = (e) => {
        const { name, type, value, files } = e.target;
    
        if (type === 'file') {
            if (files && files[0]) {
                setEditedDish(prev => ({
                    ...prev,
                    photoFile: files[0], // Store the actual file object
                }));
            }
        } else {
            setEditedDish(prev => ({
                ...prev,
                [name]: name === 'price' ? parseFloat(value) : value
            }));
        }
    };

    const handleEditConfirm = async (dishId) => {
        try {
            let updatedDishData = { ...editedDish };

            // If there's a new photo file, upload it first
            if (editedDish.photoFile) {
                const photoURL = await Staff.uploadDishPhoto(editedDish.photoFile);
                updatedDishData = {
                    ...updatedDishData,
                    photoURL: photoURL
                };
            }

            // Clean up temporary photo data
            delete updatedDishData.photoFile;

            await Staff.editDish(dishId, updatedDishData);

            setDishes(prevDishes =>
                prevDishes.map(dish =>
                    dish.id === dishId ? { ...dish, ...updatedDishData } : dish
                )
            );

            toast.success(`${editedDish.name} has been successfully edited!`, {
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

            setEditingDishId(null);
            setEditedDish(null);

        } catch (error) {
            console.error('Error updating dish:', error);
        }
    };

    const handleTabClick = (category) => {
        setDishCategory(category);
    };

    const viewCreateDish = () => {
        showCreateDishModal(true);
        document.body.classList.add('modal-open');
    };
    
    const closeCreateDish = () => {
        showCreateDishModal(false);
        document.body.classList.remove('modal-open');
    };

    const handleDeleteDish = async (dishId) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this dish?');
        if (isConfirmed) {
            try {
                // If confirmed, mark the event as deleted
                await Staff.deleteDish(dishId);
                setDishes(dishes.filter(dish => dish.id !== dishId)); // Optionally remove it from the UI
            } catch (error) {
                console.error('Error marking dish as deleted:', error);
            }
        }
    };

    return (
        <div id="staffDishes" className="dashboard-content">

            <div className="dashboard-section">

                <div className="userInfo staff">
                    <div className="userInfo-left">
                        <span className="vertical">
                            <h1>Dashboard</h1>
                            <h3>Dishes</h3>
                        </span>
                    </div>
                    <div className="userInfo-right">
                        <button 
                            className="primaryButton icon"
                            onClick={ viewCreateDish }
                        >
                            <RiApps2AddLine /> 
                            Create Dish
                        </button>
                    </div>
                    
                </div>
                
            </div>

            <div className="dashboard-section">

                <div className="dataCard table">
                    <div className="dataCard-header">
                        <div className="dataCard-header-section">
                            <div className="dataCard-header-left">
                                <h1>Dish Details</h1>
                            </div>
                            <div className="dataCard-header-right">
                                <div className="dataCard-tab">
                                { Object.keys(categorizedDishes)?.map((category) => (
                                    <button 
                                        key={ category }
                                        className={ dishCategory === category ? 'active' : ''} 
                                        onClick={() => handleTabClick(category)} 
                                    >
                                        { category }
                                    </button>
                                ))}                    
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="dataCard-content full">
                        <table>
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
                            { paginatedDishes?.map((dish) => (

                                <tr 
                                    key={ dish.id }
                                    className={ editingDishId === dish.id ? "activeRow" : ""}
                                >

                                    <td>
                                    { editingDishId === dish.id ? (
                                        <input
                                            type="file"
                                            name="photoURL"
                                            onChange={ handleEditChange }
                                        />
                                    ) : (
                                        <img src = { dish.photoURL } alt = { dish.name } />
                                    )}
                                    </td>
                                    <td>
                                    { editingDishId === dish.id ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={ editedDish.name }
                                            onChange={ handleEditChange }
                                        />
                                    ) : (
                                        dish.name
                                    )}
                                    </td>

                                    <td>
                                    { editingDishId === dish.id ? (
                                        <select
                                            name="menuType"
                                            value={editedDish.menuType}
                                            onChange={ handleEditChange }
                                        >
                                        {Object.keys(categorizedDishes)
                                        .filter((category) => category !== "All")
                                        .map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                        </select>
                                    ) : (
                                        dish.menuType
                                    )}
                                    </td>
                                    <td>
                                    { editingDishId === dish.id ? (
                                        <textarea
                                            name="description"
                                            value={editedDish.description}
                                            onChange={ handleEditChange }
                                        />
                                    ) : (
                                        <div className="tableCell text">
                                            {dish.description}
                                        </div>
                                    )}
                                    </td>
                                    <td>
                                    { editingDishId === dish.id ? (
                                        <input
                                            type="number"
                                            name="price"
                                            value={ editedDish.price }
                                            onChange={ handleEditChange }
                                        />
                                    ) : (
                                        <>
                                            ${ dish.price }
                                        </>
                                    )}
                                    </td>
                                    <td>
                                        <div className="tableCell centered">
                                        { editingDishId === dish.id ? (
                                            <>
                                                <button 
                                                    className="secondaryButton tooltip yellow"
                                                    onClick={() => handleEditConfirm(dish.id)}
                                                >
                                                    <span>Confirm</span>
                                                    <FaCheck/>
                                                </button>

                                                <button 
                                                    className="secondaryButton tooltip red"
                                                    onClick={ handleEditCancel }
                                                >
                                                    <span>Cancel</span>
                                                    <FaBan/>
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button 
                                                    className="secondaryButton tooltip"
                                                    onClick={() => handleEdit(dish)}
                                                >
                                                    <span>Edit</span>
                                                    <MdEdit/>
                                                </button>
                                                <button 
                                                    className="secondaryButton tooltip red"
                                                    onClick={() => handleDeleteDish(dish.id)}
                                                >
                                                    <span>Delete</span>
                                                    <FaTrashAlt/>
                                                </button>
                                            </>
                                        )} 
                                        </div> 
                                    </td>

                                </tr>

                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="dataCard-footer">
                        <div className="dataCard-footer-right">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                className={`paginationButton ${
                                    currentPage === index + 1
                                        ? 'active'
                                        : ''
                                }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        </div>
                    </div>
                </div>

            </div>

            <Modal
               isOpen={ createDishModal }
               onRequestClose={ closeCreateDish }
               className={`${ createDishModal ? 'modal-open' : '' }`}
               overlayClassName="modalOverlay" 
            >
            { createDishModal && (
                <CreateDish
                    closeCreateDish = { closeCreateDish }
                    setDishes = { setDishes }
                />
            )}
            </Modal>

        </div>
    );

};

export default StaffDishes;