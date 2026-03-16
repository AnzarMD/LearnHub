export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isStrongPassword = (password) =>
  password.length >= 8 &&
  /[A-Z]/.test(password) &&
  /[0-9]/.test(password);

export const isRequired = (value) =>
  value !== undefined && value !== null && String(value).trim() !== "";

export const validateLoginForm = ({ email, password }) => {
  const errors = {};
  if (!isRequired(email))    errors.email    = "Email is required.";
  else if (!isValidEmail(email)) errors.email = "Enter a valid email address.";
  if (!isRequired(password)) errors.password = "Password is required.";
  return errors;
};

export const validateRegisterForm = ({ name, email, password, confirmPassword }) => {
  const errors = {};
  if (!isRequired(name))     errors.name = "Full name is required.";
  if (!isRequired(email))    errors.email = "Email is required.";
  else if (!isValidEmail(email)) errors.email = "Enter a valid email address.";
  if (!isRequired(password)) errors.password = "Password is required.";
  else if (!isStrongPassword(password))
    errors.password = "Password must be ≥8 chars, include a number and uppercase.";
  if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match.";
  return errors;
};

export const hasErrors = (errorsObj) =>
  Object.keys(errorsObj).length > 0;
