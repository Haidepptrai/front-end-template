export interface Category {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt?: string;
}

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Electronics',
    slug: 'electronics',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Home Appliances',
    slug: 'home-appliances',
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Furniture',
    slug: 'furniture',
    createdAt: new Date().toISOString(),
  },
];
