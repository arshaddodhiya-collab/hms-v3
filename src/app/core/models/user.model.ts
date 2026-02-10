export interface User {
  id: number;
  username: string;
  fullName: string;
  departmentName?: string;
  departmentId?: number;
  roles: string[];
  active: boolean;
  password?: string;
}
