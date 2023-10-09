import { RowDataPacket } from 'mysql2';
import { Postcode } from './Postcode';

interface Address {
  id: number;
  street: string;
  number: string;
  postcode_id: Postcode;
}

interface GetAddress extends RowDataPacket, Address {}

type PostAddress = Omit<Address, 'id'>;

type PutAddress = Partial<PostAddress>;

export { Address, GetAddress, PostAddress, PutAddress };