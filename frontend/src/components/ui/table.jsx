import React from "react"

const Table = React.forwardRef(({ children, ...props }, ref) => {
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    captionSide: "bottom",
  }

  return (
    <div style={{ overflowX: "auto", width: "100%" }}>
      <table ref={ref} style={{ ...tableStyle, ...props.style }} {...props}>
        {children}
      </table>
    </div>
  )
})
Table.displayName = "Table"

const TableHeader = React.forwardRef(({ children, ...props }, ref) => {
  const headerStyle = {
    backgroundColor: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
  }

  return (
    <thead ref={ref} style={{ ...headerStyle, ...props.style }} {...props}>
      {children}
    </thead>
  )
})
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef(({ children, ...props }, ref) => {
  return (
    <tbody ref={ref} style={props.style} {...props}>
      {children}
    </tbody>
  )
})
TableBody.displayName = "TableBody"

const TableRow = React.forwardRef(({ children, ...props }, ref) => {
  const [isHovered, setIsHovered] = React.useState(false)

  const rowStyle = {
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
})
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef(({ children, ...props }, ref) => {
  const headStyle = {
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
})
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef(({ children, ...props }, ref) => {
  const cellStyle = {
    padding: "12px 16px",
    fontSize: "14px",
    color: "#374151",
  }

  return (
    <td ref={ref} style={{ ...cellStyle, ...props.style }} {...props}>
      {children}
    </td>
  )
})
TableCell.displayName = "TableCell"

export { Table, TableBody, TableCell, TableHead, TableHeader, TableRow }
