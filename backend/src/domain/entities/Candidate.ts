import { v4 as uuidv4 } from 'uuid';
import { Result } from '../shared/Result';
import { CandidateProps } from '../types/CandidateProps';
import { Education } from '../types/Education';
import { WorkExperience } from '../types/WorkExperience';

export class Candidate {
  private props: CandidateProps;

  constructor(props: CandidateProps) {
    this.props = {
      ...props,
      education: props.education || [],
      workExperience: props.workExperience || []
    };
  }

  get id(): number | undefined {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get email(): string {
    return this.props.email;
  }

  get phone(): string | undefined {
    return this.props.phone;
  }

  get address(): string | undefined {
    return this.props.address;
  }

  get education(): Education[] {
    return this.props.education || [];
  }

  get workExperience(): WorkExperience[] {
    return this.props.workExperience || [];
  }

  get cvUrl(): string | undefined {
    return this.props.cvUrl;
  }

  set cvUrl(value: string | undefined) {
    this.props.cvUrl = value;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      address: this.address,
      education: this.education,
      workExperience: this.workExperience,
      cvUrl: this.cvUrl
    };
  }

  public static create(props: CandidateProps): Result<Candidate> {
    if (!this.isValidEmail(props.email)) {
      return Result.fail('Email inválido');
    }

    if (!props.name || !props.lastName) {
      return Result.fail('Nombre y apellido son requeridos');
    }

    return Result.ok(new Candidate(props));
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
} 