import { validationResult } from 'express-validator';
import { getAllHousingCompanies, getHousingCompany, postHousingCompany, putHousingCompany, deleteHousingCompany } from '../models/housingCompanyModel';
import { Request, Response, NextFunction } from 'express';
import { HousingCompany, PostHousingCompany } from '../../interfaces/HousingCompany';
import CustomError from '../../classes/CustomError';
import MessageResponse from '../../interfaces/MessageResponse';
import { User } from '../../interfaces/User';

const housingCompanyListGet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const housingCompanies = await getAllHousingCompanies();
    console.log(housingCompanies);
    res.json(housingCompanies);
  } catch (error) {
    next(error);
  }
};

const housingCompanyGet = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    throw new CustomError(messages, 400);
  }
  const id = parseInt(req.params.id);
  try {
    const housingCompany = await getHousingCompany(id);
    res.json(housingCompany);
  } catch (error) {
    next(error);
  }
};

const housingCompanyPost = async (req: Request<{}, {}, PostHousingCompany>, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  console.log(req.body);
  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    throw new CustomError(messages, 400);
  }
  try {
    const user = req.user as User;
    req.body.user_id = user.id;
    const result = await postHousingCompany(req.body);
    if (result) {
      const message: MessageResponse = {
        message: 'housing company added',
        id: result,
      };
      res.json(message);
    }
  } catch (error) {
    next(error);
  }
};

const housingCompanyPut = async (req: Request<{ id: string }, {}, HousingCompany>, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    throw new CustomError(messages, 400);
  }
  try {
    const housingCompany = req.body;
    const id = parseInt(req.params.id);
    const result = await putHousingCompany(housingCompany, id, (req.user as User).id, (req.user as User).role);
    if (result) {
      res.json({
        message: 'housing company updated',
        id: result,
      });
    }
  } catch (error) {
    next(error);
  }
};

const housingCompanyDelete = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }
    const result = await deleteHousingCompany(parseInt(req.params.id), (req.user as User).id, (req.user as User).role);
    if (result) {
      const message: MessageResponse = {
        message: 'housing company deleted',
        id: parseInt(req.params.id),
      };
      res.json(message);
    }
  } catch (error) {
    next(error);
  }
};

export { housingCompanyListGet, housingCompanyGet, housingCompanyPost, housingCompanyPut, housingCompanyDelete };