import { handleFormSubmit as handleSubmit } from "./js/app.js"
import "./styles/style.scss"

// Event listener
document.getElementById("submit").addEventListener("click", handleSubmit)

// Export for testing
export { handleSubmit }

