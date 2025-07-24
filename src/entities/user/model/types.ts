export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthToken {
  accessToken: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export interface LoginByEmailData {
  email: string;
  password: string;
}
