import { promisePool } from '../../database/db';
import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';
import { GetHousingCompany, HousingCompany, PostHousingCompany, PutHousingCompany } from '../../interfaces/HousingCompany';

//TODO add role check
const getAllHousingCompanies = async (): Promise<HousingCompany[]> => {
  const [rows] = await promisePool.execute<GetHousingCompany[]>(
    `SELECT housing_companies.id, housing_companies.NAME,
    JSON_OBJECT('user_id', users.id, 'user_name', users.user_name) AS user,
    JSON_OBJECT('address_id', addresses.id, 'street', addresses.street, 'number', addresses.number) AS address,
	  JSON_OBJECT('postcode_id', postcodes.id, 'code', postcodes.code, 'name', postcodes.name) AS postcode,
    JSON_OBJECT('city_id', cities.id, 'name', cities.name) AS city
    FROM housing_companies
    JOIN users
    ON housing_companies.user_id = users.id
    JOIN addresses
    ON housing_companies.address_id = addresses.id
    JOIN postcodes
    ON addresses.postcode_id = postcodes.id
    JOIN cities
    ON postcodes.city_id = cities.id
    `,
  );
  if (rows.length === 0) {
    throw new CustomError('No housing companies found', 404);
  }
  const housingCompanies: HousingCompany[] = rows.map((row) => ({
    ...row,
    user: JSON.parse(row.user?.toString() || '{}'),
    postcode: JSON.parse(row.postcode?.toString() || '{}'),
    city: JSON.parse(row.city?.toString() || '{}'),
  }));
  return housingCompanies;
};
//TODO add role check
const getHousingCompany = async (id: number) => {
  const [rows] = await promisePool.execute<GetHousingCompany[]>(
    `SELECT housing_companies.id, housing_companies.NAME, address_id, housing_companies.user_id,
    JSON_OBJECT('user_id', users.id, 'user_name', users.user_name) AS user,
    JSON_OBJECT('address_id', addresses.id, 'street', addresses.street, 'number', addresses.number) AS address,
	  JSON_OBJECT('postcode_id', postcodes.id, 'code', postcodes.code, 'name', postcodes.name) AS postcode,
    JSON_OBJECT('city_id', cities.id, 'name', cities.name) AS city
    FROM housing_companies
    JOIN users
    ON housing_companies.user_id = users.id
    JOIN addresses
    ON housing_companies.address_id = addresses.id
    JOIN postcodes
    ON addresses.postcode_id = postcodes.id
    JOIN cities
    ON postcodes.city_id = cities.id
    WHERE housing_companies.id = ?
    `,
    [id],
  );
  if (rows.length === 0) {
    throw new CustomError('Housing company not found', 404);
  }
  return rows[0] as HousingCompany;
};

const postHousingCompany = async (data: PostHousingCompany): Promise<number> => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `INSERT INTO housing_companies (name, address_id, user_id)
    VALUES (?, ?, ?)`,
    [data.name, data.address_id, data.user_id],
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('No housing companies added', 404);
  }
  return headers.insertId;
};

const putHousingCompany = async (housingCompany: PutHousingCompany, id: number, userId: number, role: string): Promise<boolean> => {
  console.log(housingCompany);
  const name = housingCompany.name;
  let sql = 'UPDATE housing_companies SET name = ? WHERE id = ? AND user_id = ?';
  let params = [name, id, userId];
  if (role === 'admin') {
    sql = 'UPDATE housing_companies SET name = ? WHERE id = ?';
    params = [name, id];
  }
  console.log(params);
  const [headers] = await promisePool.execute<ResultSetHeader>(sql, params);
  if (headers.affectedRows === 0) {
    throw new CustomError('Housing company not found', 404);
  }
  return true;
};


const deleteHousingCompany = async (id: number, user_id: number, role: string): Promise<boolean> => {
  let sql = 'DELETE FROM housing_companies WHERE id = ? AND user_id = ?';
  let params = [id, user_id];
  if (role === 'admin') {
    sql = 'DELETE FROM housing_companies WHERE id = ?';
    params = [id];
  }
  const [headers] = await promisePool.execute<ResultSetHeader>(sql, params);

  if (headers.affectedRows === 0) {
    throw new CustomError('Housing company not found', 404);
  }
  return true;
};

export { getAllHousingCompanies, getHousingCompany, postHousingCompany, putHousingCompany, deleteHousingCompany };
