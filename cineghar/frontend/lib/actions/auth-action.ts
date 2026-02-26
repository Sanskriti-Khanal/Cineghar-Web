'use client';

import { registerUserApi, loginUserApi } from '@/lib/api/auth';
import { setAuthToken, setUserData } from '@/lib/cookie';

export async function handleRegister(registrationData: {
  name: string;
  email: string;
  password: string;
  dateOfBirth?: string;
}) {
  try {
    const result = await registerUserApi(registrationData);

    if (result.success) {
      return {
        success: true,
        message: 'Registration successful',
        data: result.data,
      };
    }

    return {
      success: false,
      message: result.message || 'Registration failed',
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function handleLogin(loginData: {
  email: string;
  password: string;
  rememberMe?: boolean;
}) {
  try {
    const result = await loginUserApi({
      email: loginData.email,
      password: loginData.password,
    });

    await setAuthToken(result.token, loginData.rememberMe);
    await setUserData(result.user, loginData.rememberMe);

    return {
      success: true,
      message: result.message ?? 'Login successful',
      data: result.user,
    };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: error.message || 'Login failed' };
  }
}

