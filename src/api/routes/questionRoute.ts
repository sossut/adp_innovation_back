import { body } from 'express-validator';
import express from 'express';
import {
  questionDelete,
  questionGet,
  questionListGet,
  questionPost,
  questionPut
} from '../controllers/questionController';
import passport from 'passport';

const router = express.Router();

router
  .route('/')
  .get(questionListGet)
  .post(
    passport.authenticate('jwt', { session: false }),
    body('question_order').isNumeric().notEmpty().escape(),
    body('question').isString().notEmpty().escape(),
    body('weight').isNumeric().notEmpty().escape(),
    questionPost
  );

router
  .route('/:id')
  .get(questionGet)
  .put(passport.authenticate('jwt', { session: false }), questionPut)
  .delete(passport.authenticate('jwt', { session: false }), questionDelete);

export default router;
