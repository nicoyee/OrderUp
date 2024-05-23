import '../../css/objects/customer/CustomerCart.css';
import food from "../../assets/foodplaceholder.png";

import React, { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
} from '@chakra-ui/react';

import { MdShoppingCart } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";

const CustomerCart = () => {

  return (
    <div id='customerCart'>
      <Popover
        id='customerCart'
        placement='left-end'
      >
        <PopoverTrigger>
          <button><MdShoppingCart /></button>
        </PopoverTrigger>   

        <PopoverContent >

          <PopoverHeader>
            <h1>Your Cart</h1>
          </PopoverHeader>

          <PopoverArrow bg='#151515'/>

          <PopoverBody>
            <div className='cartItemList'>

              <h2>999</h2>
              <img src={ food } />
              <span>
                <h3>Pork Sisig Lorem Ipsum Pork Sisig</h3>
              </span>
              <FaTrashAlt />

            </div>
          </PopoverBody>

          <PopoverFooter>
            <a>Check Out</a>
          </PopoverFooter>

        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CustomerCart;