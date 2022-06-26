import { IUser } from '../interfaces/user';
import { Role } from '../enums/auth.enum';
import { IUserForRegistration } from '../interfaces/userForRegistration';

export class UserForRegistration implements IUserForRegistration {
  public firstName = '';
  public lastName = '';
  public userName = '';
  public password = '';
  public email = '';

  constructor(
    firstName: string,
    lastName: string,
    userName: string,
    password: string,
    email: string
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.userName = userName;
    this.password = password;
    this.email = email;
  }
}
