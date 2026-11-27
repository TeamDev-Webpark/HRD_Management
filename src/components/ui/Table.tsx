import type {
  HTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";

export function TableContainer({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`w-full overflow-x-auto bg-white ${className}`} {...props}>
      {children}
    </div>
  );
}

export function Table({
  className = "",
  children,
  ...props
}: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <table className={`w-full border-collapse text-left text-sm ${className}`} {...props}>
      {children}
    </table>
  );
}

export function TableHeader({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={`border-b border-[#EEF2F6] text-xs font-semibold text-[#64748B] ${className}`}
      {...props}
    >
      {children}
    </thead>
  );
}

export function TableBody({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={`divide-y divide-[#F1F5F9] bg-white ${className}`} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={`transition-colors hover:bg-[#F8FAFC]/80 ${className}`} {...props}>
      {children}
    </tr>
  );
}

export function TableHead({
  className = "",
  children,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={`whitespace-nowrap px-4 py-3 font-semibold ${className}`} {...props}>
      {children}
    </th>
  );
}

export function TableCell({
  className = "",
  children,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`px-4 py-3.5 text-sm text-[#1E293B] align-middle ${className}`} {...props}>
      {children}
    </td>
  );
}
