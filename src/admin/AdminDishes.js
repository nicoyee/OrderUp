import "./css/AdminDishes.css";

import { RiApps2AddLine } from "react-icons/ri";
import { MdFastfood } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { FaBan } from "react-icons/fa";

import React, { useEffect, useState, useContext } from 'react';
import Modal from 'react-modal';
import { toast, Flip } from 'react-toastify';

import CreateDish from "./unused/CreateDish";

import Admin from '../class/admin/Admin.js';

const AdminDishes = () => {

    const [ dishes, setDishes ] = useState([]);
    const [ dishCategory, setDishCategory ] = useState('All');
    const [ createDishModal, showCreateDishModal ] = useState(false);
    const [ editingDishId, setEditingDishId ] = useState(null); // Track which dish is being edited
    const [ editedDish, setEditedDish ] = useState(null);

    const [ currentPage, setCurrentPage ] = useState(1);
    const ITEMS_PER_PAGE = 6;

    useEffect(() => {
        const fetchDishes = async () => {
            try {
                const dishesData = await Admin.getDishes().then((res) => {
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
        setEditedDish({
            name: dish.name,
            menuType: dish.menuType,
            description: dish.description,
            price: dish.price,
            photo: null
        });
    };

    const handleEditCancel = () => {
        setEditingDishId(null);
        setEditedDish(null);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditedDish(prev => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) : value
        }));
    };

    const handleEditConfirm = async (dishId) => {
        try {
            await Admin.editDish(dishId, {
                name: editedDish.name,
                menuType: editedDish.menuType,
                description: editedDish.description,
                price: editedDish.price,
                // If there's a new photo, we'll need to handle file upload first
                // For now, excluding photo handling to get the basic update working
            });
            
            // Update local state
            setDishes(prevDishes => 
                prevDishes.map(dish => 
                    dish.id === dishId ? { ...dish, ...editedDish } : dish
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

    return (
        <div id="adminDishes" className="dashboard-content">

            <div className="dashboard-section">

                <div className="userInfo admin">
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
                                <span className="cardTitleIcon">
                                    <MdFastfood />
                                    <h1>Dishes</h1>
                                </span>    
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
                                        <img 
                                            src = { dish.photoURL || "/placeholder-dish.png"} 
                                            alt = { dish.name }
                                            className="w-16 h-16 object-cover rounded"
                                        />
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
                                                <button 
                                                    className="secondaryButton tooltip"
                                                    onClick={() => handleEdit(dish)}
                                                >
                                                    <span>Edit</span>
                                                    <MdEdit/>
                                                </button>
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
                    isStaffSignUp={true}
                    closeModal = { closeCreateDish }
                />
            )}
            </Modal>

        </div>
    );

};

export default AdminDishes;