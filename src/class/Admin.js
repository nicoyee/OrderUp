import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

class Admin {
  async createDish(name, description, price, photo, menuType) {
    try {
      let photoURL = '';
      if (photo) {
        const storageRef = ref(storage, `dishes/${photo.name}`);
        await uploadBytes(storageRef, photo);
        photoURL = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, 'dishes'), {
        name,
        description,
        price: parseFloat(price),
        photoURL,
        menuType
      });

      return true;
    } catch (error) {
      console.error('Error adding dish:', error);
      return false;
    }
  }
}

export default Admin;