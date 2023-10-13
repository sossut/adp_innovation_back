import { validationResult } from 'express-validator';
import { getAnswersBySurvey, postAnswer, deleteAnswer } from '../models/answerModel';
import { Request, Response, NextFunction } from 'express';
import CustomError from '../../classes/CustomError';
import { PostAnswer } from '../../interfaces/Answer';

const answersBySurveyGet = async (req: Request<{ id: string }, {}, {}>, res: Response, next: NextFunction) => {
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
    const answers = await getAnswersBySurvey(id);
    res.json(answers);
  } catch (error) {
    next(error);
  }
};

const answerPost = async (req: Request<{}, {}, PostAnswer>, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    throw new CustomError(messages, 400);
  }
  try {
    const answer = await postAnswer(req.body);
    res.json(answer);
  } catch (error) {
    next(error);
  }
};

const answerDelete = async (req: Request<{ id: string }, {}, {}>, res: Response, next: NextFunction) => {
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
    const answer = await deleteAnswer(id);
    res.json(answer);
  } catch (error) {
    next(error);
  }
};

export { answersBySurveyGet, answerPost, answerDelete };