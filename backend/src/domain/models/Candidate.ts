import { Skill } from './Skill';
import { Education } from './Education';
import { WorkExperience } from './WorkExperience';
import { Tag } from './Tag';
import { Document } from './Document';

export interface CandidateProps {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  currentPosition?: string;
  currentCompany?: string;
  yearsOfExperience?: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Candidate {
  private _id?: number;
  private _firstName: string;
  private _lastName: string;
  private _email: string;
  private _phone: string;
  private _address?: string;
  private _city?: string;
  private _state?: string;
  private _postalCode?: string;
  private _country?: string;
  private _currentPosition?: string;
  private _currentCompany?: string;
  private _yearsOfExperience?: number;
  private _notes?: string;
  private _skills: Skill[];
  private _educations: Education[];
  private _experiences: WorkExperience[];
  private _tags: Tag[];
  private _documents: Document[];
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: CandidateProps) {
    this._id = props.id;
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._email = props.email;
    this._phone = props.phone;
    this._address = props.address;
    this._city = props.city;
    this._state = props.state;
    this._postalCode = props.postalCode;
    this._country = props.country;
    this._currentPosition = props.currentPosition;
    this._currentCompany = props.currentCompany;
    this._yearsOfExperience = props.yearsOfExperience;
    this._notes = props.notes;
    this._skills = [];
    this._educations = [];
    this._experiences = [];
    this._tags = [];
    this._documents = [];
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  // Getters
  get id(): number | undefined {
    return this._id;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get fullName(): string {
    return `${this._firstName} ${this._lastName}`;
  }

  get email(): string {
    return this._email;
  }

  get phone(): string {
    return this._phone;
  }

  get address(): string | undefined {
    return this._address;
  }

  get city(): string | undefined {
    return this._city;
  }

  get state(): string | undefined {
    return this._state;
  }

  get postalCode(): string | undefined {
    return this._postalCode;
  }

  get country(): string | undefined {
    return this._country;
  }

  get currentPosition(): string | undefined {
    return this._currentPosition;
  }

  get currentCompany(): string | undefined {
    return this._currentCompany;
  }

  get yearsOfExperience(): number | undefined {
    return this._yearsOfExperience;
  }

  get notes(): string | undefined {
    return this._notes;
  }

  get skills(): ReadonlyArray<Skill> {
    return Object.freeze([...this._skills]);
  }

  get educations(): ReadonlyArray<Education> {
    return Object.freeze([...this._educations]);
  }

  get experiences(): ReadonlyArray<WorkExperience> {
    return Object.freeze([...this._experiences]);
  }

  get tags(): ReadonlyArray<Tag> {
    return Object.freeze([...this._tags]);
  }

  get documents(): ReadonlyArray<Document> {
    return Object.freeze([...this._documents]);
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Métodos para modificar los datos
  updatePersonalInfo(data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  }): void {
    if (data.firstName) this._firstName = data.firstName;
    if (data.lastName) this._lastName = data.lastName;
    if (data.email) this._email = data.email;
    if (data.phone) this._phone = data.phone;
    if (data.address !== undefined) this._address = data.address;
    if (data.city !== undefined) this._city = data.city;
    if (data.state !== undefined) this._state = data.state;
    if (data.postalCode !== undefined) this._postalCode = data.postalCode;
    if (data.country !== undefined) this._country = data.country;
    this._updatedAt = new Date();
  }

  updateProfessionalInfo(data: {
    currentPosition?: string;
    currentCompany?: string;
    yearsOfExperience?: number;
    notes?: string;
  }): void {
    if (data.currentPosition !== undefined) this._currentPosition = data.currentPosition;
    if (data.currentCompany !== undefined) this._currentCompany = data.currentCompany;
    if (data.yearsOfExperience !== undefined) this._yearsOfExperience = data.yearsOfExperience;
    if (data.notes !== undefined) this._notes = data.notes;
    this._updatedAt = new Date();
  }

  // Métodos para gestionar skills
  addSkill(skill: Skill): void {
    this._skills.push(skill);
    this._updatedAt = new Date();
  }

  removeSkill(skillId: number): void {
    this._skills = this._skills.filter(skill => skill.id !== skillId);
    this._updatedAt = new Date();
  }

  setSkills(skills: Skill[]): void {
    this._skills = [...skills];
    this._updatedAt = new Date();
  }

  // Métodos para gestionar educación
  addEducation(education: Education): void {
    this._educations.push(education);
    this._updatedAt = new Date();
  }

  removeEducation(educationId: number): void {
    this._educations = this._educations.filter(edu => edu.id !== educationId);
    this._updatedAt = new Date();
  }

  setEducations(educations: Education[]): void {
    this._educations = [...educations];
    this._updatedAt = new Date();
  }

  // Métodos para gestionar experiencia laboral
  addExperience(experience: WorkExperience): void {
    this._experiences.push(experience);
    this._updatedAt = new Date();
  }

  removeExperience(experienceId: number): void {
    this._experiences = this._experiences.filter(exp => exp.id !== experienceId);
    this._updatedAt = new Date();
  }

  setExperiences(experiences: WorkExperience[]): void {
    this._experiences = [...experiences];
    this._updatedAt = new Date();
  }

  // Métodos para gestionar etiquetas
  addTag(tag: Tag): void {
    this._tags.push(tag);
    this._updatedAt = new Date();
  }

  removeTag(tagId: number): void {
    this._tags = this._tags.filter(tag => tag.id !== tagId);
    this._updatedAt = new Date();
  }

  setTags(tags: Tag[]): void {
    this._tags = [...tags];
    this._updatedAt = new Date();
  }

  // Métodos para gestionar documentos
  addDocument(document: Document): void {
    this._documents.push(document);
    this._updatedAt = new Date();
  }

  removeDocument(documentId: number): void {
    this._documents = this._documents.filter(doc => doc.id !== documentId);
    this._updatedAt = new Date();
  }

  setDocuments(documents: Document[]): void {
    this._documents = [...documents];
    this._updatedAt = new Date();
  }

  // Método estático para crear un candidato
  static create(props: CandidateProps): Candidate {
    return new Candidate(props);
  }

  // Método para validar el email
  isValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this._email);
  }

  // Método para validar el teléfono
  isValidPhone(): boolean {
    const phoneRegex = /^\+?[0-9]{6,15}$/;
    return phoneRegex.test(this._phone);
  }

  // Método para validar los datos obligatorios
  isValid(): boolean {
    return (
      this._firstName.trim() !== '' &&
      this._lastName.trim() !== '' &&
      this.isValidEmail() &&
      this.isValidPhone()
    );
  }

  // Método para serializar a objeto simple
  toJSON(): Record<string, any> {
    return {
      id: this._id,
      firstName: this._firstName,
      lastName: this._lastName,
      email: this._email,
      phone: this._phone,
      address: this._address,
      city: this._city,
      state: this._state,
      postalCode: this._postalCode,
      country: this._country,
      currentPosition: this._currentPosition,
      currentCompany: this._currentCompany,
      yearsOfExperience: this._yearsOfExperience,
      notes: this._notes,
      skills: this._skills.map(skill => skill.toJSON()),
      educations: this._educations.map(education => education.toJSON()),
      experiences: this._experiences.map(experience => experience.toJSON()),
      tags: this._tags.map(tag => tag.toJSON()),
      documents: this._documents.map(doc => doc.toJSON()),
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
} 