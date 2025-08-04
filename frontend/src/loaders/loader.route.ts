import { useAuthStore } from "@/store/useAuthStore";
import { redirect } from "react-router-dom";

export const loginLoader = async () => {
  const { checkAuth } = useAuthStore.getState();

  const isAuth = await checkAuth();

  if (isAuth) {
    return redirect("/");
  }
  return null;
};

export const registerLoader = async () => {
  const { checkAuth } = useAuthStore.getState();
  const isAuth = await checkAuth();

  if (isAuth) {
    return redirect("/");
  }
  return null;
};

export const homeLoader = async () => {
  const { checkAuth } = useAuthStore.getState();

  const isAuth = await checkAuth();
  if (!isAuth) {
    return redirect("/login");
  }

  return null;
};
