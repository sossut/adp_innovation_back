import { RowDataPacket } from 'mysql2';
import { Question } from './Question';
import { Survey } from './Survey';

interface Answer {
  id: number;
  answer: number;
  question_id: Question;
  survey_id: Survey;
}

interface GetAnswer extends RowDataPacket, Answer {}

type PostAnswer = Omit<Answer, 'id'>;

type PutAnswer = Partial<PostAnswer>;

export { Answer, GetAnswer, PostAnswer, PutAnswer };