import { apiSignIn, apiSignOut, apiSignUp } from "@/services/AuthService";
import {
  setUser,
  signInSuccess,
  setDefaultCity,
  signOutSuccess,
  useAppDispatch,
  useAppSelector,
  setExpiredToken,
  setInitialRating,
} from "@/store";
import appConfig from "@/configs/app.config";
import { REDIRECT_URL_KEY } from "@/constants/app.constant";
import { useNavigate } from "react-router-dom";
import useQuery from "./useQuery";
import type { SignInCredential, SignUpCredential } from "@/@types/auth";
import { useStorage } from "@/utils/hooks/useStorage";
import { setWsChannels } from "@/store/slices/ws";

type Status = "success" | "failed";

function useAuth() {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const query = useQuery();

  const { token, signedIn } = useAppSelector((state) => state.auth.session);

  const signIn = async (
    values: SignInCredential,
  ): Promise<
    | {
        status: Status;
        message: string;
      }
    | undefined
  > => {
    try {
      const resp = await apiSignIn(values);
      if (resp.data) {
        console.log(resp.data, "resp");
        const { token } = resp.data;
        useStorage().setItem("token", token);
        dispatch(signInSuccess(token));
        dispatch(setDefaultCity(resp.data?.city));
        useStorage().setItem("defaultCity", resp.data?.city.id);
        if (resp.data.employee.id && resp.data?.websockets) {
          const websocketChannels = resp.data?.websockets.channels;
          const expired_token = resp.data?.expires_at.date;
          useStorage().setItem("wsChannels", JSON.stringify(websocketChannels));
          dispatch(setWsChannels(websocketChannels as any));
          useStorage().setItem("expired_token", expired_token);
          dispatch(setExpiredToken(expired_token));
        }
        if (resp.data.employee) {
          useStorage().setItem(
            "user",
            JSON.stringify(
              resp.data.employee || {
                avatar: "",
                login: "Anonymous",
                authority: ["USER"],
                email: "",
              },
            ),
          );
          dispatch(
            setUser(
              resp.data.employee || {
                avatar: "",
                login: "Anonymous",
                authority: ["USER"],
                email: "",
                name: "",
                last_name: "",
                id: "",
                full_name: "",
                status: { key: "", value: "" },
              },
            ),
          );
        }
        const redirectUrl = query.get(REDIRECT_URL_KEY);
        navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath);
        return {
          status: "success",
          message: "",
        };
      }
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    } catch (errors: any) {
      return {
        status: "failed",
        message: errors?.response?.data?.message || errors.toString(),
      };
    }
  };

  const signUp = async (values: SignUpCredential) => {
    try {
      const resp = await apiSignUp(values);
      if (resp.data) {
        const { token } = resp.data;
        dispatch(signInSuccess(token));
        if (resp.data.employee) {
          dispatch(
            setUser(
              resp.data.employee || {
                avatar: "",
                login: "Anonymous",
                authority: ["USER"],
                email: "",
                name: "",
                last_name: "",
                id: "",
                full_name: "",
                status: { key: "", value: "" },
              },
            ),
          );
        }
        const redirectUrl = query.get(REDIRECT_URL_KEY);
        navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath);
        return {
          status: "success",
          message: "",
        };
      }
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    } catch (errors: any) {
      return {
        status: "failed",
        message: errors?.response?.data?.message || errors.toString(),
      };
    }
  };

  const handleSignOut = () => {
    useStorage().removeItem("token");
    useStorage().removeItem("expired_token");
    useStorage().removeItem("user");
    useStorage().removeItem("wsChannels");
    useStorage().removeItem("defaultRating");
    dispatch(setExpiredToken(null));
    dispatch(signOutSuccess());
    dispatch(
      setUser({
        avatar: "",
        login: "",
        email: "",
        authority: [],
        name: "",
        last_name: "",
        id: "",
        full_name: "",
        status: { key: "", value: "" },
      }),
    );
    dispatch(setWsChannels([]));
    dispatch(setInitialRating({ count: 0 }));
    navigate(appConfig.unAuthenticatedEntryPath);
  };

  const signOut = async () => {
    try {
      await apiSignOut();
      handleSignOut();
    } catch (error) {
      console.log(error);
    }
  };

  return {
    authenticated: token && signedIn,
    signIn,
    signUp,
    signOut,
    handleSignOut,
  };
}

export default useAuth;
