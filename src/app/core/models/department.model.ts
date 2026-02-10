export interface Department {
  id: number;
  name: string;
  description: string;
  headOfDepartmentId?: number;
  headOfDepartmentName?: string;
  staffCount: number;
  active: boolean;
}
