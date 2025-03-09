/**
 * Represents a candidate in the system
 */
export interface Candidate {
  /** Unique identifier of the candidate */
  id?: string

  /** First name of the candidate */
  firstName: string

  /** Last name of the candidate */
  lastName: string

  /** Email address of the candidate */
  email: string

  /** Phone number of the candidate (optional) */
  phone?: string

  /** Address of the candidate */
  address?: string

  /** Current status of the candidate in the hiring process */
  status?: "PENDING" | "REJECTED" | "INTERVIEW" | "OFFERED" | "HIRED" | string

  /** Evaluation score of the candidate */
  evaluation?: number

  /** CV file for upload */
  cv?: File | null

  /** Date and time when the candidate was created */
  createdAt?: string

  /** Date and time when the candidate was last updated */
  updatedAt?: string

  /** Path to the candidate's CV/resume file */
  cvPath?: string

  /** Education history of the candidate */
  education?: Education[] | string

  /** Work experience history of the candidate */
  experience?: Experience[] | string

  /** Skills of the candidate */
  skills?: string[] | string
}

/**
 * Represents an education entry in a candidate's profile
 */
export interface Education {
  /** Unique identifier of the education entry */
  id?: string

  /** Institution name */
  institution: string

  /** Degree obtained */
  degree: string

  /** Field of study */
  field?: string

  /** Start date of education */
  startDate?: string

  /** End date of education */
  endDate?: string

  /** Description of education */
  description?: string
}

/**
 * Represents a work experience entry in a candidate's profile
 */
export interface Experience {
  /** Unique identifier of the experience entry */
  id?: string

  /** Company name */
  company: string

  /** Position held */
  position: string

  /** Start date of employment */
  startDate?: string

  /** End date of employment */
  endDate?: string

  /** Description of responsibilities and achievements */
  description?: string
}

/**
 * Props for components that display or edit a candidate
 */
export interface CandidateProps {
  /** The candidate object */
  candidate: Candidate | null
}

/**
 * Props for the CandidateForm component
 */
export interface CandidateFormProps extends CandidateProps {
  /** Callback when the candidate is saved */
  onSaved: () => void

  /** Callback when the form is cancelled */
  onCancel: () => void
}
