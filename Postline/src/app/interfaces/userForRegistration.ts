import { Role } from '../enums/auth.enum';
export interface IUserForRegistration {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
}
