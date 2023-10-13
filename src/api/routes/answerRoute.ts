import express from 'express';
import { answersBySurveyGet, answerPost, answerDelete } from '../controllers/answerController';
import { body, param } from 'express-validator';
import passport from 'passport';

const router = express.Router();

router
  .route('/')
  .post(
    body('survey_id').isNumeric().notEmpty().escape(),
    body('question_id').isNumeric().notEmpty().escape(),
    body('answer').isString().notEmpty().escape(),
    answerPost,
  );

router
  .route('/:id')
  .get(
    // passport.authenticate('jwt', { session: false }),
    param('id').isNumeric(), answersBySurveyGet)
  .delete(
    passport.authenticate('jwt', { session: false }),
    param('id').isNumeric(), answerDelete);

export default router;