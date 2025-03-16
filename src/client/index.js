// Import the main function and event listener
import { handleSubmit } from "./js/app.js"
import "./styles/style.scss"

// Add event listener when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed")
  const form = document.getElementById("travel-form")
  if (form) {
    form.addEventListener("submit", handleSubmit)
    console.log("Event listener added to form")
  } else {
    console.error("Form element not found")
  }
})

// Export functions for use in other files
export { handleSubmit }

