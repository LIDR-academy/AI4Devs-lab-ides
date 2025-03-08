import React from "react";
import * as React from "react"

const MenubarContext = React.createContext(null)

const Menubar = React.forwardRef(({ children, ...props }, ref) => {
  const [activeIndex, setActiveIndex] = React.useState(null)

  const menubarStyle = {
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
})
Menubar.displayName = "Menubar"

const MenubarMenu = ({ children }) => {
  const { activeIndex, setActiveIndex } = React.useContext(MenubarContext)
  const [open, setOpen] = React.useState(false)
  const index = React.useRef(null)
  const menuRef = React.useRef(null)

  React.useEffect(() => {
    if (menuRef.current) {
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
            onOpenChange: (open) => {
              setOpen(open)
              if (open) {
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

const MenubarTrigger = React.forwardRef(
  ({ children, open, onOpenChange, ...props }, ref) => {
    const triggerStyle = {
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
      onOpenChange(!open)
    }

    const handleKeyDown = (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        onOpenChange(!open)
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

const MenubarContent = React.forwardRef(({ children, open, ...props }, ref) => {
  if (!open) return null

  const contentStyle = {
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
})
MenubarContent.displayName = "MenubarContent"

const MenubarItem = React.forwardRef(({ children, ...props }, ref) => {
  const [isHovered, setIsHovered] = React.useState(false)

  const itemStyle = {
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
})
MenubarItem.displayName = "MenubarItem"

const MenubarSeparator = React.forwardRef((props, ref) => {
  const separatorStyle = {
    height: "1px",
    margin: "6px -4px",
    backgroundColor: "#e5e7eb",
  }

  return <div ref={ref} style={separatorStyle} {...props} />
})
MenubarSeparator.displayName = "MenubarSeparator"

const MenubarShortcut = ({ children, ...props }) => {
  const shortcutStyle = {
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
