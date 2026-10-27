export const authConfig = {
  cookieName: "ptit_auth_session",
  maxAge: 60 * 60 * 24 * 7, // 7 days
  loginRedirect: "/dashboard",
  publicRedirect: "/",
  roles: {
    admin: "admin",
    user: "user",
  },
};
