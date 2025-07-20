import { randomUUID } from 'crypto';
import { IPasswordHasher } from '../auth/password-hasher.port';

export class User {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;
  public readonly password: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: User) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static async create(
    props: {
      name: string;
      email: string;
      password: string;
    },
    hasher: IPasswordHasher,
  ): Promise<User> {
    const hashedPassword = await hasher.hash(props.password);
    return new User({
      id: randomUUID(),
      name: props.name,
      email: props.email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
