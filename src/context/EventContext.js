// src/context/EventContext.js
import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useApi } from '@/hooks/useApi';

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const api = useApi();
  const abortControllerRef = useRef(null);
  const lastFetchTimeRef = useRef(0);
  const isFetchingRef = useRef(false);

  const formatEventDate = (event) => {
    if (!event) return event;
    
    try {
      const formattedEvent = { ...event };
      
      if (formattedEvent.date) {
        if (!isNaN(new Date(formattedEvent.date).getTime())) {
          formattedEvent.date = new Date(formattedEvent.date).toISOString();
        } else {
          console.warn("Invalid date format in event:", formattedEvent.date);
        }
      }
      
      return formattedEvent;
    } catch (error) {
      console.error("Error formatting event date:", error);
      return event;
    }
  };

  const formatDateForMySQL = (dateString) => {
    if (!dateString) return null;
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn("Invalid date for MySQL formatting:", dateString);
        return null;
      }
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } catch (error) {
      console.error("Error formatting date for MySQL:", error);
      return null;
    }
  };

  const fetchEvents = useCallback(async () => {
    if (isFetchingRef.current) {
      return;
    }

    const now = Date.now();
    if (now - lastFetchTimeRef.current < 2000) {
      return;
    }
    lastFetchTimeRef.current = now;

    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/api/events');
      const formattedEvents = response.data.map(formatEventDate);
      setEvents(formattedEvents);
    } catch (err) {
      if (err.message !== 'canceled' && err.name !== 'AbortError') {
        const errorMessage = err.response?.data?.message || 
                            err.message || 
                            'Failed to fetch events';
        console.error('Full fetch error:', {
          message: errorMessage,
          status: err.response?.status,
          data: err.response?.data,
          config: err.config
        });
        setError(errorMessage);
        setEvents([]);
      }
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [api]);

  const addEvent = async (eventData) => {
    try {
      const formattedEventData = {
        ...eventData,
        date: formatDateForMySQL(eventData.date)
      };
      
      const response = await api.post('/api/events', formattedEventData);
      const formattedEvent = formatEventDate(response.data);
      setEvents(prev => [formattedEvent, ...prev]);
      return formattedEvent;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to add event';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateEvent = async (eventId, updates) => {
    try {
      let formattedUpdates = { ...updates };
      
      if (updates.date) {
        formattedUpdates.date = formatDateForMySQL(updates.date);
      }
      
      const response = await api.put(`/api/events/${eventId}`, formattedUpdates);
      
      const formattedEvent = formatEventDate(response.data);
      setEvents(prev => prev.map(e => e.eventId === eventId ? formattedEvent : e));
      return formattedEvent;
    } catch (err) {
      console.error("Error updating event:", err);
      
      const errorMessage = err.response?.data?.message || 'Failed to update event';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      await api.delete(`/api/events/${eventId}`);
      setEvents(prev => prev.filter(e => e.eventId !== eventId));
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete event';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return (
    <EventContext.Provider
      value={{
        events,
        loading,
        error,
        fetchEvents,
        addEvent,
        updateEvent,
        deleteEvent,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};