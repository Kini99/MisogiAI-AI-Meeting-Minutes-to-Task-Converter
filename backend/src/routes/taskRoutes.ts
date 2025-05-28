import { Router } from 'express';
import { taskController } from '../controllers/taskController';

const router = Router();

router.post('/parse-transcript', taskController.parseTranscript);
router.get('/', taskController.getTasks);
router.patch('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

export default router; 