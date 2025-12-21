import { api } from '@/config/axios';
import type {
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
  AuthResponse,
  User,
} from '@repo/api';

export async function register(data: RegisterDto): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/register', data);
  return response.data;
}

export async function login(data: LoginDto): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
}

export async function refreshTokens(
  data: RefreshTokenDto
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/refresh', data);
  return response.data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

export async function getCurrentUser(): Promise<
  Omit<User, 'password' | 'refreshToken'>
> {
  const response = await api.get<Omit<User, 'password' | 'refreshToken'>>(
    '/auth/me'
  );
  return response.data;
}
