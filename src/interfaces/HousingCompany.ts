import { RowDataPacket } from 'mysql2';
import { Address } from './Address';

import { User } from './User';

interface HousingCompany {
  id: number;
  name: string;
  address_id: Address;
  user_id: number | User;
}

interface GetHousingCompany extends RowDataPacket, HousingCompany {}

type PostHousingCompany = Omit<HousingCompany, 'id'>;

type PutHousingCompany = Partial<PostHousingCompany>;

export { HousingCompany, GetHousingCompany, PostHousingCompany, PutHousingCompany };
