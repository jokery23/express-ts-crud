import { AppErrorInterface } from './app-error.interface';

export interface AppResponseInterface<T> {
  data: T;
  errors?: AppErrorInterface[];
}
