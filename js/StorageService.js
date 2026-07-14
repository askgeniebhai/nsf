"use strict";

const StorageService = (() => {
    const save = (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
    };

    const load = (key, defaultValue) => {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    };

    const removeItem = (key) => {
        localStorage.removeItem(key);
    };

    return { save, load, removeItem };
})();
