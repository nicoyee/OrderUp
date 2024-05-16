import { MenuType } from '../constants';

class Dish {
  constructor(name, menuType, description, price, photo) {
    this.name = name;
    this.menuType = menuType;
    this.description = description;
    this.price = parseFloat(price);
    this.photo = photo;
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

//TODO: Update MenuType, do not hardcode
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
