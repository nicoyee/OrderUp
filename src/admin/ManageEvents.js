import '../css/common/dashboardComponents.css';
import '../css/common/dataTable.css';

import React, { useState, useEffect } from 'react';
import CreateEvent from './CreateEvent';
import EditEvent from './EditEvent';
import '../css/Admin/ManageEvents.css';
import Admin from '../class/admin/Admin';

const ManageEvents = ({ modalIsOpen, setModalIsOpen }) => {
    const [events, setEvents] = useState([]);
    const [createEventModalIsOpen, setCreateEventModalIsOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [editEventModalIsOpen, setEditEventModalIsOpen] = useState(false);

    const handleOpenEditEventModal = (event) => {
        setSelectedEvent(event);
        setEditEventModalIsOpen(true);
    };

    const handleCloseEditEventModal = () => {
        setEditEventModalIsOpen(false);
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const eventsData = await Admin.fetchEvents();
                setEvents(eventsData);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };
            fetchEvents();
    }, []);

    const handleUpdateEvent = async (updatedEvent) => {
        try {
            await Admin.updateEvent(selectedEvent.id, updatedEvent);
            setEvents(events.map(event => event.id === selectedEvent.id ? updatedEvent : event));
            setEditEventModalIsOpen(false);
        } catch (error) {
            console.error('Error updating event:', error);
        }
    };

    const handleDeleteEvent = async (eventId) => {
        try {
            await Admin.deleteEvent(eventId);
            setEvents(events.filter(event => event.id !== eventId));
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    return (
        <div className='sectionContent'>
            <div className='sectionContent-header'>
                <h1>Events</h1>
                <div className='sectionContent-header-actions'>
                <button>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>plus-box</title><path d="M17,13H13V17H11V13H7V11H11V7H13V11H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" /></svg>
                    Create Event
                </button>
                </div>
            </div>
            <div className='dataTable-container'>
                <table className='dataTable'>
                    <thead>
                        <tr>
                            <th>Event Name</th>
                            <th>Description</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event) => (
                            <tr key={event.id}>
                                <td>{event.eventName}</td>
                                <td>{event.description}</td>
                                <td>{event.location}</td>
                                <td>{event.status}</td>
                                <td>{new Date(event.date).toLocaleDateString()}</td>
                                <td>
                                    <div className='dataTable-actions'>
                                        <button onClick={() => handleOpenEditEventModal(event)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>pencil</title><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg></button>
                                        <button className='dataTable-actions-delete' onClick={() => handleDeleteEvent(event.id)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>delete</title><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {editEventModalIsOpen && (
                <EditEvent event={selectedEvent} onUpdateEvent={handleUpdateEvent} onCancel={handleCloseEditEventModal} />
            )}

            {createEventModalIsOpen && (
                <CreateEvent setEvents={setEvents} modalIsOpen={createEventModalIsOpen} setModalIsOpen={setCreateEventModalIsOpen} />
            )}

        </div>
    );
};

export default ManageEvents;
