import { promisePool } from '../../database/db';
import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';
import { GetResult, PostResult, PutResult } from '../../interfaces/Result';

const getAllResults = async (): Promise<GetResult[]> => {
  const [rows] = await promisePool.execute<GetResult[]>(
    `SELECT results.id, date_time, filename, results.survey_id 
    JSON_OBJECT('survey_id', surveys.id, 'start_date', surveys.start_date, 'end_date', surveys.end_date, 'min_responses', surveys.min_responses, 'max_responses', surveys.max_responses, 'survey_status', surveys.survey_status, 'user_id', surveys.user_id, 'survey_key', surveys.survey_key, 'housing_company_id', surveys.housing_company_id) AS survey
    JSON_OBJECT('housing_company_id', housing_companies.id, 'name', housing_companies.name, 'street', streets.name, 'street_number', addresses.number, 'postcode', postcodes.code, 'city', cities.name) AS housing_company
    FROM results
    JOIN surveys
    ON results.survey_id = surveys.id
    JOIN housing_companies
    ON surveys.housing_company_id = housing_companies.id
    JOIN addresses
    ON housing_companies.address_id = addresses.id
    JOIN streets
    ON addresses.street_id = streets.id
    JOIN postcodes
    ON streets.postcode_id = postcodes.id
    JOIN cities
    ON postcoded.city_id = cities.id;`,
  );
  if (rows.length === 0) {
    throw new CustomError('No results found', 404);
  }
  return rows;
};

const getResult = async (id: string): Promise<GetResult> => {
  const [rows] = await promisePool.execute<GetResult[]>(
    `SELECT results.id, date_time, filename, results.survey_id 
    JSON_OBJECT('survey_id', surveys.id, 'start_date', surveys.start_date, 'end_date', surveys.end_date, 'min_responses', surveys.min_responses, 'max_responses', surveys.max_responses, 'survey_status', surveys.survey_status, 'user_id', surveys.user_id, 'survey_key', surveys.survey_key, 'housing_company_id', surveys.housing_company_id) AS survey
    JSON_OBJECT('housing_company_id', housing_companies.id, 'name', housing_companies.name, 'street', streets.name, 'street_number', addresses.number, 'postcode', postcodes.code, 'city', cities.name) AS housing_company
    FROM results
    JOIN surveys
    ON results.survey_id = surveys.id
    JOIN housing_companies
    ON surveys.housing_company_id = housing_companies.id
    JOIN addresses
    ON housing_companies.address_id = addresses.id
    JOIN streets
    ON addresses.street_id = streets.id
    JOIN postcodes
    ON streets.postcode_id = postcodes.id
    JOIN cities
    ON postcoded.city_id = cities.id
    WHERE results.id = ?`,
    [id],
  );
  if (rows.length === 0) {
    throw new CustomError('Result not found', 404);
  }
  return rows[0];
};

const postResult = async (result: PostResult) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `INSERT INTO results (date_time, filename, survey_id)
    VALUES (?, ?, ?)`,
    [result.date_time, result.filename, result.survey_id],
  );
  return headers.insertId;
};

const putResult = async (data: PutResult, id: number): Promise<boolean> => {
  const sql = promisePool.format('UPDATE results SET ? WHERE id = ?;', [
    data,
    id,
  ]);

  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('Result not found', 404);
  }
  return true;
};

const deleteResult = async (id: number): Promise<boolean> => {
  const sql = promisePool.format('DELETE FROM results WHERE id = ?;', [id]);
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('Result not found', 404);
  }
  return true;
};

export {
  getAllResults,
  getResult,
  postResult,
  putResult,
  deleteResult,
};