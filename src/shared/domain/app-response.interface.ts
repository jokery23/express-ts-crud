export interface AppResponseInterface<T> {
  data: T;
  errors?: string[];
}