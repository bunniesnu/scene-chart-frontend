import { TableCell, TableRow } from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";

type Props = {
  colSpan: number;
};

export function LoadingSpinnerForTable({ colSpan }: Props) {
  return <TableRow>
    <TableCell colSpan={colSpan} className="text-center text-gray-400 h-20">
      <div className="w-fit mx-auto flex items-center gap-2"><Spinner />Loading...</div>
    </TableCell>
  </TableRow>
}