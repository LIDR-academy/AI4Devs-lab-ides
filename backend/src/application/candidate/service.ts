import {
  Candidate,
  CandidateInput,
  candidateSchema,
  CandidateUpdateInput,
  candidateUpdateSchema,
  ICandidateRepository,
  Status,
} from '../../domain/candidate';
import { FileService } from '../../infrastructure/file.service';

export class CandidateService {
  constructor(
    private candidateRepository: ICandidateRepository,
    private fileService: FileService,
  ) {}

  async getAllCandidates(): Promise<Candidate[]> {
    return this.candidateRepository.findAll();
  }

  async getCandidateById(id: number): Promise<Candidate | null> {
    return this.candidateRepository.findById(id);
  }

  async createCandidate(
    data: CandidateInput,
    file?: Express.Multer.File,
  ): Promise<Candidate> {
    // Validate the input data
    const validatedData = candidateSchema.parse(data);

    // Explicitly force status to PENDING for new candidates, regardless of what was sent
    validatedData.status = Status.PENDING;

    let cvFilePath: string | null = null;

    // If a file was uploaded, save it
    if (file) {
      cvFilePath = await this.fileService.saveFile(file);
    }

    // Create the candidate with the file path
    return this.candidateRepository.create({
      ...validatedData,
      cvFilePath,
    });
  }

  async updateCandidate(
    id: number,
    data: CandidateUpdateInput,
    file?: Express.Multer.File,
  ): Promise<Candidate> {
    // Validate the input data
    const validatedData = candidateUpdateSchema.parse(data);

    // Get the existing candidate to check if we need to delete an old file
    const existingCandidate = await this.candidateRepository.findById(id);
    if (!existingCandidate) {
      throw new Error(`Candidate with ID ${id} not found`);
    }

    let cvFilePath = existingCandidate.cvFilePath;

    // If a new file was uploaded, save it and delete the old one
    if (file) {
      // Delete the old file if it exists
      if (existingCandidate.cvFilePath) {
        await this.fileService.deleteFile(existingCandidate.cvFilePath);
      }

      // Save the new file
      cvFilePath = await this.fileService.saveFile(file);
    }

    // Update the candidate with the new data and file path
    return this.candidateRepository.update(id, {
      ...validatedData,
      cvFilePath,
    });
  }

  async deleteCandidate(id: number): Promise<void> {
    // Get the candidate to check if we need to delete a file
    const candidate = await this.candidateRepository.findById(id);
    if (!candidate) {
      throw new Error(`Candidate with ID ${id} not found`);
    }

    // Delete the CV file if it exists
    if (candidate.cvFilePath) {
      await this.fileService.deleteFile(candidate.cvFilePath);
    }

    // Delete the candidate
    await this.candidateRepository.delete(id);
  }

  async getStatistics(): Promise<{
    total: number;
    pending: number;
    valuated: number;
    discarded: number;
  }> {
    return this.candidateRepository.getStatistics();
  }

  /**
   * Get education suggestions from existing candidates
   */
  async getEducationSuggestions(): Promise<string[]> {
    // Get unique education values from candidates
    const candidates = await this.candidateRepository.findAll();

    // Extract education values and remove duplicates
    const educationValues = candidates
      .map((candidate) => candidate.education)
      .filter((education): education is string => !!education);

    // Return unique values using Array.from instead of spread operator
    return Array.from(new Set(educationValues));
  }

  /**
   * Get experience suggestions from existing candidates
   */
  async getExperienceSuggestions(): Promise<string[]> {
    // Get unique experience values from candidates
    const candidates = await this.candidateRepository.findAll();

    // Extract experience values and remove duplicates
    const experienceValues = candidates
      .map((candidate) => candidate.experience)
      .filter((experience): experience is string => !!experience);

    // Return unique values using Array.from instead of spread operator
    return Array.from(new Set(experienceValues));
  }

  getCvFilePath(filename: string): string {
    return this.fileService.getFilePath(filename);
  }
}
