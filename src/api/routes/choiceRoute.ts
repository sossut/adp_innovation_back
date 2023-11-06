import express from 'express';
import {
  choiceListGet,
  choiceGet,
  choiceGetByValue,
  choicePost,
  choicePut,
  choiceDelete
} from '../controllers/choiceController';
import { body, param } from 'express-validator';
import passport from 'passport';

const router = express.Router();

router
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), choiceListGet)
  .post(
    passport.authenticate('jwt', { session: false }),
    body('value').isString().notEmpty().escape(),
    body('question_id').isNumeric().notEmpty().escape(),
    choicePost
  );

router
  .route('/:id')
  .get(
    // passport.authenticate('jwt', { session: false }),
    param('id').isNumeric(),
    choiceGet
  )
  .put(
    passport.authenticate('jwt', { session: false }),
    param('id').isNumeric(),
    choicePut
  )
  .delete(
    passport.authenticate('jwt', { session: false }),
    param('id').isNumeric(),
    choiceDelete
  );

router
  .route('/value/:value')
  .get(
    passport.authenticate('jwt', { session: false }),
    param('value').isString().notEmpty().escape(),
    choiceGetByValue
  );

export default router;
