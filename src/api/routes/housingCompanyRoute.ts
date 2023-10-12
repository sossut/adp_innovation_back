import express from 'express';
import { housingCompanyDelete, housingCompanyGet, housingCompanyListGet, housingCompanyPost, housingCompanyPut } from '../controllers/housingCompanyController';
import { body, param } from 'express-validator';
import passport from 'passport';

const router = express.Router();

router
  .route('/')
  .get(
    passport.authenticate('jwt', { session: false }),
    housingCompanyListGet)
  .post(
    passport.authenticate('jwt', { session: false }),
    body('name').isString().isLength({ min: 1, max: 255 }).notEmpty().escape(),
    body('address_id').isNumeric().notEmpty().escape(),
    body('apartment_count').isNumeric().isLength({ min: 1, max: 1000 }).notEmpty().escape(),
    housingCompanyPost,
  );

router
  .route('/:id')
  .get(
    passport.authenticate('jwt', { session: false }),
    param('id').isNumeric(), housingCompanyGet)
  .put(
    passport.authenticate('jwt', { session: false }),
    param('id').isNumeric(),
    housingCompanyPut,
  )
  .delete(
    passport.authenticate('jwt', { session: false }),
    param('id').isNumeric(),
    housingCompanyDelete,
  );

export default router;