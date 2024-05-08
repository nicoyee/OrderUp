import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc,doc, deleteDoc } from 'firebase/firestore';
import { storage, db } from '../firebase';

class Dish {
  constructor(name, menuType, description, price, photo) {
    this.name = name;
    this.menuType = menuType;
    this.description = description;
    this.price = parseFloat(price);
    this.photo = photo;
  }

  async uploadPhoto() {
    try {
      if (this.photo) {
        const storageRef = ref(storage, `dishes/${this.photo.name}`);
        await uploadBytes(storageRef, this.photo);
        return getDownloadURL(storageRef);
      }
      return '';
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  }

  async saveToDatabase() {
      try {
      const photoURL = await this.uploadPhoto();
      await addDoc(collection(db, 'dishes'), {
          name: this.name,
          description: this.description,
          price: this.price,
          photoURL,
          menuType: this.menuType
      });
      } catch (error) {
      console.error('Error saving dish to database:', error);
      throw error;
      }
  }
}

class MeatDish extends Dish {
  constructor(name, description, price, photo) {
    super(name, 'Meat', description, price, photo);
  }
}

class VegetarianDish extends Dish {
  constructor(name, description, price, photo) {
    super(name, 'Vegetarian', description, price, photo);
  }
}

class DessertDish extends Dish {
  constructor(name, description, price, photo) {
    super(name, 'Dessert', description, price, photo);
  }
}

class SeafoodDish extends Dish {
  constructor(name, description, price, photo) {
    super(name, 'Seafood', description, price, photo);
  }
}

export { Dish, MeatDish, VegetarianDish, DessertDish, SeafoodDish };
