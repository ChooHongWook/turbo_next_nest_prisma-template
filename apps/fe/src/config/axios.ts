import axios, { AxiosInstance, AxiosError } from 'axios';
import { setupAuthInterceptors } from '@/lib/auth/axios-interceptors';

interface IError {
  code: number;
  error: string;
  message: string;
}

export type TAxiosError = AxiosError<IError>;

const baseURL =
  process.env.NODE_ENV !== 'production'
    ? 'http://localhost:3000'
    : process.env.NEXT_PUBLIC_SERVER_URL;

export const api: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true, // 세션 쿠키를 자동으로 포함
});

setupAuthInterceptors(api);
