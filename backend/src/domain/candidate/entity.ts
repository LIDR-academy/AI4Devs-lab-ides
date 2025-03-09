import { Status } from './status.enum';

export interface ICandidate {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  address: string;
  education: string;
  experience: string;
  cvFilePath?: string | null;
  status?: Status;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Candidate implements ICandidate {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  address: string;
  education: string;
  experience: string;
  cvFilePath?: string | null;
  status: Status;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: ICandidate) {
    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.phone = data.phone;
    this.address = data.address;
    this.education = data.education;
    this.experience = data.experience;
    this.cvFilePath = data.cvFilePath;
    this.status = data.status || Status.PENDING;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  toJSON(): ICandidate {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      address: this.address,
      education: this.education,
      experience: this.experience,
      cvFilePath: this.cvFilePath,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
