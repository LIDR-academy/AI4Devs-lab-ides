export enum DocumentType {
  RESUME = 'RESUME',
  COVER_LETTER = 'COVER_LETTER',
  PORTFOLIO = 'PORTFOLIO',
  CERTIFICATION = 'CERTIFICATION',
  REFERENCE = 'REFERENCE',
  OTHER = 'OTHER'
}

export interface DocumentProps {
  id?: number;
  type: DocumentType;
  name: string;
  filename: string;
  url: string;
  fileSize?: number;
  contentType?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Document {
  private _id?: number;
  private _type: DocumentType;
  private _name: string;
  private _filename: string;
  private _url: string;
  private _fileSize?: number;
  private _contentType?: string;
  private _isActive: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: DocumentProps) {
    this._id = props.id;
    this._type = props.type;
    this._name = props.name;
    this._filename = props.filename;
    this._url = props.url;
    this._fileSize = props.fileSize;
    this._contentType = props.contentType;
    this._isActive = props.isActive !== undefined ? props.isActive : true;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  // Getters
  get id(): number | undefined {
    return this._id;
  }

  get type(): DocumentType {
    return this._type;
  }

  get name(): string {
    return this._name;
  }

  get filename(): string {
    return this._filename;
  }

  get url(): string {
    return this._url;
  }

  get fileSize(): number | undefined {
    return this._fileSize;
  }

  get contentType(): string | undefined {
    return this._contentType;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Métodos para modificar los datos
  updateDetails(data: {
    type?: DocumentType;
    name?: string;
    filename?: string;
    url?: string;
    fileSize?: number;
    contentType?: string;
  }): void {
    if (data.type) this._type = data.type;
    if (data.name) this._name = data.name;
    if (data.filename) this._filename = data.filename;
    if (data.url) this._url = data.url;
    if (data.fileSize !== undefined) this._fileSize = data.fileSize;
    if (data.contentType !== undefined) this._contentType = data.contentType;
    this._updatedAt = new Date();
  }

  // Método para activar/desactivar el documento
  setActive(isActive: boolean): void {
    this._isActive = isActive;
    this._updatedAt = new Date();
  }

  // Método estático para crear un documento
  static create(props: DocumentProps): Document {
    return new Document(props);
  }

  // Método para validar los datos obligatorios
  isValid(): boolean {
    return (
      this._name.trim() !== '' &&
      this._filename.trim() !== '' &&
      this._url.trim() !== ''
    );
  }

  // Método para verificar si es un CV
  isResume(): boolean {
    return this._type === DocumentType.RESUME;
  }

  // Método para formatear tamaño de archivo
  getFormattedSize(): string {
    if (!this._fileSize) return 'Unknown';
    
    const kb = this._fileSize / 1024;
    if (kb < 1024) {
      return `${kb.toFixed(2)} KB`;
    }
    
    const mb = kb / 1024;
    return `${mb.toFixed(2)} MB`;
  }

  // Método para serializar a objeto simple
  toJSON(): Record<string, any> {
    return {
      id: this._id,
      type: this._type,
      name: this._name,
      filename: this._filename,
      url: this._url,
      fileSize: this._fileSize,
      contentType: this._contentType,
      isActive: this._isActive,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
} 