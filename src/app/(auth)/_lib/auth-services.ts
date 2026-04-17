'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { mockUsers, type MockUser } from '@/lib/mock-data/users-data';

import { LoginFormSchema, SignupFormSchema } from './auth-validations';
import type { FormState } from './auth-validations';

const SESSION_COOKIE = 'session';

function setSession(user: MockUser) {
  const session = JSON.stringify({ id: user.id, name: user.name, email: user.email });
  return cookies().then((store) => {
    store.set(SESSION_COOKIE, session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
  });
}

export async function login(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { email, password } = parsed.data;
  const user = mockUsers.find((u) => u.email === email && u.password === password);

  if (!user) {
    return { message: 'Invalid email or password.' };
  }

  await setSession(user);
  redirect('/dashboard');
}

export async function signup(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { name, email, password } = parsed.data;
  const exists = mockUsers.some((u) => u.email === email);

  if (exists) {
    return { message: 'An account with this email already exists.' };
  }

  const newUser: MockUser = {
    id: `usr-${Date.now()}`,
    name,
    email,
    password,
  };

  mockUsers.push(newUser);
  await setSession(newUser);
  redirect('/dashboard');
}

export async function logout() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect('/login');
}

