export enum SkillLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT'
}

export interface SkillProps {
  id?: number;
  name: string;
  category?: string;
  level: SkillLevel;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Skill {
  private _id?: number;
  private _name: string;
  private _category?: string;
  private _level: SkillLevel;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: SkillProps) {
    this._id = props.id;
    this._name = props.name;
    this._category = props.category;
    this._level = props.level;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  // Getters
  get id(): number | undefined {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get category(): string | undefined {
    return this._category;
  }

  get level(): SkillLevel {
    return this._level;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Métodos para modificar los datos
  updateDetails(data: {
    name?: string;
    category?: string;
    level?: SkillLevel;
  }): void {
    if (data.name) this._name = data.name;
    if (data.category !== undefined) this._category = data.category;
    if (data.level) this._level = data.level;
    this._updatedAt = new Date();
  }

  // Método estático para crear una habilidad
  static create(props: SkillProps): Skill {
    return new Skill(props);
  }

  // Método para validar los datos obligatorios
  isValid(): boolean {
    return this._name.trim() !== '';
  }

  // Método para serializar a objeto simple
  toJSON(): Record<string, any> {
    return {
      id: this._id,
      name: this._name,
      category: this._category,
      level: this._level,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
} 