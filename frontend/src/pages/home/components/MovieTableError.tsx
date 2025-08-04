import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { AxiosError } from "axios";
import { RefreshCw } from "lucide-react";

type Props = {
  error: AxiosError | Error;
  refetch: () => void;
};

export default function MovieTableError({ error, refetch }: Props) {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <Alert variant="destructive">
        <AlertTitle>Data loading error</AlertTitle>
        <AlertDescription className="mt-2">
          {error?.message || "An error occurred while loading data."}
        </AlertDescription>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="mt-3"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry Again
        </Button>
      </Alert>
    </div>
  );
}
