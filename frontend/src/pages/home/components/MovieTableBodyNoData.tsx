import { TableCell, TableRow } from "@/components/ui/table";

export default function MovieTableBodyNoData() {
  return (
    <TableRow>
      <TableCell colSpan={7} className="text-center py-12">
        <div className="space-y-2">
          <div className="text-gray-500 dark:text-gray-400 text-lg">
            No matching results found
          </div>
          <div className="text-gray-400 dark:text-gray-500 text-sm">
            Try changing your search terms or filters.
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}
