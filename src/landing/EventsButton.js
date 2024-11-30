import './css/navigationButtons.css';
import events from "../assets/events.svg";

import React, { useState, useEffect } from "react";

const EventsButton = ({ setAlignment = () => {}, setLandingContent = () => {} }) => {
  
    const [hovered, setHovered] = useState('');

    const handleClick = () => {
        setLandingContent('event');  // Set landing content to 'event'
    }

    return (
        <div className='navigationButtons navRight'>
            <img src={ events } className={`tagLine eventsTag ${hovered}`} />
            <div 
                className='navEvents'
                onClick={handleClick}
                onMouseEnter={() => {
                    setAlignment('left');
                    setHovered('left');
                }} 
                onMouseLeave={() => {
                    setAlignment('centerLeft');
                    setHovered('');
                }}
            >
                <h1>Events</h1>
                <h2><span>//</span> Events</h2>
            </div>
        </div>
    );
};

export default EventsButton;