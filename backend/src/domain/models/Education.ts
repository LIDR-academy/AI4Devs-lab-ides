export interface EducationProps {
  id?: number;
  institution: string;
  degree: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Education {
  private _id?: number;
  private _institution: string;
  private _degree: string;
  private _startDate: Date;
  private _endDate?: Date;
  private _current: boolean;
  private _description?: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: EducationProps) {
    this._id = props.id;
    this._institution = props.institution;
    this._degree = props.degree;
    this._startDate = props.startDate;
    this._endDate = props.endDate;
    this._current = props.current;
    this._description = props.description;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  // Getters
  get id(): number | undefined {
    return this._id;
  }

  get institution(): string {
    return this._institution;
  }

  get degree(): string {
    return this._degree;
  }

  get startDate(): Date {
    return this._startDate;
  }

  get endDate(): Date | undefined {
    return this._endDate;
  }

  get current(): boolean {
    return this._current;
  }

  get description(): string | undefined {
    return this._description;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Métodos para modificar los datos
  updateDetails(data: {
    institution?: string;
    degree?: string;
    startDate?: Date;
    endDate?: Date;
    current?: boolean;
    description?: string;
  }): void {
    if (data.institution) this._institution = data.institution;
    if (data.degree) this._degree = data.degree;
    if (data.startDate) this._startDate = data.startDate;
    
    if (data.current !== undefined) {
      this._current = data.current;
      // Si es educación actual, eliminamos la fecha de fin
      if (this._current) {
        this._endDate = undefined;
      }
    }

    if (!this._current && data.endDate) {
      this._endDate = data.endDate;
    }

    if (data.description !== undefined) this._description = data.description;
    this._updatedAt = new Date();
  }

  // Método para indicar que es educación actual
  markAsCurrent(): void {
    this._current = true;
    this._endDate = undefined;
    this._updatedAt = new Date();
  }

  // Método para indicar que ya no es educación actual
  markAsCompleted(endDate: Date): void {
    this._current = false;
    this._endDate = endDate;
    this._updatedAt = new Date();
  }

  // Método estático para crear una educación
  static create(props: EducationProps): Education {
    return new Education(props);
  }

  // Método para validar los datos obligatorios
  isValid(): boolean {
    return (
      this._institution.trim() !== '' &&
      this._degree.trim() !== '' &&
      this._startDate instanceof Date &&
      (!this._endDate || this._startDate <= this._endDate)
    );
  }

  // Método para serializar a objeto simple
  toJSON(): Record<string, any> {
    return {
      id: this._id,
      institution: this._institution,
      degree: this._degree,
      startDate: this._startDate,
      endDate: this._endDate,
      current: this._current,
      description: this._description,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
} 