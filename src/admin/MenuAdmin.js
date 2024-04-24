import React, { useState, useEffect } from 'react'
import { db, storage } from '../firebase'
import { ref, getDownloadURL} from 'firebase/storage'
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import '../css/authForms.css'

import CreateDish from './CreateDish';
import { Button } from 'react-scroll';
import Modal from 'react-modal';

const MenuAdmin = () => {
  const [dishes, setDishes] = useState([]);
  const [modal, showModal]  = useState(false);
  const [ modalContent, setModalContent ] = useState('createDish');
  const [currentPage, setCurrentPage] = useState(1);
  const dishesPerPage = 10;
  const [dishToEdit, setDishToEdit] = useState(null);

  const openModal = () => {
      showModal(true);
      document.body.classList.add('modal-open');
  };

  const closeModal = () => {
      showModal(false);
      document.body.classList.remove('modal-open');
  };

  const setCreateDishModal = () => {
      setModalContent('createDish');
  };

  useEffect(() => {
    const getDishes = async () => {
        const querySnapshot = await getDocs(collection(db, 'dishes'))
        const dishesData = []
        querySnapshot.forEach((doc) => {
            const photoRef = ref(storage, `dishes/${doc.data().photo}`)
            getDownloadURL(photoRef).then((photoURL) => {
            dishesData.push({ id: doc.id,...doc.data(), photo: photoURL })
            if (dishesData.length === querySnapshot.size) {
                setDishes(dishesData)
            }
            }).catch((error) => {
            console.log(error)
            dishesData.push({ id: doc.id,...doc.data(), photo: '' })
            if (dishesData.length === querySnapshot.size) {
                setDishes(dishesData)
            }
            })
        })
    }
    getDishes()
  }, [])

  const indexOfLastDish = currentPage * dishesPerPage;
  const indexOfFirstDish = indexOfLastDish - dishesPerPage;
  const currentDishes = dishes.slice(indexOfFirstDish, indexOfLastDish);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEdit = (dish) => {
    setModalContent('editDish');
    setDishToEdit(dish);
  }

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'dishes', id));
    const newDishes = dishes.filter((dish) => dish.id!== id);
    setDishes(newDishes);
  }

  const handleSaveEdit = async (updatedDish) => {
    await updateDoc(doc(db, 'dishes', updatedDish.id), updatedDish);
    const newDishes = dishes.map((dish) => dish.id === updatedDish.id? updatedDish : dish);
    setDishes(newDishes);
    closeModal();
  }

  return (
    <div className="menu-admin">

        <h1>Menu Admin</h1>

        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Menu Type</th>
                    <th>Description</th>
                    <th>Photo</th>
                    <th>Price</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {currentDishes.map((dish) => (
                    <tr key={dish.id}>
                        <td>{dish.name}</td>
                        <td>{dish.menuType}</td>
                        <td>{dish.description}</td>
                        <td><img src={dish.photo} alt={dish.name} width="100" height="100" /></td>
                        <td>{dish.price}</td>
                        <td>
                            <button onClick={() => handleEdit(dish)}>Edit</button>
                            <button onClick={() => handleDelete(dish.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>

        <div className="pagination">
            {dishes.length > dishesPerPage && (
                <div>
                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                    {Array.from({ length: Math.ceil(dishes.length / dishesPerPage) }, (_, i) => (
                        <button key={i + 1} onClick={() => paginate(i + 1)} className={currentPage === i + 1? 'active' : ''}>
                            {i + 1}
                        </button>
                    ))}
                    <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(dishes.length / dishesPerPage)}>Next</button>
                </div>
            )}
        </div>

        <div className="button-container">
            <Button
                className="button"
                onClick={openModal}
                to="createDish"
                spy={true}
                smooth={true}
                duration={500}
                >
                Create Dish
            </Button>
        </div>

        <Modal
            isOpen={modal}
            onRequestClose={closeModal}
            className={`createDishModal ${modal? 'modal-open' : ''}`}
            overlayClassName="modalOverlay"
            >
            { modalContent === "createDish" && ( <CreateDish closeModal={ closeModal } />)}
            { modalContent === "editDish" && (
                <CreateDish
                    closeModal={closeModal}
                    dish={dishToEdit}
                    handleSaveEdit={handleSaveEdit}
                />
            )}
        </Modal>

    </div>
  )
}

export default MenuAdmin