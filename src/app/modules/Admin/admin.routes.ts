import express from 'express';
import { AdminController } from './admin.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AdminValidationSchemas } from './admin.validation';

const router = express.Router();

router.get('/', AdminController.getAllAdminFromDB);
router.get('/:id', AdminController.getSingleAdminFromDB);
router.patch(
  '/:id',
  validateRequest(AdminValidationSchemas.update),
  AdminController.updateAdminInDB
);
router.delete('/:id', AdminController.deleteAdminFromDB);
router.delete('/soft/:id', AdminController.softDeleteAdminFromDB);

export const AdminRoutes = router;
