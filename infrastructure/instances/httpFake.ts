// src/infrastructure/instances/httpAxios.ts

import { responseMock } from '@mocks/responseMock';
import { Http } from '../../domain/repositories/Http';

export const httpFake: Http = {
  get: async <T>(path: string, params?: Record<string, any>, config?: any) => {
    const response = await responseMock;
    return response;
  },
  post: async <T>(path: string, params?: Record<string, any>, config?: any) => {
    const response = await responseMock;
    return response;
  },
  put: async <T>(
    path: string,
    params?: Record<string, any>,
    config?: any
  ) => {},
  delete: async <T>(path: string, params?: any, config?: any) => {},
};
