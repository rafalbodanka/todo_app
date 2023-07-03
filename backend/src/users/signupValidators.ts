import { BadRequestException } from '@nestjs/common';

export function validateName(firstName: string, lastName: string): boolean {
  if (firstName.length > 46 || lastName.length > 46) {
    throw new BadRequestException("Name can't be longer that 46 characters.");
  }
  return;
}

export function validateEmail(email: string): boolean {
  if (email.length < 5 || email.length > 100) {
    throw new BadRequestException(
      'Email must be between 5 and 100 characters.',
    );
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password: string): boolean {
  if (password.length < 8 || password.length > 30) {
    throw new BadRequestException(
      'Password must be between 8 and 30 characters.',
    );
  }
  return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
}
