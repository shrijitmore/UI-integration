export const clearSession = () => {
  sessionStorage.removeItem("role_id");
  sessionStorage.removeItem("role");
  sessionStorage.removeItem("permissions");
  sessionStorage.removeItem("isAuthenticated");
  sessionStorage.removeItem("lastRoute");
};
