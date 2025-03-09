import * as React from "react"

interface MenubarContextValue {
  activeIndex: number | null
  setActiveIndex: React.Dispatch<React.SetStateAction<number | null>>
}

const MenubarContext = React.createContext<MenubarContextValue | null>(null)

interface MenubarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const Menubar = React.forwardRef<HTMLDivElement, MenubarProps>(
  ({ children, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = React.useState<number | null>(null)

    const menubarStyle: React.CSSProperties = {
      display: "flex",
      height: "40px",
      alignItems: "center",
      gap: "4px",
      borderRadius: "6px",
      backgroundColor: "white",
      border: "1px solid #e5e7eb",
      padding: "4px",
    }

    return (
      <MenubarContext.Provider value={{ activeIndex, setActiveIndex }}>
        <div ref={ref} style={menubarStyle} {...props}>
          {children}
        </div>
      </MenubarContext.Provider>
    )
  }
)
Menubar.displayName = "Menubar"

interface MenubarMenuProps {
  children: React.ReactNode
}

const MenubarMenu: React.FC<MenubarMenuProps> = ({ children }) => {
  const contextValue = React.useContext(MenubarContext)

  if (!contextValue) {
    throw new Error("MenubarMenu must be used within a Menubar")
  }

  const { activeIndex, setActiveIndex } = contextValue
  const [open, setOpen] = React.useState(false)
  const index = React.useRef<number | null>(null)
  const menuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (menuRef.current && menuRef.current.parentElement) {
      index.current = Array.from(
        menuRef.current.parentElement.children
      ).indexOf(menuRef.current)
    }
  }, [])

  React.useEffect(() => {
    if (activeIndex !== index.current) {
      setOpen(false)
    }
  }, [activeIndex])

  return (
    <div ref={menuRef} style={{ position: "relative" }}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            open,
            onOpenChange: (open: boolean) => {
              setOpen(open)
              if (open && index.current !== null) {
                setActiveIndex(index.current)
              }
            },
          })
        }
        return child
      })}
    </div>
  )
}
MenubarMenu.displayName = "MenubarMenu"

interface MenubarTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const MenubarTrigger = React.forwardRef<HTMLDivElement, MenubarTriggerProps>(
  ({ children, open, onOpenChange, ...props }, ref) => {
    const triggerStyle: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      height: "32px",
      padding: "0 8px",
      fontSize: "14px",
      fontWeight: 500,
      borderRadius: "4px",
      cursor: "pointer",
      outline: "none",
      userSelect: "none",
      backgroundColor: open ? "#f3f4f6" : "transparent",
      color: open ? "#111827" : "#374151",
    }

    const handleClick = () => {
      if (onOpenChange) {
        onOpenChange(!open)
      }
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        if (onOpenChange) {
          onOpenChange(!open)
        }
      }
    }

    return (
      <div
        ref={ref}
        role="menuitem"
        aria-expanded={open}
        tabIndex={0}
        style={triggerStyle}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </div>
    )
  }
)
MenubarTrigger.displayName = "MenubarTrigger"

interface MenubarContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  open?: boolean
}

const MenubarContent = React.forwardRef<HTMLDivElement, MenubarContentProps>(
  ({ children, open, ...props }, ref) => {
    if (!open) return null

    const contentStyle: React.CSSProperties = {
      position: "absolute",
      top: "100%",
      left: 0,
      marginTop: "8px",
      width: "220px",
      zIndex: 50,
      backgroundColor: "white",
      borderRadius: "6px",
      border: "1px solid #e5e7eb",
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      padding: "4px",
      animation: "scaleIn 0.2s ease-out",
      transformOrigin: "top left",
    }

    return (
      <div ref={ref} style={contentStyle} {...props}>
        {children}
      </div>
    )
  }
)
MenubarContent.displayName = "MenubarContent"

interface MenubarItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const MenubarItem = React.forwardRef<HTMLDivElement, MenubarItemProps>(
  ({ children, ...props }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false)

    const itemStyle: React.CSSProperties = {
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "6px 8px",
      fontSize: "14px",
      borderRadius: "4px",
      cursor: "pointer",
      userSelect: "none",
      outline: "none",
      backgroundColor: isHovered ? "#f3f4f6" : "transparent",
      color: "#374151",
    }

    return (
      <div
        ref={ref}
        role="menuitem"
        tabIndex={-1}
        style={itemStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
MenubarItem.displayName = "MenubarItem"

interface MenubarSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

const MenubarSeparator = React.forwardRef<
  HTMLDivElement,
  MenubarSeparatorProps
>((props, ref) => {
  const separatorStyle: React.CSSProperties = {
    height: "1px",
    margin: "6px -4px",
    backgroundColor: "#e5e7eb",
  }

  return <div ref={ref} style={separatorStyle} {...props} />
})
MenubarSeparator.displayName = "MenubarSeparator"

interface MenubarShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
}

const MenubarShortcut: React.FC<MenubarShortcutProps> = ({
  children,
  ...props
}) => {
  const shortcutStyle: React.CSSProperties = {
    marginLeft: "8px",
    fontSize: "12px",
    color: "#6b7280",
  }

  return (
    <span style={shortcutStyle} {...props}>
      {children}
    </span>
  )
}
MenubarShortcut.displayName = "MenubarShortcut"

export {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
}
