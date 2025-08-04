import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

export default function SkeletonMovieTable({
  isLoading,
  isFetchingNextPage,
}: {
  isLoading: boolean;
  isFetchingNextPage: boolean;
}) {
  return (
    (isLoading || isFetchingNextPage) && (
      <>
        {[...Array(20)].map((_, i) => (
          <TableRow
            key={`loading-${i}`}
            className="border-b border-gray-100 dark:border-gray-800"
          >
            <TableCell className="py-4 border-l border-gray-100 dark:border-gray-800">
              <Skeleton className="h-6 w-12 mx-auto" />
            </TableCell>
            <TableCell className="py-4 border-l border-gray-100 dark:border-gray-800">
              <Skeleton className="h-6 w-full max-w-xs" />
            </TableCell>
            <TableCell className="py-4 border-l border-gray-100 dark:border-gray-800">
              <Skeleton className="h-6 w-16" />
            </TableCell>
            <TableCell className="py-4 border-l border-gray-100 dark:border-gray-800">
              <Skeleton className="h-6 w-24" />
            </TableCell>
            <TableCell className="py-4 border-l border-gray-100 dark:border-gray-800">
              <Skeleton className="h-6 w-20 ml-auto" />
            </TableCell>
            <TableCell className="py-4 border-l border-gray-100 dark:border-gray-800">
              <Skeleton className="h-6 w-12 mx-auto" />
            </TableCell>
            <TableCell className="py-4 border-l border-gray-100 dark:border-gray-800">
              <Skeleton className="h-24 w-16 mx-auto rounded-lg" />
            </TableCell>
            <TableCell className="py-4">
              <div className="flex items-center justify-center gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </>
    )
  );
}

// import { Skeleton } from "@/components/ui/skeleton";
// import { TableCell, TableRow } from "@/components/ui/table";

// export default function SkeletonMovieTable({
//   isLoading,
//   isFetchingNextPage,
// }: {
//   isLoading: boolean;
//   isFetchingNextPage: boolean;
// }) {
//   return (
//     (isLoading || isFetchingNextPage) && (
//       <>
//         {[...Array(20)].map((_, i) => (
//           <TableRow
//             key={`loading-${i}`}
//             className="border-b border-gray-100 dark:border-gray-800"
//           >
//             <TableCell className="py-4 border-l border-gray-100 dark:border-gray-800">
//               <Skeleton className="h-6 w-12 mx-auto" />
//             </TableCell>
//             <TableCell className="py-4 border-l border-gray-100 dark:border-gray-800">
//               <Skeleton className="h-6 w-full max-w-xs" />
//             </TableCell>
//             <TableCell className="py-4 border-l border-gray-100 dark:border-gray-800">
//               <Skeleton className="h-6 w-16" />
//             </TableCell>
//             <TableCell className="py-4 border-l border-gray-100 dark:border-gray-800">
//               <Skeleton className="h-6 w-24" />
//             </TableCell>
//             <TableCell className="py-4 border-l border-gray-100 dark:border-gray-800">
//               <Skeleton className="h-6 w-20 ml-auto" />
//             </TableCell>
//             <TableCell className="py-4 border-l border-gray-100 dark:border-gray-800">
//               <Skeleton className="h-6 w-12 mx-auto" />
//             </TableCell>
//             <TableCell className="py-4">
//               <Skeleton className="h-24 w-16 mx-auto rounded-lg" />
//             </TableCell>
//           </TableRow>
//         ))}
//       </>
//     )
//   );
// }
