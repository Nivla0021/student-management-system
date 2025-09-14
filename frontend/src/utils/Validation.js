// utils/validation.js

// simple email regex
const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

export function validateUserForm({ name, email, password, checkPassword = false }) {
  if (!name || !email || (checkPassword && !password)) {
    return "⚠️ All fields are required.";
  }
  if (!validateEmail(email)) {
    return "⚠️ Please enter a valid email address.";
  }
  return ""; // no errors
}
