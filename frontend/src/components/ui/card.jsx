import React from "react"

const Card = React.forwardRef(({ className, children, ...props }, ref) => {
  const cardStyle = {
    borderRadius: "8px",
    backgroundColor: "white",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
  }

  return (
    <div ref={ref} style={{ ...cardStyle, ...props.style }} {...props}>
      {children}
    </div>
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    const headerStyle = {
      display: "flex",
      flexDirection: "column",
      padding: "12px 12px 0 12px",
    }

    return (
      <div ref={ref} style={{ ...headerStyle, ...props.style }} {...props}>
        {children}
      </div>
    )
  }
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, children, ...props }, ref) => {
  const titleStyle = {
    fontSize: "14px",
    fontWeight: "600",
    lineHeight: "1.2",
    color: "#111827",
  }

  return (
    <h3 ref={ref} style={{ ...titleStyle, ...props.style }} {...props}>
      {children}
    </h3>
  )
})
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    const descriptionStyle = {
      fontSize: "12px",
      color: "#6b7280",
      lineHeight: "1.2",
      marginTop: "4px",
    }

    return (
      <p ref={ref} style={{ ...descriptionStyle, ...props.style }} {...props}>
        {children}
      </p>
    )
  }
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    const contentStyle = {
      padding: "12px",
    }

    return (
      <div ref={ref} style={{ ...contentStyle, ...props.style }} {...props}>
        {children}
      </div>
    )
  }
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    const footerStyle = {
      display: "flex",
      alignItems: "center",
      padding: "0 12px 12px 12px",
      gap: "8px",
    }

    return (
      <div ref={ref} style={{ ...footerStyle, ...props.style }} {...props}>
        {children}
      </div>
    )
  }
)
CardFooter.displayName = "CardFooter"

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
