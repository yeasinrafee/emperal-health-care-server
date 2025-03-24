import express from 'express';
import { AdminController } from './admin.controller';

const router = express.Router();

router.get('/', AdminController.getAllAdminFromDB);
router.get('/:id', AdminController.getSingleAdminFromDB);
router.patch('/:id', AdminController.updateAdminInDB);
router.delete('/:id', AdminController.deleteAdminFromDB);

export const adminRoutes = router;
