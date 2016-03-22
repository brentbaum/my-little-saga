"use strict";

class EventDispatcher {
    constructor() {
        this.listeners = new Map();
    }
    addEventListener(listener, eventType) {
        var eventListeners = this.listeners.get(eventType) || [];
        eventListeners.push(listener);
        this.listeners.set(eventType, eventListeners);
    }
    removeEventListener(listener, eventType) {
        var eventListeners = this.listeners.get(eventType) || [];
        eventListeners = eventListeners.filter(l => l.id !== listener.id);
        this.listeners.set(eventType, eventListeners);
    }
    dispatchEvent(event) {
        var eventListeners = this.listeners.get(event.eventType) || [];
        eventListeners.forEach(l => l.handleEvent(event));
    }
    hasEventListener(listener, eventType) {
        var eventListeners = this.listeners.get(eventType) || [];
        return eventListeners.some(l => l.id === listener.id);
    }
}
