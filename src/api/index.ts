import express from 'express';
import userRoute from './routes/userRoute';
import cityRoute from './routes/cityRoute';
import postcodeRoute from './routes/postcodeRoute';
import streetRoute from './routes/streetRoute';
import housingCompanyRoute from './routes/housingCompanyRoute';
import authRoute from './routes/authRoute';
import questionRoute from './routes/questionRoute';
import surveyRoute from './routes/surveyRoute';
import answerRoute from './routes/answerRoute';
import MessageResponse from '../interfaces/MessageResponse';
import passport from 'passport';

const router = express.Router();

router.use(passport.initialize());

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message:
      'routes: auth, users, housing_companies, surveys, results, questions, answers'
  });
});

router.use('/auth', authRoute);
router.use('/city', cityRoute);
router.use('/postcode', postcodeRoute);
router.use('/street', streetRoute);
router.use('/user', userRoute);
router.use('/housing-company', housingCompanyRoute);
router.use('/question', questionRoute);
router.use('/survey', surveyRoute);
router.use('/answer', answerRoute);

export default router;
