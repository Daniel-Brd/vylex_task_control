import { randomUUID } from 'crypto';

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

  static create(props: {
    name: string;
    email: string;
    password: string;
  }): User {
    return new User({
      id: randomUUID(),
      name: props.name,
      email: props.email,
      password: props.password,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
