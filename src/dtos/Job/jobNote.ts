export interface JobNoteBaseDTO {
  jobId: number;
  note: string;
}

export interface JobNoteCreateDTO extends JobNoteBaseDTO {}
export interface JobNoteUpdateDTO extends JobNoteBaseDTO {}

export interface JobNoteReadDTO extends JobNoteBaseDTO {
  id: number;
  createdDate: string;
}