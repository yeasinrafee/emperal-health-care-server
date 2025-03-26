import express from 'express';
import { UserController } from './user.controller';

const router = express.Router();

router.post('/', UserController.createAdmin);

export const UserRoutes = router;
