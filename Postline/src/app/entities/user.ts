import { IUser } from '../interfaces/user/user';
import { Role } from '../enums/auth.enum';

export class User implements IUser {
  constructor(
    public id = '',
    public email = '',
    public firstName = '',
    public lastName = '',
    public userName = '',
    public role = Role.None
  ) {}

  static Build(user: IUser) {
    if (!user) {
      return new User();
    }

    return new User(
      user.id,
      user.email,
      user.firstName,
      user.lastName,
      user.userName,
      user.role as Role
    );
  }

  public get fullName(): string {
    if (!this.firstName) {
      return '';
    }

    return `${this.firstName} ${this.lastName}`;
  }

  toJSON(): object {
    const serialized = Object.assign(this);
    delete serialized._id;
    delete serialized.fullName;
    return serialized;
  }
}
