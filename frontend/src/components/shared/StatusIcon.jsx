const statusConfig = {
  ALL: { label: "ALL STATUSES", emoji: "⚪" },
  PENDING: { label: "PENDING", emoji: "🟠", color: "#f59e0b" },
  EVALUATED: { label: "EVALUATED", emoji: "🟢", color: "#10b981" },
  REJECTED: { label: "REJECTED", emoji: "🔴", color: "#ef4444" },
  INTERVIEW: { label: "INTERVIEW", emoji: "🟠", color: "#fb923c" },
  OFFERED: { label: "OFFERED", emoji: "🔵", color: "#3b82f6" },
  HIRED: { label: "HIRED", emoji: "🟣", color: "#4f46e5" },
}

// Simple status circle component
export const StatusIcon = ({ status, size = 16 }) => {
  const config = statusConfig[status]
  if (!config) return null

  return <span style={{ marginRight: "6px" }}>{config.emoji}</span>
}

// Basic select dropdown with status icons
export const StatusIconSelect = ({
  value = "ALL",
  onChange,
  includeAllOption = true,
}) => {
  const handleChange = (e) => {
    onChange(e.target.value)
  }

  return (
    <select
      value={value}
      onChange={handleChange}
      style={{
        height: "40px",
        padding: "0 8px",
        borderRadius: "4px",
        border: "1px solid #e5e7eb",
        fontSize: "14px",
        backgroundColor: "#fff",
        minWidth: "150px",
      }}
    >
      {includeAllOption && (
        <option value="ALL">
          {statusConfig.ALL.emoji} {statusConfig.ALL.label}
        </option>
      )}
      {Object.entries(statusConfig)
        .filter(([key]) => key !== "ALL")
        .map(([status, config]) => (
          <option key={status} value={status}>
            {config.emoji} {config.label}
          </option>
        ))}
    </select>
  )
}

export default StatusIcon
