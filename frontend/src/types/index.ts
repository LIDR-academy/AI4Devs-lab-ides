import React from "react"

// Tipos globales para la aplicación

// Enums
export enum Status {
  PENDING = "PENDING",
  REJECTED = "REJECTED",
  INTERVIEW = "INTERVIEW",
  OFFERED = "OFFERED",
  HIRED = "HIRED",
}

// Interfaces
export interface Candidate {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  address: string
  education: string
  experience: string
  status: Status
  cvFilePath?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CandidateFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  education: string
  experience: string
  status: Status
  cvFile?: File | null
  notes?: string
}

export interface StatusCountStats {
  total: number
  pending: number
  rejected: number
  interview: number
  offered: number
  hired: number
}

export interface StatisticsData {
  pending: number
  rejected: number
  interview: number
  offered: number
  hired: number
}

// Props de componentes comunes
export interface CardProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: "button" | "submit" | "reset"
  disabled?: boolean
  className?: string
  variant?: "primary" | "secondary" | "outline" | "destructive" | "ghost"
  size?: "sm" | "md" | "lg"
}

export interface FormFieldProps {
  label: string
  htmlFor: string
  error?: string
  required?: boolean
  children: React.ReactNode
}

export interface ToastProps {
  id: string
  message: string
  type: "success" | "error"
  duration?: number
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  errors?: Record<string, string[]>
}
