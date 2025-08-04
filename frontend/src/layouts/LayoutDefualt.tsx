import Spinner from "@/components/Spinner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { Outlet, useNavigation } from "react-router-dom";
import { Toaster } from "sonner";

export default function LayoutDefualt() {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  const queryClient = new QueryClient();

  return (
    <Suspense fallback={<Spinner />}>
      {isLoading ? (
        <Spinner />
      ) : (
        <main>
          <TooltipProvider>
            <QueryClientProvider client={queryClient}>
              <Toaster richColors position="top-center" />
              <Outlet />
            </QueryClientProvider>
          </TooltipProvider>
        </main>
      )}
    </Suspense>
  );
}
