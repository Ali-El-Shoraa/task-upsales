import { Button } from "@/components/ui/button";
import { TableHead, TableRow } from "@/components/ui/table";
import {
  ArrowUpDown,
  Calendar,
  DollarSign,
  ImageIcon,
  User,
  Settings,
  LocationEdit,
} from "lucide-react";

export default function MovieTableHeaderData({
  handleSortChange,
}: {
  handleSortChange: (sortBy: string) => void;
}) {
  return (
    <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b-2 border-gray-200 dark:border-gray-700">
      <TableHead className="text-center font-bold text-gray-700 dark:text-gray-300 py-4 border-l border-gray-200 dark:border-gray-700">
        #
      </TableHead>
      <TableHead className="font-bold text-gray-700 dark:text-gray-300 py-4 border-l border-gray-200 dark:border-gray-700 min-w-[200px]">
        <Button
          variant="ghost"
          onClick={() => handleSortChange("title")}
          className="flex items-center gap-2 p-0 h-auto font-bold hover:bg-transparent"
        >
          <ImageIcon className="h-4 w-4" />
          Title
          <ArrowUpDown className="h-3 w-3" />
        </Button>
      </TableHead>
      <TableHead className="font-bold text-gray-700 dark:text-gray-300 py-4 border-l border-gray-200 dark:border-gray-700 min-w-[120px]">
        <Button
          variant="ghost"
          onClick={() => handleSortChange("type")}
          className="flex items-center gap-2 p-0 h-auto font-bold hover:bg-transparent"
        >
          Type
          <ArrowUpDown className="h-3 w-3" />
        </Button>
      </TableHead>
      <TableHead className="font-bold text-gray-700 dark:text-gray-300 py-4 border-l border-gray-200 dark:border-gray-700 min-w-[150px]">
        <Button
          variant="ghost"
          onClick={() => handleSortChange("director")}
          className="flex items-center gap-2 p-0 h-auto font-bold hover:bg-transparent"
        >
          <User className="h-4 w-4" />
          Director
          <ArrowUpDown className="h-3 w-3" />
        </Button>
      </TableHead>
      <TableHead className="text-right font-bold text-gray-700 dark:text-gray-300 py-4 border-l border-gray-200 dark:border-gray-700 min-w-[80px]">
        <div className="flex items-center justify-end gap-2">
          <LocationEdit className="h-4 w-4" />
          Location
        </div>
      </TableHead>

      <TableHead className="text-right font-bold text-gray-700 dark:text-gray-300 py-4 border-l border-gray-200 dark:border-gray-700 min-w-[150px]">
        <div className="flex items-center justify-end gap-2">
          <DollarSign className="h-4 w-4" />
          Budget
        </div>
      </TableHead>
      <TableHead className="text-center font-bold text-gray-700 dark:text-gray-300 py-4 border-l border-gray-200 dark:border-gray-700 min-w-[100px]">
        <Button
          variant="ghost"
          onClick={() => handleSortChange("year")}
          className="flex items-center justify-center gap-2 p-0 h-auto font-bold hover:bg-transparent"
        >
          <Calendar className="h-4 w-4" />
          Years
          <ArrowUpDown className="h-3 w-3" />
        </Button>
      </TableHead>
      <TableHead className="text-center font-bold text-gray-700 dark:text-gray-300 py-4 border-l border-gray-200 dark:border-gray-700 min-w-[120px]">
        Poster
      </TableHead>
      <TableHead className="text-center font-bold text-gray-700 dark:text-gray-300 py-4 border-l border-gray-200 dark:border-gray-700 min-w-[120px]">
        <div className="flex items-center justify-center gap-2">
          <Settings className="h-4 w-4" />
          Actions
        </div>
      </TableHead>
    </TableRow>
  );
}
