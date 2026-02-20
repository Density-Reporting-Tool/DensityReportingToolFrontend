export interface JobNoteBaseDTO {
  note: string;
  createdDate: string;
  commentId: number | null;
}

export interface JobNoteReadDTO extends JobNoteBaseDTO {
  id: number;
  jobId: number;
}

export interface JobNoteCreateDTO extends JobNoteBaseDTO {}

export interface JobNoteUpdateDTO extends JobNoteBaseDTO {
  id: number;
}
