import { Table, TableBody, TableHeader } from "@/components/ui/table";

import { useState, useRef, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

import { useFetchMoviesInfinite } from "@/store/useMoviesStore";
import { useDebounce } from "@/hooks/useDebounce";
import type { Movie } from "@/types/type";
import SkeletonMovieTable from "./SkeletonMovieTable";
import MovieTableBodyData from "./MovieTableBodyData";
import MovieTableBodyNoData from "./MovieTableBodyNoData";
import MovieTableHeaderData from "./MovieTableHeaderData";
import MovieTableError from "./MovieTableError";
import MovieForm from "./MovieForm";
import HeaderMoviesPage from "./HeaderMoviesPage";

export default function MovieDataTable() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const observerRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(search, 500);

  const queryParams = useMemo(
    () => ({
      limit: 20,
      search: debouncedSearch,
      type: filterType,
      sortBy,
      sortOrder,
    }),
    [debouncedSearch, filterType, sortBy, sortOrder]
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useFetchMoviesInfinite(queryParams);

  const allMovies = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) || [];
  }, [data]);

  const uniqueTypes = useMemo(() => {
    const types = allMovies.map((movie) => movie.type).filter(Boolean);
    return ["all", ...Array.from(new Set(types))];
  }, [allMovies]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const handleAddMovie = () => {
    setFormMode("create");
    setSelectedMovie(null);
    setIsFormOpen(true);
  };

  const handleEditMovie = (movie: Movie) => {
    setFormMode("edit");
    setSelectedMovie(movie);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedMovie(null);
  };

  if (isError) {
    return <MovieTableError error={error} refetch={refetch} />;
  }

  return (
    <>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <HeaderMoviesPage
          filterType={filterType}
          handleAddMovie={handleAddMovie}
          search={search}
          setFilterType={setFilterType}
          setSearch={setSearch}
          uniqueTypes={uniqueTypes}
        />

        {/* Results Counter */}
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {data?.pages?.[0]?.pagination.totalCount || 0} Total Film
          </Badge>
          <div className="flex items-center gap-2">
            {(isLoading || isFetchingNextPage) && (
              <Badge variant="outline" className="text-sm px-3 py-1">
                Loading...
              </Badge>
            )}
            <Badge variant="outline" className="text-sm px-3 py-1">
              {allMovies.length} Loaded movie
            </Badge>
          </div>
        </div>

        <Card className="shadow-xl border-0 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <MovieTableHeaderData handleSortChange={handleSortChange} />
              </TableHeader>
              <TableBody>
                <MovieTableBodyData
                  allMovies={allMovies}
                  onEditMovie={handleEditMovie}
                />
                {/* Loading Skeleton Rows */}
                <SkeletonMovieTable
                  isLoading={isLoading}
                  isFetchingNextPage={isFetchingNextPage}
                />
                {/* No Results Row */}
                {allMovies.length === 0 && !isLoading && (
                  <MovieTableBodyNoData />
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Infinite Scroll Trigger */}
        <div ref={observerRef} className="h-4" />

        {/* End of Results Message */}
        {!hasNextPage && allMovies.length > 0 && (
          <div className="text-center py-8">
            <Badge variant="secondary" className="text-sm px-4 py-2">
              All results displayed ({allMovies.length} items)
            </Badge>
          </div>
        )}
      </div>

      {/* Movie Form Modal */}
      <MovieForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        movie={selectedMovie}
        mode={formMode}
      />
    </>
  );
}
