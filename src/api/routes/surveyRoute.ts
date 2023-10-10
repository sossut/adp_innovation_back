import express from 'express';
import { surveyDelete, surveyGet, surveyGetByKey, surveyListGet, surveyPost, surveyPut } from '../controllers/surveyController';
import { body, param } from 'express-validator';
import passport from 'passport';

const router = express.Router();

router
  .route('/')
  .get(surveyListGet)
  .post(
    passport.authenticate('jwt', { session: false }),
    body('name').isString().isLength({ min: 1, max: 255 }).notEmpty().escape(),
    body('housing_company_id').isNumeric().notEmpty().escape(),
    surveyPost,
  );

router
  .route('/:id')
  .get(param('id').isNumeric(), surveyGet)
  .put(
    passport.authenticate('jwt', { session: false }),
    param('id').isNumeric(),
    surveyPut,
  )
  .delete(
    passport.authenticate('jwt', { session: false }),
    param('id').isNumeric(),
    surveyDelete,
  );

router
  .route('/key/:key')
  .get(param('key').isString().notEmpty().escape(), surveyGetByKey);

export default router;