import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { SortKey, SortDirection } from "../../hooks/useWatchlistFilters";

type SortableTableHeaderProps = {
  label: string;
  column: SortKey;
  sortKey: SortKey;
  sortDirection: SortDirection;
  onSort: (column: SortKey) => void;
  align?: "left" | "right";
};

export function SortableTableHeader({
  label,
  column,
  sortKey,
  sortDirection,
  onSort,
  align,
}: SortableTableHeaderProps) {
  const isActive = column === sortKey;
  const SortIcon = !isActive
    ? ArrowUpDown
    : sortDirection === "asc"
      ? ArrowUp
      : ArrowDown;
  const alignmentClass = align === "right" ? "text-right" : "text-left";
  const buttonAlignmentClass = align === "right" ? "ml-auto" : "";
  return (
    <th
      scope='col'
      aria-sort={
        sortKey === column
          ? sortDirection === "asc"
            ? "ascending"
            : "descending"
          : "none"
      }
      className={`px-3 py-3 ${alignmentClass} font-medium`}>
      <button
        type='button'
        onClick={() => onSort(column)}
        className={`inline-flex items-center gap-1 rounded text-slate-400 hover:text-white focus-visible:outline-2 focus-visible:outline-sky-400 ${buttonAlignmentClass}`}>
        {label}
        <SortIcon
          size={14}
          aria-hidden='true'
        />
      </button>
    </th>
  );
}
