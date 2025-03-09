import React from "react"

/**
 * Status configuration object
 */
type StatusType =
  | "ALL"
  | "PENDING"
  | "REJECTED"
  | "INTERVIEW"
  | "OFFERED"
  | "HIRED"

interface StatusConfig {
  label: string
  emoji: string
  color?: string
}

const statusConfig: Record<StatusType, StatusConfig> = {
  ALL: { label: "ALL STATUSES", emoji: "⚪" },
  PENDING: { label: "PENDING", emoji: "🟠", color: "#f59e0b" },
  REJECTED: { label: "REJECTED", emoji: "🔴", color: "#ef4444" },
  INTERVIEW: { label: "INTERVIEW", emoji: "🟠", color: "#fb923c" },
  OFFERED: { label: "OFFERED", emoji: "🔵", color: "#3b82f6" },
  HIRED: { label: "HIRED", emoji: "🟢", color: "#22c55e" },
}

/**
 * Props for the StatusIcon component
 */
interface StatusIconProps {
  /** Status value */
  status: StatusType
  /** Size of the icon in pixels */
  size?: number
}

/**
 * Simple status circle component
 */
export const StatusIcon: React.FC<StatusIconProps> = ({
  status,
  size = 16,
}) => {
  const config = statusConfig[status]
  if (!config) return null

  return <span style={{ marginRight: "6px" }}>{config.emoji}</span>
}

/**
 * Props for the StatusIconSelect component
 */
interface StatusIconSelectProps {
  /** Currently selected value */
  value?: string
  /** Change handler for the select */
  onChange: (value: string) => void
  /** Whether to include the "ALL" option */
  includeAllOption?: boolean
}

/**
 * Basic select dropdown with status icons
 */
export const StatusIconSelect: React.FC<StatusIconSelectProps> = ({
  value = "ALL",
  onChange,
  includeAllOption = true,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
      <option value="PENDING">
        {statusConfig.PENDING.emoji} {statusConfig.PENDING.label}
      </option>
      <option value="REJECTED">
        {statusConfig.REJECTED.emoji} {statusConfig.REJECTED.label}
      </option>
      <option value="INTERVIEW">
        {statusConfig.INTERVIEW.emoji} {statusConfig.INTERVIEW.label}
      </option>
      <option value="OFFERED">
        {statusConfig.OFFERED.emoji} {statusConfig.OFFERED.label}
      </option>
      <option value="HIRED">
        {statusConfig.HIRED.emoji} {statusConfig.HIRED.label}
      </option>
    </select>
  )
}
