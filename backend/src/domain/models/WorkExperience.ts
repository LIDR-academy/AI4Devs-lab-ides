export interface WorkExperienceProps {
  id?: number;
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class WorkExperience {
  private _id?: number;
  private _company: string;
  private _position: string;
  private _startDate: Date;
  private _endDate?: Date;
  private _current: boolean;
  private _description?: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: WorkExperienceProps) {
    this._id = props.id;
    this._company = props.company;
    this._position = props.position;
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

  get company(): string {
    return this._company;
  }

  get position(): string {
    return this._position;
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
    company?: string;
    position?: string;
    startDate?: Date;
    endDate?: Date;
    current?: boolean;
    description?: string;
  }): void {
    if (data.company) this._company = data.company;
    if (data.position) this._position = data.position;
    if (data.startDate) this._startDate = data.startDate;
    
    if (data.current !== undefined) {
      this._current = data.current;
      // Si es trabajo actual, eliminamos la fecha de fin
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

  // Método para indicar que es trabajo actual
  markAsCurrent(): void {
    this._current = true;
    this._endDate = undefined;
    this._updatedAt = new Date();
  }

  // Método para indicar que ya no es trabajo actual
  markAsCompleted(endDate: Date): void {
    this._current = false;
    this._endDate = endDate;
    this._updatedAt = new Date();
  }

  // Método para calcular la duración en meses
  getDurationInMonths(): number {
    const endDate = this._endDate || new Date();
    const months = (endDate.getFullYear() - this._startDate.getFullYear()) * 12;
    return months + (endDate.getMonth() - this._startDate.getMonth());
  }

  // Método estático para crear una experiencia laboral
  static create(props: WorkExperienceProps): WorkExperience {
    return new WorkExperience(props);
  }

  // Método para validar los datos obligatorios
  isValid(): boolean {
    return (
      this._company.trim() !== '' &&
      this._position.trim() !== '' &&
      this._startDate instanceof Date &&
      (!this._endDate || this._startDate <= this._endDate)
    );
  }

  // Método para serializar a objeto simple
  toJSON(): Record<string, any> {
    return {
      id: this._id,
      company: this._company,
      position: this._position,
      startDate: this._startDate,
      endDate: this._endDate,
      current: this._current,
      description: this._description,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
} 