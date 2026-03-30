import api from './axios';
import type { Category, CategoryType } from '../types';

export const onboardingApi = {
  complete: () =>
    api.patch<{ ok: boolean }>('/users/onboarding').then((r) => r.data),

  createCategories: (categories: { name: string; type: CategoryType }[]) =>
    api.post<Category[]>('/categories/bulk', { categories }).then((r) => r.data),
};
