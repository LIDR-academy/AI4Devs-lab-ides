import { ReactNode, useEffect } from "react"

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

interface DialogChildProps {
  children: ReactNode
}

interface DialogCloseProps {
  onClick: () => void
}

const Dialog = ({ isOpen, onClose, children }: DialogProps) => {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      {/* Backdrop */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          width: "90%",
          maxWidth: "750px",
          maxHeight: "85vh",
          overflow: "auto",
          zIndex: 10,
          position: "relative",
          padding: "0",
          margin: "0 auto",
        }}
      >
        {children}
      </div>
    </div>
  )
}

const DialogHeader = ({ children }: DialogChildProps) => {
  return (
    <div
      style={{
        padding: "12px 16px",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        backgroundColor: "white",
        zIndex: 1,
      }}
    >
      <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", margin: 0 }}>
        {children}
      </h2>
    </div>
  )
}

const DialogContent = ({ children }: DialogChildProps) => {
  return (
    <div
      style={{
        padding: "0 40px 16px 40px",
        maxHeight: "calc(85vh - 110px)",
        overflow: "auto",
      }}
    >
      {children}
    </div>
  )
}

const DialogFooter = ({ children }: DialogChildProps) => {
  return (
    <div
      style={{
        padding: "12px 16px",
        borderTop: "1px solid #e5e7eb",
        display: "flex",
        justifyContent: "flex-end",
        gap: "8px",
        position: "sticky",
        bottom: 0,
        backgroundColor: "white",
        zIndex: 1,
      }}
    >
      {children}
    </div>
  )
}

const DialogClose = ({ onClick }: DialogCloseProps) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "12px",
        right: "12px",
        cursor: "pointer",
        color: "#6b7280",
        zIndex: 2,
      }}
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </div>
  )
}

export { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader }
