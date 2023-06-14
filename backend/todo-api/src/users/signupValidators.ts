export function validateEmail(email: string): boolean {
  // Implement your email validation logic here
  // You can use regular expressions or any other method to validate the email format
  // Return true if the email is valid, false otherwise
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password: string): boolean {
  // Implement your password validation logic here
  // Check the length, symbols, or any other requirements for a valid password
  // Return true if the password is valid, false otherwise
  return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
}