import { validationResult } from 'express-validator';
import {
  getAllResults,
  getResult,
  postResult,
  deleteResult
} from '../models/resultModel';

import { Request, Response, NextFunction } from 'express';
import CustomError from '../../classes/CustomError';
import { PostResult } from '../../interfaces/Result';
import MessageResponse from '../../interfaces/MessageResponse';
import { User } from '../../interfaces/User';

const resultListGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    throw new CustomError(messages, 400);
  }
  if ((req.user as User).role !== 'admin') {
    throw new CustomError('Unauthorized', 401);
  }
  try {
    const results = await getAllResults();
    res.json(results);
  } catch (error) {
    next(error);
  }
};

const resultGet = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getResult(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const resultPost = async (
  req: Request<{}, {}, PostResult>,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    throw new CustomError(messages, 400);
  }
  try {
    req.body.filename = req.file!.filename || 'jotain';
    const result = await postResult(req.body);
    if (result) {
      const message: MessageResponse = {
        message: 'result added',
        id: result
      };
      res.json(message);
    }
  } catch (error) {
    next(error);
  }
};

const resultPut = async (
  req: Request<{ id: string }, {}, PostResult>,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    throw new CustomError(messages, 400);
  }
  try {
    const result = await postResult(req.body);
    if (result) {
      res.json({
        message: 'result updated',
        id: result
      });
    }
  } catch (error) {
    next(error);
  }
};

const resultDelete = async (
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
    const result = await deleteResult(parseInt(req.params.id));
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export { resultListGet, resultGet, resultPost, resultPut, resultDelete };
