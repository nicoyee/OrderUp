import './css/navigationButtons.css';
import menu from "../../assets/menu.svg";

import React, { useState, useEffect } from "react";

const MenuButton = ({ setAlignment = () => {}, setLandingContent = () => {} }) => {
  
    const [hovered, setHovered] = useState('');

    const handleClick = () => {
        setLandingContent('menu');
    };

    return (
        <div className='navigationButtons navLeft'>
            <img src={ menu } className={`tagLine menuTag ${hovered}`} />
            <div 
                className='navMenu'

                onClick={ handleClick }

                onMouseEnter={() => {
                    setAlignment('right');
                    setHovered('right');
                }} 

                onMouseLeave={() => {
                    setAlignment('centerRight');
                    setHovered('');
                }}
            >
                <h1>Menu</h1>
                <h2><span>//</span> Menu</h2>
            </div>
        </div>
    );
};

export default MenuButton;