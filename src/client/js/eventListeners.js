import { handleSubmit } from './app.js';

function addEventListeners() {
    // Add event listener to the travel form
    const form = document.getElementById('travel-form');
    if (form) {
        form.addEventListener('submit', handleSubmit);  // Attach handleSubmit function to form submit event
    }

}

export { addEventListeners };
