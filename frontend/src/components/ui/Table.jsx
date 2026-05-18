export function Table({ columns, data, onRowClick, emptyMessage = "No results" }) {
  if (!data?.length) {
    return (
      <div className="panel p-8 text-center text-sm text-muted">{emptyMessage}</div>
    );
  }

  return (
    <div className="panel overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-canvas/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={row.id ?? i}
                onClick={() => onRowClick?.(row)}
                className={`
                  border-b border-border last:border-0 transition-colors duration-200
                  ${onRowClick ? "cursor-pointer hover:bg-elevated/50" : ""}
                `}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-foreground">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
