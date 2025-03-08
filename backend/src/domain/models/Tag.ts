export interface TagProps {
  id?: number;
  name: string;
  color?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Tag {
  private _id?: number;
  private _name: string;
  private _color?: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: TagProps) {
    this._id = props.id;
    this._name = props.name;
    this._color = props.color || this.generateRandomColor();
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

  get color(): string | undefined {
    return this._color;
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
    color?: string;
  }): void {
    if (data.name) this._name = data.name;
    if (data.color) this._color = data.color;
    this._updatedAt = new Date();
  }

  // Método para generar un color aleatorio en formato hexadecimal
  private generateRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // Método estático para crear una etiqueta
  static create(props: TagProps): Tag {
    return new Tag(props);
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
      color: this._color,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
} 