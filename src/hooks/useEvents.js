// src/hooks/useEvents.js
import { useEffect } from 'react';
import { useEvent } from '@/context/EventContext';

export const useEvents = () => {
  const {
    events,
    loading,
    error,
    fetchEvents,
    addEvent,
    updateEvent,
    deleteEvent,
  } = useEvent();

  // Auto-fetch on mount
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    refreshEvents: fetchEvents,
  };
};