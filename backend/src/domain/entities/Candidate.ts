import crypto from 'crypto';
import { IEncryptionService } from '../../domain/services/IEncryptionService';

export class Candidate {
  constructor(
    public readonly id: string,
    public nombre: string,
    public apellido: string,
    private _correo: string,
    private _telefono: string,
    private _direccion: string,
    public educacion: string,
    public experiencia: string,
    public cvUrl: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  get correo(): string { return this._correo; }
  get telefono(): string { return this._telefono; }
  get direccion(): string { return this._direccion; }

  static async create(
    props: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>,
    encryptionService: IEncryptionService
  ): Promise<Candidate> {
    const encryptedCorreo = await encryptionService.encrypt(props.correo);
    const encryptedTelefono = await encryptionService.encrypt(props.telefono);
    const encryptedDireccion = await encryptionService.encrypt(props.direccion);

    return new Candidate(
      crypto.randomUUID(),
      props.nombre,
      props.apellido,
      encryptedCorreo,
      encryptedTelefono,
      encryptedDireccion,
      props.educacion,
      props.experiencia,
      props.cvUrl,
      new Date(),
      new Date()
    );
  }
} 