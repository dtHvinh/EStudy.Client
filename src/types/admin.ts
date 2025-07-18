export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  level: string;
  joinDate: string;
  lastActive: string;
  contentCount: number;
  reportsCount: number;
  warningsCount: number;
}

export interface Role {
  id: string;
  name: string;
}

export interface StatusOption {
  value: string;
  label: string;
}
