// Validation utilities for authentication forms

export const validators = {
  // Email validation
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Password validation - minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number
  isValidPassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  },

  // Simple password strength check (returns score 0-3)
  getPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    
    return strength;
  },

  // Get password strength label
  getPasswordStrengthLabel(password) {
    const strength = this.getPasswordStrength(password);
    if (strength === 0 || strength === 1) return 'Weak';
    if (strength === 2) return 'Fair';
    if (strength === 3) return 'Good';
    return 'Strong';
  },

  // Name validation
  isValidName(name) {
    return name.trim().length >= 2;
  },

  // Get validation error message
  getErrorMessage(field, value) {
    switch (field) {
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!this.isValidEmail(value)) return 'Please enter a valid email address';
        return '';
      
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/[a-z]/.test(value)) return 'Password must contain lowercase letters';
        if (!/[A-Z]/.test(value)) return 'Password must contain uppercase letters';
        if (!/\d/.test(value)) return 'Password must contain numbers';
        if (!/[@$!%*?&]/.test(value)) return 'Password must contain special characters (@$!%*?&)';
        return '';
      
      case 'name':
        if (!value.trim()) return 'Full name is required';
        if (!this.isValidName(value)) return 'Name must be at least 2 characters';
        return '';
      
      default:
        return '';
    }
  },
};
