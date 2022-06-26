import { Role } from '../enums/auth.enum';
import { IAuthStatus } from '../interfaces/authStatus';

export const defaultAuthStatus: IAuthStatus = {
  isAuthenticated: false,
  userRole: Role.None,
  userId: '',
};
