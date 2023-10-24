import { RowDataPacket } from 'mysql2';
import { HousingCompany } from './HousingCompany';
import { User } from './User';

interface Survey {
  id: number;
  start_date: string;
  end_date: string;
  min_responses: number;
  max_responses: number;
  survey_status: 'ongoing' | 'closed';
  user_id: User | number;
  survey_key: string;
  housing_company_id: HousingCompany | number;
}

interface GetSurvey extends RowDataPacket, Survey {}

type PostSurvey = Omit<Survey, 'id'>;

type PutSurvey = Partial<PostSurvey>;

export { Survey, GetSurvey, PostSurvey, PutSurvey };
