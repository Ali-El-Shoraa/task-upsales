import { useAuthStore } from "@/store/useAuthStore";
import { redirect } from "react-router-dom";
import { toast } from "sonner";

export const loginAction = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return toast.error("Email and password are required and must be strings.");
  }

  const data = {
    email,
    password,
  };

  const { login } = useAuthStore.getState();

  await login(data);
};

export const registerAction = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const fallName = formData.get("fallName");

  console.log("email, password, fallName", email, password, fallName);
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof fallName !== "string"
  ) {
    return toast.error("Email and password are required and must be strings.");
  }

  const data = {
    fallName,
    email,
    password,
  };

  const { signup } = useAuthStore.getState();

  await signup(data);
};

export const logoutAction = async () => {
  const { logout } = useAuthStore.getState();

  await logout();
  return redirect("/login");
};
