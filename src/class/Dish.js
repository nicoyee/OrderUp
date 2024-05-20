import { MenuType } from '../constants';
import Firebase from './firebase.ts';
class Dish {
  constructor(name, menuType, description, price, photo) {
    this.name = name;
    this.menuType = menuType;
    this.description = description;
    this.price = parseFloat(price);
    this.photo = photo;
  }

  static async getDishes(){
    const firebase = Firebase.getInstance();
    
    return firebase.getDocuments('dishes');
  }
}

class MeatDish extends Dish {
  constructor(name, description, price, photo) {
    super(name, MenuType.MEAT, description, price, photo);
  }
}

class VegetarianDish extends Dish {
  constructor(name, description, price, photo) {
    super(name, MenuType.VEGETARIAN, description, price, photo);
  }
}

class DessertDish extends Dish {
  constructor(name, description, price, photo) {
    super(name, MenuType.DESSERT, description, price, photo);
  }
}

class SeafoodDish extends Dish {
  constructor(name, description, price, photo) {
    super(name, MenuType.SEAFOOD, description, price, photo);
  }
}

export { Dish, MeatDish, VegetarianDish, DessertDish, SeafoodDish };
