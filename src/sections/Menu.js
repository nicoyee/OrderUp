import '../css/Menu.css';

import React from 'react';


const Menu = () => {
  return (
    <section id = "menu"> 

      <div className="header-menu">

        <h1>menu</h1>
        <span className = "line-menu"></span>

      </div>

      <div className = "categories-wrapper">

        <div className = "menu-category m01">

          <h1>SEAFOOD</h1>

        </div>

        <div className = "menu-category m02">

          <h1>MEAT</h1>

        </div>

        <div className = "menu-category m03">

          <h1>DESSERT</h1>

        </div>

        <div className = "menu-category">

          <h1>VEGETARIAN</h1>

        </div>

      </div>
      
      

    </section>
  );
};

export default Menu;