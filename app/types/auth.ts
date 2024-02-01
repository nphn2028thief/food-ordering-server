import { ERole } from '../constants/role';

export interface IUser {
  displayName: string;
  email: string;
  password: string;
  role: ERole;
  refreshToken: string | null;
}

export interface ISignUp {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ISignIn {
  email: string;
  password: string;
}

export interface IUserDecode {
  id: string;
  role: ERole;
}

export interface IJwtPayload {
  user: IUserDecode;
  iat: number;
  exp: number;
}
