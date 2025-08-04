import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MyComponentProps } from "@/types/type";
import {
  // Filter,
  Plus,
  Search,
} from "lucide-react";

export default function HeaderMoviesPage({
  search,
  setSearch,
  filterType,
  setFilterType,
  uniqueTypes,
  handleAddMovie,
}: MyComponentProps) {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Movie Library
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Browse and search the available movie collection.
        </p>
      </div>

      {/* Search and Filter Controls */}
      <Card className="bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-50 dark:from-slate-800 dark:via-gray-800 dark:to-slate-900 border border-violet-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl hover:shadow-violet-200/30 transition-all duration-300">
        {/* <Card className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/30 dark:to-emerald-900/30 border-0 shadow-lg"> */}
        {/* <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-0 shadow-lg"> */}
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row items-center gap-4">
            <div className="relative w-full">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search for movie title or director..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-10 h-12 text-lg border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>
            <div className="flex max-lg:w-full items-start gap-4">
              <div className="relative">
                {/* <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" /> */}
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="h-12 pr-10 text-lg border-2 border-gray-200 dark:border-gray-700">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type === "all" ? "All types" : type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleAddMovie}
                className="h-12 px-6 bg-green-600 hover:bg-green-700 text-white font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Movie
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
