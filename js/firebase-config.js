/**
 * MealFlow Offline Mock Configuration
 * -----------------------------------
 * Firebase has been temporarily disabled to prevent console errors
 * since the Firestore API is not enabled on the Google Cloud project.
 */

// Mock DB object to trigger local storage fallback gracefully
window.db = {
    settings: function() {},
    collection: function(name) {
        return {
            add: function() { return Promise.reject(new Error("Offline Mode")); },
            get: function() { return Promise.reject(new Error("Offline Mode")); },
            where: function() { 
                return { 
                    limit: function() { 
                        return { get: function() { return Promise.resolve({ empty: true }); } } 
                    } 
                } 
            }
        };
    }
};

