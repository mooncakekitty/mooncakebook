export interface OracleComment {
  id: string;
  text: string;
  timestamp: number;
}

export interface OracleRecord {
  id: string;
  question: string;
  answer: string;
  timestamp: number;
  comments?: OracleComment[];
}

export type AppMode = 'home' | 'mind' | 'write' | 'chronicle';
