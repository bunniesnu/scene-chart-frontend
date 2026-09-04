import { TableCell, TableRow } from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";

type Props = {
  colSpan: number;
};

function LoadingSpinnerForTable({ colSpan }: Props) {
  return <TableRow>
    <TableCell colSpan={colSpan} className="text-center text-gray-400 h-20">
      <div className="w-fit mx-auto flex items-center gap-2"><Spinner />Loading...</div>
    </TableCell>
  </TableRow>
}

function NoDataForTable({ colSpan }: Props) {
  return <TableRow>
    <TableCell colSpan={colSpan} className="text-center text-gray-400 h-20">
      No data
    </TableCell>
  </TableRow>
}

function ErrorForTable({ colSpan }: Props) {
  return <TableRow>
    <TableCell colSpan={colSpan} className="text-center text-gray-400 h-20">
      Error
    </TableCell>
  </TableRow>
}

export function TableWithData({ children, isLoading, error, colSpan }: { children: React.ReactNode, isLoading: boolean, error: any, colSpan: number }) {
  if (isLoading) {
    return <LoadingSpinnerForTable colSpan={colSpan} />
  }
  if (error) {
    return <ErrorForTable colSpan={colSpan} />
  }
  if (!children || (Array.isArray(children) && children.length === 0)) {
    return <NoDataForTable colSpan={colSpan} />
  }
  return <>{children}</>
}