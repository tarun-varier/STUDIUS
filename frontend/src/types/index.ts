export interface QuestionBank {
  id: string;
  title: string;
  description?: string;
  file_path: string;
  created_at: string;
  updated_at: string;
  is_processed: boolean;
}

export interface StudyMaterial {
  id: string;
  title: string;
  description?: string;
  file_path: string;
  created_at: string;
  updated_at: string;
  is_indexed: boolean;
  indexed_at?: string;
}

export interface QueryResponse {
  answer: string;
}
