import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { authResponseSchema } from "@/schemas/zod.schema";
import type { AuthState } from "@/types/type";
import type { AxiosError } from "axios";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      authUser: null,
      isSigningUp: false,
      isLoggingIn: false,
      isCheckingLoading: false,
      // isAuth: false,
      checkAuth: async () => {
        const { authUser } = get();
        if (authUser?.token) {
          set({ isCheckingLoading: true });

          try {
            axiosInstance.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${authUser.token}`;

            await axiosInstance.get("/auth/check");

            return true;
          } catch (error) {
            console.log("Expired token", error);
            // set({ isAuth: false });

            set({ authUser: null });
            localStorage.removeItem("auth-storage");
            return false;

            // delete axiosInstance.defaults.headers.common["Authorization"];
          } finally {
            // set({ isCheckingLoading: false });
          }
        }
      },

      signup: async (data) => {
        // implement signup logic here
        set({ isSigningUp: true });

        try {
          const res = await axiosInstance.post("/auth/signup", data);

          set({ authUser: res.data });

          toast.success("Create account in successfully");
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          console.log(err);
          toast.error(err?.response?.data?.message || String(err));
        } finally {
          set({ isSigningUp: false });
        }
      },

      login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/auth/login", data);
          const validation = authResponseSchema.safeParse(res?.data);

          if (!validation.success) {
            toast.error("Invalid login response");
            return;
          }

          const authUser = validation.data;

          set({ authUser });

          toast.success("Logged in successfully");
        } catch (error: unknown) {
          const err = error as AxiosError<{ message: string }>;

          toast.error(err?.response?.data?.message || String(error));
        } finally {
          set({ isLoggingIn: false });
        }
      },

      logout: async () => {
        try {
          await axiosInstance.post("/auth/logout");
        } catch (error) {
          // ignore error
          const err = error as AxiosError<{ message: string }>;

          console.log(err?.response?.data?.message);
        } finally {
          delete axiosInstance.defaults.headers.common["Authorization"];
          set({ authUser: null });
          toast.success("Logged out");
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
