import { promisePool } from '../../database/db';
import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';

import { GetSurvey, PostSurvey, PutSurvey, Survey } from '../../interfaces/Survey';

const getAllSurveys = async (): Promise<Survey[]> => {
  const [rows] = await promisePool.execute<GetSurvey[]>(
    `SELECT surveys.id, start_date, end_date, min_responses, max_responses, survey_status, surveys.user_id, survey_key, surveys.housing_company_id,
    JSON_OBJECT('user_id', users.id, 'user_name', users.user_name) AS user,
    JSON_OBJECT('housing_company_id', housing_companies.id, 'name', housing_companies.name) AS housing_company
    FROM surveys
    JOIN users
    ON surveys.user_id = users.id
    JOIN housing_companies
    ON surveys.housing_company_id = housing_companies.id
    `,
  );
  if (rows.length === 0) {
    throw new CustomError('No surveys found', 404);
  }
  return rows;
};

const getSurvey = async (id: number): Promise<Survey> => {
  const [rows] = await promisePool.execute<GetSurvey[]>(
    `SELECT surveys.id, start_date, end_date, min_responses, max_responses, survey_status, surveys.user_id, survey_key, surveys.housing_company_id,
    JSON_OBJECT('user_id', users.id, 'user_name', users.user_name) AS user,
    JSON_OBJECT('housing_company_id', housing_companies.id, 'name', housing_companies.name) AS housing_company
    FROM surveys
    JOIN users
    ON surveys.user_id = users.id
    JOIN housing_companies
    ON surveys.housing_company_id = housing_companies.id
    WHERE surveys.id = ?`,
    [id],
  );
  if (rows.length === 0) {
    throw new CustomError('Survey not found', 404);
  }
  return rows[0];
};

const postSurvey = async (survey: PostSurvey) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `INSERT INTO surveys (start_date, end_date, min_responses, max_responses, survey_status, user_id, survey_key, housing_company_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [survey.start_date, survey.end_date, survey.min_responses, survey.max_responses, survey.survey_status, survey.user_id, survey.survey_key, survey.housing_company_id],
  );
  return headers.insertId;
};

const putSurvey = async (data: PutSurvey, id: number): Promise<boolean> => {
  const sql = promisePool.format('UPDATE surveys SET ? WHERE id = ?;', [
    data,
    id,
  ]);

  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('Survey not found', 404);
  }
  return true;
};

const deleteSurvey = async (id: number): Promise<boolean> => {
  const sql = promisePool.format('DELETE FROM surveys WHERE id = ?;', [id]);
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('Survey not found', 404);
  }
  return true;
};

const getSurveyByKey = async (key: string): Promise<Survey> => {
  const [rows] = await promisePool.execute<GetSurvey[]>(
    `SELECT surveys.id, start_date, end_date, min_responses, max_responses, survey_status, surveys.user_id, survey_key, surveys.housing_company_id,
    JSON_OBJECT('user_id', users.id, 'user_name', users.user_name) AS user,
    JSON_OBJECT('housing_company_id', housing_companies.id, 'name', housing_companies.name) AS housing_company
    FROM surveys
    JOIN users
    ON surveys.user_id = users.id
    JOIN housing_companies
    ON surveys.housing_company_id = housing_companies.id
    WHERE survey_key = ?`,
    [key],
  );
  if (rows.length === 0) {
    throw new CustomError('Survey not found', 404);
  }
  return rows[0];
};

export {
  getAllSurveys,
  getSurvey,
  postSurvey,
  putSurvey,
  deleteSurvey,
  getSurveyByKey,
};