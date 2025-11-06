import { toast } from "react-toastify";
import { clearSession } from "./sessionHandler";
export const handleTokenExpiration = () => {
  clearSession();
  toast.error("Session expired. Please log in again.");
  setTimeout(() => {
    window.location.href = `${import.meta.env.BASE_URL}` || "/";
  }, 1500);
};
