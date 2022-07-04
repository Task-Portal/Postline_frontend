import { Role } from '../../enums/auth.enum';
export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
  role?: Role | string;
  readonly fullName?: string;
}
