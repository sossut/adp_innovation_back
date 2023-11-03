declare module 'epress';
declare global {
  namespace Express {
    interface Request {
      id: string;
      name: string;
      apartment_count: number;
      user_id: number;
      address_number: string;
      street_name: string;
      postcode_name: string;
      postcode: string;
      city_name: string;
      body: any;
    }
  }
}
