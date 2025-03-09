import React from "react"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children: React.ReactNode
  style?: React.CSSProperties
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    const cardStyle: React.CSSProperties = {
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
  }
)
Card.displayName = "Card"

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children: React.ReactNode
  style?: React.CSSProperties
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    const headerStyle: React.CSSProperties = {
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

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string
  children: React.ReactNode
  style?: React.CSSProperties
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, ...props }, ref) => {
    const titleStyle: React.CSSProperties = {
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
  }
)
CardTitle.displayName = "CardTitle"

interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string
  children: React.ReactNode
  style?: React.CSSProperties
}

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, children, ...props }, ref) => {
  const descriptionStyle: React.CSSProperties = {
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
})
CardDescription.displayName = "CardDescription"

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children: React.ReactNode
  style?: React.CSSProperties
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    const contentStyle: React.CSSProperties = {
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

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children: React.ReactNode
  style?: React.CSSProperties
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    const footerStyle: React.CSSProperties = {
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
