export const API = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    WHOAMI: "/api/auth/whoami",
    UPDATE_PROFILE: "/api/auth/update-profile",
    UPDATE_BY_ID: (id: string) => `/api/auth/${id}`,
  },
  ADMIN: {
    USERS: "/api/admin/users",
    USER_BY_ID: (id: string) => `/api/admin/users/${id}`,
  },
} as const;

