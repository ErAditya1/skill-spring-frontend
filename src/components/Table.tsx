import React from "react";

const Table = ({
  columns,
  renderRow,
  data,
}: {
  columns: { header: string; accessor: string; className?: string }[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
}) => {
  return (
    <div className="w-full rounded-xl border bg-card shadow-sm overflow-hidden">
      
      {/* Scroll Wrapper */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm">

          {/* Header */}
          <thead className="bg-muted/60 sticky top-0 z-10">
            <tr className="text-left border-b">
              {columns.map((col) => (
                <th
                  key={col.accessor}
                  className={`px-4 py-3 font-medium text-muted-foreground ${col.className}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y">
            {data && data.length > 0 ? (
              data.map((item) => renderRow(item))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-12 text-muted-foreground"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default Table;
