import { RowDataPacket } from 'mysql2';

interface Question {
  id: number;
  question_order: number;
  question: string;
  weight: number;
  active: 'true' | 'false';
}

interface GetQuestion extends RowDataPacket, Question {}

type PostQuestion = Omit<Question, 'id'>;

type PutQuestion = Partial<PostQuestion>;

export { Question, GetQuestion, PostQuestion, PutQuestion };