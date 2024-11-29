import './css/CustomerEvents.css';
import '../common/css/embla.css';

import { MdOutlineDateRange } from "react-icons/md";
import { GrMapLocation } from "react-icons/gr";
import { TbLocation } from "react-icons/tb";
import { TbCurrentLocation } from "react-icons/tb";



import React, { useState, useContext, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { format } from 'date-fns';

import Customer from '../class/Customer.ts';

const CustomerEvents = () => {

    // Carousel
    const OPTIONS = { align: 'start' };
    const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS);

    const [ loading, setLoading ] = useState(true);
    const [ events, setEvents ] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const eventsData = await Customer.fetchEvents();
                if (eventsData) {
                    const activeEvents = eventsData.filter(event => event.status !== 'completed');
                    setEvents(activeEvents);
                } else {
                    console.error('Fetched events data is undefined or null:', eventsData);
                }
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    return (
        <div id='customerEvents' className='dashboard-content'>
            <div className='dashboard-section__header'>
                <h1>Our Events</h1>
                <p>Great food, great friends, and great moments await. Check out our upcoming events and join the fun!</p>
            </div>
            
            <div className='dashboard-section'>
                <section className="customerEvents__carousel">
                    <div className="customerEvents__carousel-viewport" ref={emblaRef}>
                        <div className="customerEvents__carousel-container">
                        { events.map((event) => (
                            
                            <div className="customerEvents__carousel-slide" key={ event.id }>
                                <div className="customerEvents__carousel-slide-img">
                                    <img src = { event.photoURL } alt = { event.name } />
                                </div>
                                <div className="customerEvents__carousel-slide-text">
                                    <div className='customerEvents__carousel-slide-text-name'>
                                        <h1>{ event.eventName }</h1>
                                    </div>

                                    <div className='customerEvents__carousel-slide-text-description'>
                                        <p>{ event.description }</p>
                                    </div>

                                    <div className='customerEvents__carousel-slide-text-info'>
                                        <span><MdOutlineDateRange /> <h2>{ format(new Date(event.date), 'MMMM d yyyy') }</h2> </span>
                                        <h2>·</h2>
                                        <span><GrMapLocation /> <h2>{ event.location }</h2> </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                </section>
            </div>

        </div>
    );
};

export default CustomerEvents;
