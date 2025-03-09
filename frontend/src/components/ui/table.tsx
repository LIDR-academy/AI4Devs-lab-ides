import React from "react"

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ children, ...props }, ref) => {
    const tableStyle: React.CSSProperties = {
      width: "100%",
      borderCollapse: "collapse",
      captionSide: "bottom",
      borderRadius: "0",
    }

    return (
      <div style={{ overflowX: "auto", width: "100%", borderRadius: "0" }}>
        <table ref={ref} style={{ ...tableStyle, ...props.style }} {...props}>
          {children}
        </table>
      </div>
    )
  }
)
Table.displayName = "Table"

interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode
}

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ children, ...props }, ref) => {
    const headerStyle: React.CSSProperties = {
      backgroundColor: "#f9fafb",
      borderBottom: "1px solid #e5e7eb",
    }

    return (
      <thead ref={ref} style={{ ...headerStyle, ...props.style }} {...props}>
        {children}
      </thead>
    )
  }
)
TableHeader.displayName = "TableHeader"

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode
}

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ children, ...props }, ref) => {
    return (
      <tbody ref={ref} style={props.style} {...props}>
        {children}
      </tbody>
    )
  }
)
TableBody.displayName = "TableBody"

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ children, ...props }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false)

    const rowStyle: React.CSSProperties = {
      borderBottom: "1px solid #e5e7eb",
      backgroundColor: isHovered ? "#f9fafb" : "white",
      transition: "background-color 0.2s",
    }

    return (
      <tr
        ref={ref}
        style={{ ...rowStyle, ...props.style }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {children}
      </tr>
    )
  }
)
TableRow.displayName = "TableRow"

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ children, ...props }, ref) => {
    const headStyle: React.CSSProperties = {
      padding: "12px 16px",
      textAlign: "left",
      fontSize: "14px",
      fontWeight: "500",
      color: "#374151",
    }

    return (
      <th ref={ref} style={{ ...headStyle, ...props.style }} {...props}>
        {children}
      </th>
    )
  }
)
TableHead.displayName = "TableHead"

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ children, ...props }, ref) => {
    const cellStyle: React.CSSProperties = {
      padding: "12px 16px",
      fontSize: "14px",
      color: "#374151",
    }

    return (
      <td ref={ref} style={{ ...cellStyle, ...props.style }} {...props}>
        {children}
      </td>
    )
  }
)
TableCell.displayName = "TableCell"

export { Table, TableBody, TableCell, TableHead, TableHeader, TableRow }
