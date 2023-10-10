import express from 'express';
import userRoute from './routes/userRoute';
import housingCompanyRoute from './routes/housingCompanyRoute';
import authRoute from './routes/authRoute';
import questionRoute from './routes/questionRoute';
import MessageResponse from '../interfaces/MessageResponse';
import passport from 'passport';


const router = express.Router();
router.use(passport.initialize());

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'routes: auth, users, housing_companies, surveys, results, questions, answers',
  });
});

router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/housing_company', housingCompanyRoute);
router.use('/question', questionRoute);

export default router;
