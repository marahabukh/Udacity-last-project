// Import the main function and event listener
import { handleSubmit } from "./js/app.js";
import "./styles/style.scss";

// Add event listener to the form submit
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("travel-form");

  if (form) {
    form.addEventListener("submit", handleSubmit); // Using submit instead of click for form submissions
  }
});

export { handleSubmit };
