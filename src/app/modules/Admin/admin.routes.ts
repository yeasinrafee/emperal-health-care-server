import express from 'express';
import { AdminController } from './admin.controller';
import validateRequest from '../../middlewares/validateRequest';
import { adminValidationSchemas } from './admin.validation';

const router = express.Router();

router.get('/', AdminController.getAllAdminFromDB);
router.get('/:id', AdminController.getSingleAdminFromDB);
router.patch(
  '/:id',
  validateRequest(adminValidationSchemas.update),
  AdminController.updateAdminInDB
);
router.delete('/:id', AdminController.deleteAdminFromDB);
router.delete('/soft/:id', AdminController.softDeleteAdminFromDB);

export const adminRoutes = router;
