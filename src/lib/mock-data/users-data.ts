import { User } from "@/types";

export interface MockUser extends User {
    password: string;
  }
export const mockUsers: MockUser[] = [
    {
      id: 'usr-001',
      name: 'Mohamed Khadra',
      email: 'admin@xorithm.com',
      password: 'Admin123!',
    },
    {
      id: 'usr-002',
      name: 'Jane Engineer',
      email: 'jane@xorithm.com',
      password: 'Jane2024!',
    },
  ];
  