import React, { useState, useEffect } from 'react';
import CreateEvent from './CreateEvent';
import EditEvent from './EditEvent';
import '../css/Admin/ManageEvents.css';
import AdminController from '../class/admin/AdminController';

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
                const eventsData = await AdminController.fetchEvents();
                setEvents(eventsData);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        if (modalIsOpen) {
            fetchEvents();
        }
    }, [modalIsOpen]);

    const handleUpdateEvent = async (updatedEvent) => {
        try {
            await AdminController.updateEvent(selectedEvent.id, updatedEvent);
            setEvents(events.map(event => event.id === selectedEvent.id ? updatedEvent : event));
            setEditEventModalIsOpen(false);
        } catch (error) {
            console.error('Error updating event:', error);
        }
    };

    const handleDeleteEvent = async (eventId) => {
        try {
            await AdminController.deleteEvent(eventId);
            setEvents(events.filter(event => event.id !== eventId));
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    return (
        <>
            {modalIsOpen && (
                <div className="manage-events-modal">
                    <div className='modal-content'>
                        <span className='close' onClick={() => setModalIsOpen(false)}>&times;</span>
                        <div className="modal-header">
                            <h1>Manage Events</h1>
                        </div>
                        <div className="event-list">
                            <table>
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
                                                <button className="edit-event-button" onClick={() => handleOpenEditEventModal(event)}>Edit</button>
                                                <button className="delete-event-button" onClick={() => handleDeleteEvent(event.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="button-container">
                            <button className="create-event-button" onClick={() => setCreateEventModalIsOpen(true)}>Create Event</button>
                        </div>
                    </div>
                </div>
            )}

            {editEventModalIsOpen && (
                <EditEvent event={selectedEvent} onUpdateEvent={handleUpdateEvent} onCancel={handleCloseEditEventModal} />
            )}

            {createEventModalIsOpen && (
                <CreateEvent setEvents={setEvents} modalIsOpen={createEventModalIsOpen} setModalIsOpen={setCreateEventModalIsOpen} />
            )}
        </>
    );
};

export default ManageEvents;
