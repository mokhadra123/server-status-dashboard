import { z } from 'zod';

export const LoginFormSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

export const SignupFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .regex(/[a-zA-Z]/, 'Must contain at least one letter.')
    .regex(/\d/, 'Must contain at least one number.')
    .regex(/[^a-zA-Z\d]/, 'Must contain at least one special character.'),
});

export type FormState = {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
};
