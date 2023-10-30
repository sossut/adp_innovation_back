import express, { Request } from 'express';
import {
  resultListGet,
  resultGet,
  resultPost,
  resultDelete
} from '../controllers/resultController';
import { body, param } from 'express-validator';
import passport from 'passport';
import multer, { FileFilterCallback } from 'multer';

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ dest: 'uploads/', fileFilter });

const router = express.Router();

router
  .route('/')
  .get(
    // passport.authenticate('jwt', { session: false }),
    resultListGet
  )
  .post(
    passport.authenticate('jwt', { session: false }),
    upload.single('file'),
    body('survey_id').isNumeric().notEmpty().escape(),
    body('filename').isString().notEmpty().escape(),
    resultPost
  );

router
  .route('/:id')
  .get(
    // passport.authenticate('jwt', { session: false }),
    param('id').isNumeric(),
    resultGet
  )
  .delete(
    passport.authenticate('jwt', { session: false }),
    param('id').isNumeric(),
    resultDelete
  );

export default router;
