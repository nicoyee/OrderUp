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