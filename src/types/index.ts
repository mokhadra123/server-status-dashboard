export type ServerStatus = 'up' | 'down' | 'degraded';

export interface Server {
  id: string;
  name: string;
  ipAddress: string;
  status: ServerStatus;
  responseTime: number;
  uptime: number;
  lastChecked: string;
  location: string;
  responseHistory: number[];
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

export type SortField = 'name' | 'status' | 'responseTime' | 'uptime';
export type SortDirection = 'asc' | 'desc';
export type StatusFilter = ServerStatus | 'all';
export type ViewMode = 'card' | 'table';
