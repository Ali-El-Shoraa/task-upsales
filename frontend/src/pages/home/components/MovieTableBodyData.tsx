import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatNumber } from "@/lib/formatNumber";
import { Edit, Trash2 } from "lucide-react";
import type { Movie } from "@/types/type";
import { useDeleteMovie } from "@/store/useMoviesStore";
import { useState } from "react";
import OptimizedImage from "./OptimizedImage";

interface MovieTableBodyDataProps {
  allMovies: Movie[];
  onEditMovie: (movie: Movie) => void;
}

export default function MovieTableBodyData({
  allMovies = [],
  onEditMovie,
}: MovieTableBodyDataProps) {
  const deleteMovieMutation = useDeleteMovie();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDeleteMovie = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteMovieMutation.mutateAsync(id);
    } catch (error) {
      console.log(error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      {allMovies?.map((movie: Movie, index: number) => (
        <TableRow
          key={movie.id}
          className={`
              transition-all duration-200 hover:bg-blue-50 dark:hover:bg-gray-800 hover:shadow-md
              ${
                index % 2 === 0
                  ? "bg-white dark:bg-gray-950"
                  : "bg-gray-50/50 dark:bg-gray-900/50"
              }
              border-b border-gray-100 dark:border-gray-800
            `}
        >
          <TableCell className="text-center py-4 border-l border-gray-100 dark:border-gray-800">
            <Badge variant="outline" className="font-mono">
              {index + 1}
            </Badge>
          </TableCell>
          <TableCell className="py-4 border-l border-gray-100 dark:border-gray-800">
            <div className="space-y-1">
              <div className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2 leading-relaxed">
                {movie.title}
              </div>
            </div>
          </TableCell>
          <TableCell className="py-4 border-l border-gray-100 dark:border-gray-800">
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 text-blue-800 dark:text-blue-200 border-0"
            >
              {movie.type || "-"}
            </Badge>
          </TableCell>
          <TableCell className="py-4 border-l border-gray-100 dark:border-gray-800">
            <div className="font-medium text-gray-700 dark:text-gray-300">
              {movie.director || "-"}
            </div>
          </TableCell>
          <TableCell className="text-right py-4 border-l border-gray-100 dark:border-gray-800">
            <div className="font-mono text-green-600 dark:text-green-400 font-medium">
              {movie.location}
            </div>
          </TableCell>
          <TableCell className="text-right py-4 border-l border-gray-100 dark:border-gray-800">
            <div className="font-mono text-green-600 dark:text-green-400 font-medium">
              {movie.budget ? formatNumber(String(movie.budget)) : "-"}
            </div>
          </TableCell>
          <TableCell className="text-center py-4 border-l border-gray-100 dark:border-gray-800">
            <Badge variant="outline" className="font-mono">
              {movie.year || "-"}
            </Badge>
          </TableCell>
          <TableCell className="text-center py-4 border-l border-gray-100 dark:border-gray-800">
            {movie.posterUrl ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative group cursor-pointer">
                    <OptimizedImage
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-24 relative z-10 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-md group-hover:shadow-lg transition-all duration-200 group-hover:scale-105"
                      fallbackClassName="w-16 h-24"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left" className="p-2">
                  <OptimizedImage
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-48 rounded-lg shadow-xl"
                    fallbackClassName="w-48 h-64"
                    showError={true}
                  />
                </TooltipContent>
              </Tooltip>
            ) : (
              <OptimizedImage
                src=""
                alt="No poster"
                className="w-16 h-24"
                fallbackClassName="w-16 h-24"
                showError={false}
              />
            )}
          </TableCell>
          <TableCell className="text-center py-4 border-l border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-center gap-2">
              {/* Edite Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditMovie(movie)}
                    className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-300"
                  >
                    <Edit className="h-4 w-4 text-blue-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>show editing</p>
                </TooltipContent>
              </Tooltip>

              {/* Delete Button */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-300 bg-transparent"
                    disabled={deletingId === movie.id}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm deletion</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete the Show "{movie.title}" ?
                      This action is irreversible.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteMovie(movie.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
