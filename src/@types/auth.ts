import { City } from ".";

export type SignInCredential = {
  login: string;
  password: string;
};

export type userRole = {
  id: number;
  name: string;
  deleted: boolean;
  permissions: { key: string; value: boolean };
};

export type SignInResponse = {
  token: string;
  employee: {
    id: string;
    login: string;
    authority: string[];
    avatar: string;
    email: string;
    role: userRole;
    full_name: string;
    status: { [key: string]: string };
  };
  city: City;
  expires_at: {
    date: string;
    type: number;
    timezone: string;
  };
  websockets: {
    [key: string]: string;
  };
  rating: {
    daily: number;
    weekly: number;
    monthly: number;
  };
};

export type SignUpResponse = SignInResponse;

export type SignUpCredential = {
  login: string;
  email: string;
  password: string;
};

export type ForgotPassword = {
  email: string;
};

export type ResetPassword = {
  password: string;
};
