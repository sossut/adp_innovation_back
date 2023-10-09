import { RowDataPacket } from 'mysql2';

interface Question {
  id: number;
  order: number;
  question: string;
  weight: number;
}

interface GetQuestion extends RowDataPacket, Question {}

type PostQuestion = Omit<Question, 'id'>;

type PutQuestion = Partial<PostQuestion>;

export { Question, GetQuestion, PostQuestion, PutQuestion };