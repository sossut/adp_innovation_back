import { promisePool } from '../../database/db';
import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';
import { GetAnswer, PostAnswer, PutAnswer } from '../../interfaces/Answer';

const getAllAnswers = async (): Promise<GetAnswer[]> => {
  const [rows] = await promisePool.execute<GetAnswer[]>(
    'SELECT * FROM answers;',
  );
  if (rows.length === 0) {
    throw new CustomError('No answers found', 404);
  }
  return rows;
};

const getAnswer = async (id: string): Promise<GetAnswer> => {
  const [rows] = await promisePool.execute<GetAnswer[]>(
    'SELECT * FROM answers WHERE id = ?', [id],
  );
  if (rows.length === 0) {
    throw new CustomError('No answers found', 404);
  }
  return rows[0];
};

const getAnswersBySurvey = async (surveyID: number): Promise<GetAnswer[]> => {
  const [rows] = await promisePool.execute<GetAnswer[]>(
    `SELECT answers.id, question_id, answer, survey_id, questions.question, questions.weight as question_weight
	 FROM answers
    JOIN questions
    ON answers.question_id = questions.id
    WHERE survey_id = ?`, [surveyID],
  );
  if (rows.length === 0) {
    throw new CustomError('No answers found', 404);
  }
  return rows;
};

const postAnswer = async (answer: PostAnswer) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    'INSERT INTO answers (answer, question_id, survey_id) VALUES (?, ?, ?);',
    [answer.answer, answer.question_id, answer.survey_id],
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Answer not created', 400);
  }
  return headers.insertId;
};

const putAnswer = async (data: PutAnswer, id: number) => {
  const sql = promisePool.format('UPDATE answers SET ? WHERE id = ?;', [
    data,
    id,
  ]);
  const [headers] = await promisePool.execute<ResultSetHeader>(
    sql,
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Answer not updated', 400);
  }
  return headers.affectedRows;
};

const deleteAnswer = async (id: number) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    'DELETE FROM answers WHERE id = ?;',
    [id],
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Answer not deleted', 400);
  }
  return headers.affectedRows;
};

export {
  getAllAnswers,
  getAnswer,
  getAnswersBySurvey,
  postAnswer,
  putAnswer,
  deleteAnswer,
};
