import Cookies from "js-cookie";

const TOKEN_COOKIE_KEY = "cineghar_token";
const USER_COOKIE_KEY = "cineghar_user";

export const getAuthToken = async (): Promise<string | null> => {
  return Cookies.get(TOKEN_COOKIE_KEY) ?? null;
};

/** Sync getter for use in axios interceptor (client-side only) */
export const getAuthTokenSync = (): string | undefined => {
  if (typeof window === "undefined") return undefined;
  return Cookies.get(TOKEN_COOKIE_KEY) ?? undefined;
};

export const setAuthToken = async (
  token: string,
  rememberMe: boolean = false
): Promise<void> => {
  const expires = rememberMe ? 30 : 1;
  Cookies.set(TOKEN_COOKIE_KEY, token, { expires });
};

export const clearAuthCookies = async (): Promise<void> => {
  Cookies.remove(TOKEN_COOKIE_KEY);
  Cookies.remove(USER_COOKIE_KEY);
};

export const getUserData = async (): Promise<any | null> => {
  const raw = Cookies.get(USER_COOKIE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error parsing user cookie:", error);
    Cookies.remove(USER_COOKIE_KEY);
    return null;
  }
};

export const setUserData = async (
  user: any,
  rememberMe: boolean = false
): Promise<void> => {
  const expires = rememberMe ? 30 : 1;
  Cookies.set(USER_COOKIE_KEY, JSON.stringify(user), { expires });
};

