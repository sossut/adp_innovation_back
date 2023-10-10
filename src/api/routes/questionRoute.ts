import express from 'express';
import { questionDelete, questionGet, questionListGet, questionPost, questionPut } from '../controllers/questionController';
import passport from 'passport';

const router = express.Router();

router
  .route('/')
  .get(questionListGet)
  .post(passport.authenticate('jwt', { session: false }), questionPost);

router
  .route('/:id')
  .get(questionGet)
  .put(passport.authenticate('jwt', { session: false }), questionPut)
  .delete(passport.authenticate('jwt', { session: false }), questionDelete);

export default router;