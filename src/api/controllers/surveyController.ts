import { validationResult } from 'express-validator';

import {
  getAllSurveys,
  getSurvey,
  postSurvey,
  putSurvey,
  deleteSurvey,
  getSurveyByKey,
  getSurveysByHousingCompany
} from '../models/surveyModel';
import { Request, Response, NextFunction } from 'express';
import CustomError from '../../classes/CustomError';
import { Survey, PostSurvey } from '../../interfaces/Survey';
import { User } from '../../interfaces/User';
import MessageResponse from '../../interfaces/MessageResponse';

const surveyListGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }
    const surveys = await getAllSurveys();
    res.json(surveys);
  } catch (error) {
    next(error);
  }
};

const surveyGet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }
    const survey = await getSurvey(parseInt(req.params.id));
    res.json(survey);
  } catch (error) {
    next(error);
  }
};

const surveyGetByKey = async (
  req: Request<{ key: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }
    const survey = await getSurveyByKey(req.params.key);
    res.json(survey);
  } catch (error) {
    next(error);
  }
};

const surveyListByHousingCompanyGet = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }
    const housingCompanyId = parseInt(req.params.id);
    const surveys = await getSurveysByHousingCompany(housingCompanyId);
    res.json(surveys);
  } catch (error) {
    next(error);
  }
};

const surveyPost = async (
  req: Request<{}, {}, PostSurvey>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }
    const user = req.user as User;
    req.body.user_id = user.id;
    const result = await postSurvey(req.body);
    if (result) {
      const message: MessageResponse = {
        message: 'survey added',
        id: result
      };
      res.json(message);
    }
  } catch (error) {
    next(error);
  }
};

const surveyPut = async (
  req: Request<{ id: string }, {}, Survey>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }
    const survey = req.body;
    const id = parseInt(req.params.id);
    const result = await putSurvey(survey, id);
    if (result) {
      res.json({
        message: 'survey updated',
        id: result
      });
    }
  } catch (error) {
    next(error);
  }
};

const surveyDelete = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }
    const result = await deleteSurvey(parseInt(req.params.id));
    if (result) {
      const message: MessageResponse = {
        message: 'survey deleted',
        id: parseInt(req.params.id)
      };
      res.json(message);
    }
  } catch (error) {
    next(error);
  }
};

export {
  surveyListGet,
  surveyGet,
  surveyPost,
  surveyPut,
  surveyDelete,
  surveyGetByKey,
  surveyListByHousingCompanyGet
};
