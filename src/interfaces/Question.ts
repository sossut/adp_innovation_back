import { RowDataPacket } from 'mysql2';
import { Section } from './Section';

interface Question {
  id: number;
  question_order: number;
  question: string;
  weight: number;
  active: 'true' | 'false';
  section_id: number | Section;
  section_text?: string;
}

interface GetQuestion extends RowDataPacket, Question {}

type PostQuestion = Omit<Question, 'id'>;

type PutQuestion = Partial<PostQuestion>;

export { Question, GetQuestion, PostQuestion, PutQuestion };
