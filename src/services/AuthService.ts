import ApiService from "./ApiService";
import type {
  SignInCredential,
  SignUpCredential,
  ForgotPassword,
  ResetPassword,
  SignInResponse,
  SignUpResponse,
} from "@/@types/auth";

export async function apiSignIn(data: SignInCredential) {
  return ApiService.fetchData<SignInResponse>({
    url: "/api/auth/login",
    // url: "/login",
    method: "post",
    data,
  });
}

export async function apiSignUp(data: SignUpCredential) {
  return ApiService.fetchData<SignUpResponse>({
    url: "/api/auth/register",
    // url: "sign-up",
    method: "post",
    data,
  });
}

export async function apiSignOut() {
  return ApiService.fetchData({
    url: "/api/auth/logout",
    // url: "/logout",
    method: "post",
  });
}

export async function apiForgotPassword(data: ForgotPassword) {
  return ApiService.fetchData({
    url: "/reset/password",
    method: "post",
    data,
  });
}

export async function apiResetPassword(data: ResetPassword) {
  return ApiService.fetchData({
    url: "/reset-password",
    method: "post",
    data,
  });
}
