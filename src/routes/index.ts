
import { Router } from 'express';
import { examRoutes } from './exam.routes';
import { userRoutes } from './user.routes';
import { statsRoutes } from './stats.routes';
import { practiceRoutes } from './practice.routes';
import { questionsRoutes } from './questions.routes';
import {departmentRoutes} from "./department.routes"

const router = Router();

// API routes
router.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
});

router.use('/exam', examRoutes);
router.use('/user', userRoutes);
router.use('/stats', statsRoutes);
router.use('/practice', practiceRoutes);
router.use('/questions', questionsRoutes);
router.use('/departments', departmentRoutes);

export default router;
