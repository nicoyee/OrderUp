import React, { useState, useEffect } from 'react'
import { db, storage } from '../firebase'
import { ref, uploadBytes, getDownloadURL, list } from 'firebase/storage'
import { collection, getDocs } from 'firebase/firestore'
import '../css/authForms.css'

import CreateDish from './CreateDish';
import { Button } from 'react-scroll';
import Modal from 'react-modal';


const MenuAdmin = () => {
  const [dishes, setDishes] = useState([]);
  const [modal, showModal]  = useState(false);
  const [ modalContent, setModalContent ] = useState('createDish');
  
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

  return (
    <div className="menu-admin">
           
        <h1>Menu Admin</h1>
        
        <table>
            <thead>
            <Modal 
                isOpen = {modal}
                onRequestClose={closeModal}
                className={`createDishModal ${modal ? 'modal-open' : ''}`}
                overlayClassName="modalOverlay"
                >
                { modalContent === "createDish" && ( <CreateDish closeModal={ closeModal } /> )}
            </Modal>

            <Button onClick={openModal}>
                    Create Dish
            </Button> 
                <tr>
                    <th>Name</th>
                    <th>Menu Type</th>
                    <th>Description</th>
                    <th>Photo</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                {dishes.map((dish) => (
                    <tr key={dish.id}>
                        <td>{dish.name}</td>
                        <td>{dish.menuType}</td>
                        <td>{dish.description}</td>
                        <td><img src={dish.photo} alt={dish.name} width="100" /></td>
                        <td>{dish.price}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}

export default MenuAdmin