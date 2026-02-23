export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  last?: boolean;
  first?: boolean;
  numberOfElements?: number;
  empty?: boolean;
  [key: string]: any;
}
