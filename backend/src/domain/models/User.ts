import bcrypt from 'bcrypt';

export enum Role {
  ADMIN = 'ADMIN',
  RECRUITER = 'RECRUITER',
  HIRING_MANAGER = 'HIRING_MANAGER',
  INTERVIEWER = 'INTERVIEWER',
  READONLY = 'READONLY'
}

export interface Permission {
  id: number;
  name: string;
  description?: string;
}

export interface UserProps {
  id?: number;
  email: string;
  passwordHash: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role: Role;
  isActive?: boolean;
  lastLogin?: Date;
  refreshToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  failedLoginAttempts?: number;
  lockUntil?: Date;
  permissions?: Permission[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private _id?: number;
  private _email: string;
  private _passwordHash: string;
  private _name?: string;
  private _firstName?: string;
  private _lastName?: string;
  private _role: Role;
  private _isActive: boolean;
  private _lastLogin?: Date;
  private _refreshToken?: string;
  private _passwordResetToken?: string;
  private _passwordResetExpires?: Date;
  private _failedLoginAttempts: number;
  private _lockUntil?: Date;
  private _permissions: Permission[];
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: UserProps) {
    this._id = props.id;
    this._email = props.email;
    this._passwordHash = props.passwordHash;
    this._name = props.name;
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._role = props.role;
    this._isActive = props.isActive !== undefined ? props.isActive : true;
    this._lastLogin = props.lastLogin;
    this._refreshToken = props.refreshToken;
    this._passwordResetToken = props.passwordResetToken;
    this._passwordResetExpires = props.passwordResetExpires;
    this._failedLoginAttempts = props.failedLoginAttempts || 0;
    this._lockUntil = props.lockUntil;
    this._permissions = props.permissions || [];
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  // Getters
  get id(): number | undefined {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get passwordHash(): string {
    return this._passwordHash;
  }

  get name(): string | undefined {
    return this._name;
  }

  get firstName(): string | undefined {
    return this._firstName;
  }

  get lastName(): string | undefined {
    return this._lastName;
  }

  get fullName(): string {
    if (this._firstName && this._lastName) {
      return `${this._firstName} ${this._lastName}`;
    }
    if (this._name) {
      return this._name;
    }
    return this._email;
  }

  get role(): Role {
    return this._role;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get lastLogin(): Date | undefined {
    return this._lastLogin;
  }

  get refreshToken(): string | undefined {
    return this._refreshToken;
  }

  get passwordResetToken(): string | undefined {
    return this._passwordResetToken;
  }

  get passwordResetExpires(): Date | undefined {
    return this._passwordResetExpires;
  }

  get failedLoginAttempts(): number {
    return this._failedLoginAttempts;
  }

  get lockUntil(): Date | undefined {
    return this._lockUntil;
  }

  get permissions(): ReadonlyArray<Permission> {
    return Object.freeze([...this._permissions]);
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Métodos
  setPassword(password: string): void {
    this._passwordHash = this.hashPassword(password);
    this._updatedAt = new Date();
  }

  isLocked(): boolean {
    return Boolean(this._lockUntil && this._lockUntil > new Date());
  }

  incrementFailedAttempts(): void {
    this._failedLoginAttempts += 1;
    this._updatedAt = new Date();
  }

  lock(minutes: number = 15): void {
    this._lockUntil = new Date(Date.now() + minutes * 60 * 1000);
    this._updatedAt = new Date();
  }

  unlock(): void {
    this._failedLoginAttempts = 0;
    this._lockUntil = undefined;
    this._updatedAt = new Date();
  }

  setRefreshToken(token: string): void {
    this._refreshToken = token;
    this._updatedAt = new Date();
  }

  clearRefreshToken(): void {
    this._refreshToken = undefined;
    this._updatedAt = new Date();
  }

  setPasswordResetToken(token: string, expiryHours: number = 1): void {
    this._passwordResetToken = token;
    this._passwordResetExpires = new Date(Date.now() + expiryHours * 60 * 60 * 1000);
    this._updatedAt = new Date();
  }

  clearPasswordResetToken(): void {
    this._passwordResetToken = undefined;
    this._passwordResetExpires = undefined;
    this._updatedAt = new Date();
  }

  isPasswordResetTokenValid(): boolean {
    return Boolean(
      this._passwordResetToken && 
      this._passwordResetExpires && 
      this._passwordResetExpires > new Date()
    );
  }

  recordLogin(): void {
    this._lastLogin = new Date();
    this._failedLoginAttempts = 0;
    this._updatedAt = new Date();
  }

  setActive(isActive: boolean): void {
    this._isActive = isActive;
    this._updatedAt = new Date();
  }

  setRole(role: Role): void {
    this._role = role;
    this._updatedAt = new Date();
  }

  addPermission(permission: Permission): void {
    if (!this._permissions.some(p => p.id === permission.id)) {
      this._permissions.push(permission);
      this._updatedAt = new Date();
    }
  }

  removePermission(permissionId: number): void {
    this._permissions = this._permissions.filter(p => p.id !== permissionId);
    this._updatedAt = new Date();
  }

  hasPermission(permissionName: string): boolean {
    return this._permissions.some(p => p.name === permissionName);
  }

  isAdmin(): boolean {
    return this._role === Role.ADMIN;
  }

  // Métodos estáticos
  static createPassword(password: string): string {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
  }

  static create(props: Omit<UserProps, 'passwordHash'> & { password: string }): User {
    const { password, ...restProps } = props;
    const passwordHash = User.createPassword(password);
    return new User({ ...restProps, passwordHash });
  }

  // Métodos privados
  private hashPassword(password: string): string {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
  }

  // Validación de contraseña
  validatePassword(password: string): boolean {
    return bcrypt.compareSync(password, this._passwordHash);
  }

  // Serialización
  toJSON(): Record<string, any> {
    return {
      id: this._id,
      email: this._email,
      name: this._name,
      firstName: this._firstName,
      lastName: this._lastName,
      role: this._role,
      isActive: this._isActive,
      lastLogin: this._lastLogin,
      permissions: this._permissions,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
} 