'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { signIn, signUp } from '@/lib/auth';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Basic validation
  if (!email || !password) {
    return {
      error: 'Email and password are required'
    };
  }

  // Call your API to authenticate user
  const response = await signIn(email, password);

  if (response.success && response.token) {
    // Await the cookies object before calling .set()
    const cookieStore = await cookies();

    // Set the JWT token in cookies
    cookieStore.set('jwt_token', response.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    // Store user data in cookies if needed
    cookieStore.set('user_data', JSON.stringify(response.user), {
      httpOnly: false, // Can be accessed by client if needed
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    // Redirect to dashboard after successful login
    redirect('/dashboard');
  } else {
    return {
      error: response.message || 'Invalid credentials'
    };
  }
}

export async function register(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  // Basic validation
  if (!email || !password || !name) {
    return {
      error: 'All fields are required'
    };
  }

  // Call your API to register user
  const response = await signUp(email, password, name);

  if (response.success && response.token) {
    // Await the cookies object before calling .set()
    const cookieStore = await cookies();

    // Set the JWT token in cookies
    cookieStore.set('jwt_token', response.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    // Store user data in cookies
    cookieStore.set('user_data', JSON.stringify(response.user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    // Redirect to dashboard after successful registration
    redirect('/dashboard');
  } else {
    return {
      error: response.message || 'Registration failed'
    };
  }
}